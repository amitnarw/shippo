import { createLabel } from "@/services/shippo-api";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { rate_id } = await req.json();
    if (!rate_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Please send rate_id",
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

    const response = await createLabel(shippo_token, "shippo", rate_id);

    return NextResponse.json(
      {
        success: true,
        data: response?.data,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err?.message : JSON.stringify(err),
      },
      { status: 400 }
    );
  }
};
