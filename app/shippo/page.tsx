"use client";

import OrdersPage from "@/components/OrdersPage";
import ShippingOptions from "@/components/ShippingOptions";
import TrackingTimeline from "@/components/TrackingTimeline";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const App = () => {
  const searchParams = useSearchParams();

  const [select, setSelect] = useState(0);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const type = searchParams?.get("type");
    const order_number = searchParams?.get("order_number");

    if (type === "label" && order_number) setOrderNumber(order_number);
  }, [searchParams]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row gap-2 mb-4">
        <button
          className={`p-2 px-4 rounded-xl ${
            select === 0
              ? "bg-blue-500 text-white"
              : "border border-blue-500 text-blue-500"
          }`}
          onClick={() => setSelect(0)}
        >
          Orders
        </button>
        <button
          className={`p-2 px-4 rounded-xl ${
            select === 1
              ? "bg-blue-500 text-white"
              : "border border-blue-500 text-blue-500"
          }`}
          onClick={() => setSelect(1)}
        >
          Shipments
        </button>
        <button
          className={`p-2 px-4 rounded-xl ${
            select === 2
              ? "bg-blue-500 text-white"
              : "border border-blue-500 text-blue-500"
          }`}
          onClick={() => setSelect(2)}
        >
          Tracking
        </button>
      </div>
      {select === 0 ? (
        <OrdersPage />
      ) : select === 1 ? (
        <ShippingOptions orderNumber={orderNumber} />
      ) : (
        <TrackingTimeline />
      )}
    </div>
  );
};

export default App;
