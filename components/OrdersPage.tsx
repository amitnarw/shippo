"use client";

import React, { useEffect, useState } from "react";
// import {
//   fetchOrders,
//   fetchOrderDetails,
//   createOrder,
//   deleteOrder,
//   createShipment,
//   buyLabel,
// } from "./shippo";
import axios from "axios";

interface Order {
  object_id: string;
  order_number: string;
  order_status: string;
  to_address: any;
  from_address: any;
  line_items: any[];
}

interface ShipmentRate {
  object_id: string;
  amount: string;
  provider: string;
  servicelevel: any;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(
        "http://localhost:3000/api/shippo/order/get-orders"
      );
      setOrders(result?.data?.data);
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

  //   useEffect(() => {
  //     loadOrders();
  //   }, []);

  const handleView = async (orderId: string) => {
    // const data = await fetchOrderDetails(token, orderId);
    // setSelectedOrder(data);
    setModalOpen(true);
  };

  const handleDelete = async (orderId: string) => {
    // await deleteOrder(token, orderId);
    loadOrders();
  };

  const handleCreateShipment = async (order: Order) => {
    // Example: create shipment for the order
    const shipmentData = {
      address_from: order.from_address,
      address_to: order.to_address,
      parcels: order.line_items.map((item) => ({
        length: item.length,
        width: item.width,
        height: item.height,
        distance_unit: "in",
        weight: item.weight,
        mass_unit: "lb",
      })),
      async: false,
    };
    // const shipment = await createShipment(token, shipmentData);
    // Automatically buy the cheapest rate
    // const cheapestRate = shipment.rates?.find((r: any) =>
    //   r.attributes?.includes("CHEAPEST")
    // );
    // if (cheapestRate) {
    //   const label = await buyLabel(
    //     token,
    //     shipment.object_id,
    //     cheapestRate.object_id
    //   );
    //   alert("Label created! " + label.label_url);
    // }
  };

  return (
    <div className="p-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <button
          className="rounded-xl bg-blue-500 text-white p-2 px-4"
          onClick={loadOrders}
        >
          Load all orders
        </button>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        // onClick={async () => {
        //   const newOrder = await createOrder(token, {
        //     order_number: `ORD-${Date.now()}`,
        //     to_address: {
        //       /* fill example */
        //     },
        //     from_address: {
        //       /* fill example */
        //     },
        //     line_items: [],
        //   });
        //   loadOrders();
        //   alert("Order created: " + newOrder.order_number);
        // }}
      >
        Create Order
      </button>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Order #</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.object_id}>
              <td className="border p-2">{order.order_number}</td>
              <td className="border p-2">{order.order_status}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => handleView(order.object_id)}
                >
                  View
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(order.object_id)}
                >
                  Delete
                </button>
                <button
                  className="bg-purple-600 text-white px-2 py-1 rounded"
                  onClick={() => handleCreateShipment(order)}
                >
                  Create Label
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-2/3 max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Order #: </strong>
              {selectedOrder.order_number}
            </p>
            <p>
              <strong>Status: </strong>
              {selectedOrder.order_status}
            </p>
            <p>
              <strong>To: </strong>
              {JSON.stringify(selectedOrder.to_address)}
            </p>
            <p>
              <strong>From: </strong>
              {JSON.stringify(selectedOrder.from_address)}
            </p>
            <h3 className="font-bold mt-2">Items:</h3>
            <ul>
              {selectedOrder.line_items.map((item, idx) => (
                <li key={idx}>
                  {item.title} - {item.quantity} pcs
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
