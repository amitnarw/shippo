"use client";

import axios from "axios";
import React, { useState } from "react";
import LoadingIcon from "./loadingIcon";

interface ServiceLevel {
  name: string;
  display_name?: string | null;
  token: string;
}

interface ShippingOption {
  object_id: string;
  provider: string;
  provider_image_200: string;
  amount: string;
  currency: string;
  duration_terms: string;
  arrives_by: string | null;
  estimated_days: number;
  attributes: string[];
  servicelevel: ServiceLevel;
}

export interface ShippingLabel {
  object_state: string;
  status: string;
  object_created: string;
  object_updated: string;
  object_id: string;
  object_owner: string;
  test: boolean;
  rate: string;
  tracking_number: string;
  tracking_status: string;
  eta: null | string;
  tracking_url_provider: string;
  label_url: string;
  commercial_invoice_url: null | string;
  messages: [
    {
      source: string;
      code: string;
      text: string;
    }
  ];
  order: null | string;
  metadata: string;
  parcel: string;
  billing: {
    payments: [];
  };
  qr_code_url: null | string;
  created_by: {
    first_name: string;
    last_name: string;
    username: string;
  };
}

const ShippingOptions = ({ orderNumber }: { orderNumber: string }) => {
  let labelCreationBody = {};
  if (orderNumber) {
    labelCreationBody = {
      orderNumber,
    };
  }
  const [isLoading, setIsLoading] = useState(false);
  const [carrierData, setCarrierData] = useState<ShippingOption[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<ShippingOption | null>(
    null
  );

  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLabel, setGeneratedLabel] = useState<
    ShippingLabel | undefined
  >();
  const [modalError, setModalError] = useState("");

  // useEffect(() => {
  //   getShippingDetails();
  // }, []);

  const handleLoadList = () => {
    getShippingDetails();
  };

  const getShippingDetails = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(
        "http://localhost:3000/api/shippo/shipment/get-shipping-rates",
        labelCreationBody
      );
      setCarrierData(result?.data?.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("AXIOS ERROR");
        console.log("Status:", err.response?.status);
        console.log("Body:", err.response?.data);
      } else {
        console.log("Unknown error", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectRate = (data: ShippingOption) => {
    setSelectedCarrier(data);
    setShowModal(true);
    setGeneratedLabel(undefined);
  };

  const generateShippingLabel = async () => {
    try {
      setIsGenerating(true);
      const result = await axios.post(
        "http://localhost:3000/api/shippo/shipment/create-label",
        {
          rate_id: selectedCarrier?.object_id,
        }
      );
      setGeneratedLabel(result?.data?.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("AXIOS ERROR");
        console.log("Status:", err.response?.status);
        console.log("Body:", err.response?.data);
        setModalError(err.response?.data?.error);
      } else {
        setModalError(JSON.stringify(err) || "Error");
        console.log("Unknown error", err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold mb-6">Choose Shipping Option</h1>
        <button
          className="rounded-xl bg-blue-500 text-white p-2 px-4"
          onClick={handleLoadList}
        >
          Load list
        </button>
      </div>
      {isLoading ? (
        <div className="w-full">
          <LoadingIcon />
        </div>
      ) : !carrierData?.length ? (
        <p className="text-gray-300">No data available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {carrierData.map((option) => (
            <div
              key={option.object_id}
              className="border rounded-lg p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={option.provider_image_200}
                  alt={option.provider}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="text-lg font-semibold">
                    {option.servicelevel.display_name ||
                      option.servicelevel.name}
                  </h3>
                  <p className="text-sm text-gray-500">{option.provider}</p>
                </div>
              </div>

              <div className="mt-4">
                {option.arrives_by && (
                  <p className="text-sm text-gray-600">
                    Arrives by: {option.arrives_by}
                  </p>
                )}
                <p className="text-sm text-gray-600">{option.duration_terms}</p>
                <p className="mt-2 font-bold text-lg">
                  {option.amount} {option.currency}
                </p>

                {option.attributes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {option.attributes.map((attr) => (
                      <span
                        key={attr}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  selectRate(option);
                }}
                className="mt-4 w-full py-2 rounded-md font-semibold transition-colors duration-300 border border-blue-500 hover:border-blue-800 text-blue-500 hover:bg-gray-100"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
      <Modal
        showModal={showModal}
        closeModal={closeModal}
        data={selectedCarrier}
        generateShippingLabel={generateShippingLabel}
        isGenerating={isGenerating}
        generatedLabel={generatedLabel}
        error={modalError}
      />
    </div>
  );
};

export default ShippingOptions;

const Modal = ({
  showModal,
  closeModal,
  data,
  generateShippingLabel,
  isGenerating,
  generatedLabel,
  error,
}: {
  showModal: boolean;
  closeModal: () => void;
  data: ShippingOption | null;
  generateShippingLabel: () => void;
  isGenerating: boolean;
  generatedLabel: ShippingLabel | undefined;
  error: string;
}) => {
  return (
    <div
      className={`bg-black/50 h-screen w-full flex items-center justify-center ${
        showModal ? "inset-0 fixed" : "hidden"
      }`}
    >
      <div className="rounded-2xl bg-white flex flex-col w-xl max-h-11/12 p-4 overflow-y-auto">
        <div className="flex justify-between">
          <div></div>
          <h2 className="font-bold">Generate shipping label</h2>
          <button onClick={() => closeModal()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="my-8 flex flex-col gap-2">
          <div className="space-x-2">
            <span>Name:</span>
            <span>
              {data?.servicelevel?.display_name || data?.servicelevel?.name}
            </span>
          </div>
          <div className="space-x-2">
            <span>Price:</span>
            <span>
              {data?.amount} {data?.currency}
            </span>
          </div>
          <div className="space-x-2">
            <span>Estimated days:</span>
            <span>{data?.estimated_days}</span>
          </div>
        </div>
        <div>
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <LoadingIcon />
            </div>
          ) : (
            <button
              className="bg-black rounded-lg text-white w-full p-2"
              onClick={generateShippingLabel}
            >
              Generate
            </button>
          )}
        </div>
        {generatedLabel?.status === "SUCCESS" && (
          <div className="space-y-1 mt-5">
            <p>
              <span className="text-gray-500">Created by: </span>
              <span>
                {generatedLabel?.created_by?.first_name}{" "}
                {generatedLabel?.created_by?.last_name}
              </span>
            </p>
            <p className="break-all">
              <span className="text-gray-500">Shipping label URL: </span>
              <a
                href={generatedLabel?.label_url}
                className="text-blue-500 underline"
                target="_blank"
              >
                URL
              </a>
            </p>
            <p>
              <span className="text-gray-500">Tracking number: </span>
              <span>{generatedLabel?.tracking_number}</span>
            </p>
            <p>
              <span className="text-gray-500">Tracking status: </span>
              <span>{generatedLabel?.tracking_status}</span>
            </p>
            <p>
              <span className="text-gray-500">Tracking url: </span>
              <a
                href={generatedLabel?.tracking_url_provider}
                className="text-blue-500 underline"
                target="_blank"
              >
                URL
              </a>
            </p>
            <p>
              <span className="text-gray-500">Created at: </span>
              <span>{formatShippoDate(generatedLabel?.object_created)}</span>
            </p>

            <div style={{ width: "100%", height: "100vh" }}>
              <iframe
                src={generatedLabel?.label_url}
                width="100%"
                height="100%"
                style={{ border: "none" }}
                title="PDF Viewer"
              ></iframe>
            </div>
          </div>
        )}
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  );
};

function formatShippoDate(isoString: string): string {
  const date = new Date(isoString);

  const day = date.getUTCDate();
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year} at ${hours}:${minutes}`;
}
