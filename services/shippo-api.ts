import axios, { AxiosResponse } from "axios";

export type AuthType = "shippo" | "oauth";

// Build headers depending on auth type
function getAuthHeader(token: string, type: AuthType) {
  return type === "shippo"
    ? { Authorization: `ShippoToken ${token}` }
    : { Authorization: `Bearer ${token}` };
}

// Create a shipment
export async function createShipment(
  token: string,
  authType: AuthType,
  data: any
): Promise<AxiosResponse> {
  return axios.post("https://api.goshippo.com/shipments/", data, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token, authType),
    },
  });
}

// Create Label (Transaction)
export async function createLabel(
  token: string,
  authType: AuthType,
  rateId: string
): Promise<AxiosResponse> {
  return axios.post(
    "https://api.goshippo.com/transactions/",
    {
      rate: rateId,
      async: false,
      label_file_type: "PDF",
    },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token, authType),
      },
    }
  );
}

// Validate Address
export async function validateAddress(
  token: string,
  authType: AuthType,
  address: any
): Promise<AxiosResponse> {
  return axios.post(
    "https://api.goshippo.com/addresses/",
    { ...address, validate: true },
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(token, authType),
      },
    }
  );
}

// Get Shipment
export async function getShipment(
  token: string,
  authType: AuthType,
  shipmentId: string
): Promise<AxiosResponse> {
  return axios.get(`https://api.goshippo.com/shipments/${shipmentId}/`, {
    headers: {
      ...getAuthHeader(token, authType),
    },
  });
}

// Tracking
export async function trackShipment(
  token: string,
  authType: AuthType,
  carrier: string,
  trackingNumber: string,
  metadata?: string
): Promise<AxiosResponse> {
  return axios.post(
    "https://api.goshippo.com/tracks/",
    new URLSearchParams({
      carrier,
      tracking_number: trackingNumber,
      ...(metadata ? { metadata } : {}),
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...getAuthHeader(token, authType),
      },
    }
  );
}


// Orders
export async function fetchOrders(token: string, authType: AuthType) {
  return await axios.get(`https://api.goshippo.com/orders`, {
    headers: {
      ...getAuthHeader(token, authType),
    },
  });
}

export async function fetchOrderDetails(
  token: string,
  authType: AuthType,
  orderId: string
) {
  return await axios.get(`https://api.goshippo.com/orders/${orderId}`, {
    headers: {
      ...getAuthHeader(token, authType),
    },
  });
}

export async function createOrder(
  token: string,
  authType: AuthType,
  orderData: any
) {
  const res = await axios.post(`https://api.goshippo.com/orders`, orderData, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(token, authType),
    },
  });
  return res.data;
}

export async function deleteOrder(
  token: string,
  authType: AuthType,
  orderId: string
) {
  return await axios.delete(`https://api.goshippo.com/orders/${orderId}`, {
    headers: {
      ...getAuthHeader(token, authType),
    },
  });
}
