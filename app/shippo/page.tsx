"use client";

import OrdersPage from "@/components/OrdersPage";
import ShippingOptions from "@/components/ShippingOptions";
import TrackingTimeline from "@/components/TrackingTimeline";
import { useState } from "react";

const App = () => {
  const [select, setSelect] = useState(0);

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
            select === 0
              ? "bg-blue-500 text-white"
              : "border border-blue-500 text-blue-500"
          }`}
          onClick={() => setSelect(1)}
        >
          Shipments
        </button>
        <button
          className={`p-2 px-4 rounded-xl ${
            select === 1
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
        <ShippingOptions />
      ) : (
        <TrackingTimeline />
      )}
    </div>
  );
};

export default App;
