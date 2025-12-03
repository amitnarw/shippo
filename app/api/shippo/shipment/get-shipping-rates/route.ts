import { createShipment } from "@/services/shippo-api";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    const shippo_token = process.env.SHIPPO_API_KEY;
    if (!shippo_token) {
      return NextResponse.json({
        success: false,
        error: "Shippo token not found",
      });
    }

    const addressFrom = {
      name: "MR Hippo",
      company: "",
      street1: "733 N Kedzie Ave",
      street2: "",
      city: "CHCAGO",
      state: "IL",
      zip: "60612",
      country: "US",
      phone: "4215559099",
      metadata: "Home Office",
      validate: true,
      object_purpose: "PURCHASE",
    };

    const addressTo = {
      name: "Daniel Ricciardo",
      company: "Shippo Racing",
      street1: "9201 Circuit of The Americas Blvd",
      street2: "",
      city: "Del Valle",
      state: "TX",
      zip: "78617",
      country: "US",
      phone: "8778675309",
      email: "totest@goshippo.com",
      metadata: "Customer ID 123456",
      object_purpose: "PURCHASE",
      validate: true,
    };

    const parcel = {
      height: 12.5,
      distance_unit: "in",
      length: 12.5,
      width: 6,
      weight: 12,
      mass_unit: "lb",
    };

    const response = await createShipment(shippo_token, "shippo", {
      address_from: addressFrom,
      address_to: addressTo,
      parcels: [parcel],
      object_purpose: "PURCHASE",
      async: false,
      shipment_date: new Date(),
    });
    const result = await response?.data?.rates;

    return NextResponse.json({ success: true, data: result }, { status: 200 });
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
