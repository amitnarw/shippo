import { createOrder } from "@/services/shippo-api";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const shippo_token = process.env.SHIPPO_API_KEY;
    if (!shippo_token) {
      return NextResponse.json(
        {
          success: false,
          error: "Shippo token not found",
        },
        { status: 404 }
      );
    }

    const valid_order_status = {
      UNKNOWN: "UNKNOWN", // fallback in case no other value is given
      AWAITPAY: "AWAITPAY", // awaiting payment by buyer
      PAID: "PAID", // paid by buyer
      REFUNDED: "REFUNDED", // refunded payment to buyer
      CANCELLED: "CANCELLED", // canceled by buyer
      PARTIALLY_FULFILLED: "PARTIALLY_FULFILLED", // some, but not all of the order items have been fulfilled
      SHIPPED: "SHIPPED", // all order items have been shipped
    };

    const {
      to_address,
      order_number,
      order_status,
      line_items,
      shipping_cost,
      shipping_cost_currency,
      shipping_method,
      subtotal_price,
      placed_at,
      total_price,
      total_tax,
      currency,
      weight,
      weight_unit,
    } = await req.json();

    if (!to_address || !order_number || !order_status) {
      return NextResponse.json(
        {
          success: false,
          error: "Please send to address, order number and order status",
        },
        { status: 400 }
      );
    }

    const checkStatus =
      Object.values(valid_order_status)?.includes(order_status);
    if (!checkStatus) {
      return NextResponse.json(
        {
          success: false,
          error: "Please send valid order status",
        },
        { status: 400 }
      );
    }

    const orderData = {
      to_address,
      order_number,
      order_status,
      line_items,
      shipping_cost,
      shipping_cost_currency,
      shipping_method,
      subtotal_price,
      placed_at,
      total_price,
      total_tax,
      currency,
      weight,
      weight_unit,
    };

    const response = await createOrder(shippo_token, "shippo", orderData);
    return NextResponse.json(
      {
        success: true,
        data: response?.data,
      },
      { status: 200 }
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: `Status: ${err.response?.status} Data: ${JSON.stringify(
            err.response?.data
          )}`,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: err instanceof Error ? err?.message : JSON.stringify(err),
        },
        { status: 400 }
      );
    }
  }
};
