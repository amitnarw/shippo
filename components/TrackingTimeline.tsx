"use client";

import axios from "axios";
import React, { useState } from "react";
import LoadingIcon from "./loadingIcon";

function formatShippoDate(isoString: string): string {
  if (!isoString) return "";
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

const carriers = [
  {
    id: "shippo",
    name: "Shippo",
    logo: "https://docs.goshippo.com/static/logo-43fa153aeaf26f72683eec7fe116c7b6.svg",
  },
  {
    id: "ups",
    name: "UPS",
    logo: "https://shippo-static.s3.amazonaws.com/providers/200/UPS.png",
  },
  {
    id: "usps",
    name: "USPS",
    logo: "https://shippo-static.s3.amazonaws.com/providers/200/USPS.png",
  },
  {
    id: "fedex",
    name: "FedEx",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/FedEx_Corporation_-_2016_Logo.svg",
  },
  {
    id: "dhl",
    name: "DHL",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/375px-DHL_Logo.svg.png",
  },
];

interface TrackingData {
  tracking_number: string;
  carrier: string;
  servicelevel: {
    name: string;
    token: string;
  };
  transaction: string;
  address_from: {
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  address_to: {
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  eta: string;
  original_eta: string;
  metadata: string;
  test: boolean;
  tracking_status: {
    status_date: string;
    status_details: string;
    location: {
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    substatus: string;
    object_created: string;
    object_updated: string;
    object_id: string;
    status: string;
  };
  tracking_history: [
    {
      status_date: string;
      status_details: string;
      location: {
        city: string;
        state: string;
        zip: string;
        country: string;
      };
      substatus: string;
      object_created: string;
      object_updated: string;
      object_id: string;
      status: string;
    }
  ];
  messages: [];
}

export default function TrackingTimeline() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("Shippo");

  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchTracking = async () => {
    setError("");
    if (!trackingNumber || !carrier) {
      window.alert("Please input tracking number and carrier");
    }
    try {
      setIsLoading(true);
      const result = await axios.get(
        "http://localhost:3000/api/shippo/shipment/tracking" +
          "?tracking_number=" +
          trackingNumber +
          "&carrier=" +
          carrier
      );
      setTracking(result?.data?.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(JSON.stringify(err.response?.data?.error));
      } else {
        setError(JSON.stringify(err));
        console.log("Unknown error", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 overflow-hidden">
      {/* Input Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Track Your Package</h2>

        <p className="text-sm text-gray-500 mb-2">
          Tracking number (Use SHIPPO_TRANSIT for testing)
        </p>
        <input
          type="text"
          placeholder="Enter tracking number"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <div>
          <label className="block text-sm text-gray-600 mb-2">Carrier</label>
          <div className="flex items-center gap-3">
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full"
            >
              {carriers.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <img
              src={carriers.find((c) => c.name === carrier)?.logo}
              alt={carrier}
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingIcon />
        ) : (
          <button
            onClick={fetchTracking}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300"
          >
            Track Package
          </button>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {tracking && (
        <div className="space-y-6 mt-6 pt-6 border-t overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{tracking.carrier}</p>
              <p className="text-gray-500 text-sm">
                #{tracking.tracking_number}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-600 text-sm">Current Status</p>
            <p className="text-lg font-bold text-blue-600">
              {tracking?.tracking_status?.status}
            </p>

            {tracking.eta && (
              <p className="text-sm text-gray-600 mt-1">
                ETA: {formatShippoDate(tracking.eta)}
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {tracking?.tracking_history?.map((event, i) => (
              <div key={i} className="relative flex gap-4">
                {/* Dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      i === 0 ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  />
                  {i < tracking?.tracking_history?.length - 1 && (
                    <div className="flex-1 w-px bg-gray-300"></div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <p className="font-medium">{event.status}</p>
                  {event.substatus && (
                    <p className="text-sm text-gray-600">{event.substatus}</p>
                  )}
                  {event?.status_details && (
                    <p className="text-sm text-gray-600">
                      {event?.status_details}
                    </p>
                  )}
                  {event.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {event?.location?.city}, {event?.location?.state},{" "}
                      {event?.location?.country}, {event?.location?.zip}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {formatShippoDate(event.status_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
