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
import LoadingIcon from "./loadingIcon";
import { ShippingLabel } from "./ShippingOptions";
import Link from "next/link";

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

  const [createOrderData, setCreateOrderData] = useState({
    to_address: {
      city: "San Francisco",
      company: "Shippo",
      country: "US",
      email: "shippotle@shippo.com",
      name: "Mr Hippo",
      phone: "15553419393",
      state: "CA",
      street1: "215 Clayton St.",
      zip: "94117",
    },
    order_number: "",
    order_status: "PAID",
    line_items: [
      {
        quantity: 1,
        sku: "HM-123",
        title: "Hippo Magazines",
        total_price: "12.10",
        currency: "USD",
        weight: "0.40",
        weight_unit: "lb",
      },
    ],
    shipping_cost: "",
    shipping_cost_currency: "",
    shipping_method: "",
    subtotal_price: "",
    placed_at: new Date(),
    total_price: "",
    total_tax: "",
    currency: "",
    weight: "",
    weight_unit: "",
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createOrderError, setCreateOrderError] = useState("");

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

  const handleCreateOrder = async () => {
    try {
      setIsCreating(true);
      const result = await axios.post(
        "http://localhost:3000/api/shippo/order/create-order",
        {
          ...createOrderData,
        }
      );
      console.log(result?.data, "0000000");
      // loadOrders();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("AXIOS ERROR");
        console.log("Status:", err.response?.status);
        console.log("Body:", err.response?.data);
        setCreateOrderError(err.response?.data?.error);
      } else {
        console.log("Unknown error", err);
        setCreateOrderError(JSON.stringify(err));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const addMoreItems = () => {
    setCreateOrderData((preVal) => ({
      ...preVal,
      line_items: [
        ...createOrderData?.line_items,
        {
          quantity: 1,
          sku: "HM-123",
          title: "Hippo Magazines",
          total_price: "12.10",
          currency: "USD",
          weight: "0.40",
          weight_unit: "lb",
        },
      ],
    }));
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="space-x-2">
          <button
            className="rounded-xl bg-blue-500 text-white p-2 px-4"
            onClick={loadOrders}
            disabled={isLoading}
          >
            Load all orders
          </button>

          <button
            className="rounded-xl bg-blue-500 text-white p-2 px-4"
            onClick={() => setCreateModalOpen(true)}
          >
            Create Order
          </button>
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Order #</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders?.length && !isLoading
            ? orders.map((order) => (
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
                    <Link
                      href={`/shippo?type=label&order_number=${order?.order_number}`}
                      className="bg-purple-600 text-white px-2 py-1 rounded"
                    >
                      Create Label
                    </Link>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
      {!orders?.length && !isLoading && (
        <p className="text-gray-500 text-center mt-5">No orders found</p>
      )}
      {isLoading && <LoadingIcon />}

      {/* Modals */}
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

      {createModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-2/3 max-h-[80vh] overflow-auto">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold mb-4">Create order</h2>
              <button className="p-2" onClick={() => setCreateModalOpen(false)}>
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
            <div className="flex flex-row gap-4 items-center mt-6">
              <label htmlFor="order_number">Order number</label>
              <input
                name="order_number"
                id="order_number"
                className="bg-gray-100 p-2 rounded-lg w-full"
                value={createOrderData?.order_number}
                onChange={(e) =>
                  setCreateOrderData((preVal) => ({
                    ...preVal,
                    order_number: e?.target?.value,
                  }))
                }
              />
            </div>

            <h3 className="font-bold mt-6">To Address</h3>
            <div className="grid grid-cols-2 gap-2 gap-x-8 mt-2">
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="city">City</label>
                <input
                  name="city"
                  id="city"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.city}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        city: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="company">Company</label>
                <input
                  name="company"
                  id="company"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.company}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        company: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="country">Country</label>
                <input
                  name="country"
                  id="country"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.country}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        country: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  id="email"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.email}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        email: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="name">Name</label>
                <input
                  name="name"
                  id="name"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.name}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        name: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="phone">Phone</label>
                <input
                  name="phone"
                  id="phone"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.phone}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        phone: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="state">State</label>
                <input
                  name="state"
                  id="state"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.state}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        state: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="street1">Street1</label>
                <input
                  name="street1"
                  id="street1"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.street1}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        street1: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="flex flex-row gap-4 items-center">
                <label htmlFor="zip">Zip</label>
                <input
                  name="zip"
                  id="zip"
                  className="bg-gray-100 p-2 rounded-lg w-full"
                  value={createOrderData?.to_address?.zip}
                  onChange={(e) =>
                    setCreateOrderData((preVal) => ({
                      ...preVal,
                      to_address: {
                        ...createOrderData?.to_address,
                        zip: e?.target?.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between mt-5">
              <h3 className="font-bold">Line items</h3>
              <button
                onClick={addMoreItems}
                className="p-1 rounded-full bg-blue-500 text-white"
              >
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
                  className="lucide lucide-plus-icon lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {createOrderData?.line_items?.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-2 gap-x-8 bg-blue-100 rounded-lg p-2"
                >
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.quantity}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            quantity: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="sku">Sku</label>
                    <input
                      name="sku"
                      id="sku"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.sku}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            sku: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="title">Title</label>
                    <input
                      name="title"
                      id="title"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.title}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            title: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="total_price">Total price</label>
                    <input
                      name="total_price"
                      id="total_price"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.total_price}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            total_price: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="currency">Currency</label>
                    <input
                      name="currency"
                      id="currency"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.currency}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            currency: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="weight">Weight</label>
                    <input
                      name="weight"
                      id="weight"
                      className="bg-white p-2 rounded-lg w-full"
                      value={createOrderData?.line_items[index]?.weight}
                      onChange={(e) =>
                        setCreateOrderData((preVal) => ({
                          ...preVal,
                          line_items: {
                            ...createOrderData?.line_items,
                            weight: e?.target?.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            {isCreating ? (
              <LoadingIcon />
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-800 duration-300 rounded-lg p-2 px-4 text-white mt-8 w-full"
                onClick={handleCreateOrder}
              >
                Create order
              </button>
            )}
            {createOrderError ? (
              <p className="text-sm text-red-500 mt-2">{createOrderError}</p>
            ) : null}
          </div>
        </div>
      )}

      {}
    </div>
  );
};

export default OrdersPage;
