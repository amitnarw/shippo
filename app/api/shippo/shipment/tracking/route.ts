import { trackShipment } from "@/services/shippo-api";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const carrier = searchParams.get("carrier");
    const tracking_number = searchParams.get("tracking_number");

    if (!carrier || !tracking_number) {
      return NextResponse.json(
        {
          success: false,
          error: "Please send carrier and tracking number",
        },
        { status: 400 }
      );
    }

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

    const response = await trackShipment(
      shippo_token,
      "shippo",
      carrier,
      tracking_number
    );

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
