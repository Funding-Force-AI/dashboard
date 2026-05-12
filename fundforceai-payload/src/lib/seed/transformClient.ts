type MockVendor = {
  id: string
  name: string
  purpose: string
  amount: number
  method: string
  status: string
}

type MockHistoryEvent = {
  id: string
  action: string
  time: string
}

type MockClient = {
  id: string
  name: string
  signedAt: string
  category: string
  status: string
  pointOfContact: string
  email: string
  phone: string
  ein: string
  address: string
  vendors: MockVendor[]
  history: MockHistoryEvent[]
}

export function toPayloadClient(client: MockClient) {
  return {
    externalId: client.id,
    name: client.name,
    signedAt: client.signedAt,
    category: client.category,
    status: client.status,
    pointOfContact: client.pointOfContact,
    email: client.email,
    phone: client.phone,
    ein: client.ein,
    address: client.address,
    totalAllocation: client.vendors.reduce((sum, vendor) => sum + Number(vendor.amount || 0), 0),
    vendors: client.vendors.map((vendor) => ({
      vendorId: vendor.id,
      name: vendor.name,
      purpose: vendor.purpose,
      amount: vendor.amount,
      method: vendor.method,
      status: vendor.status,
    })),
    history: client.history.map((event) => ({
      eventId: event.id,
      action: event.action,
      time: event.time,
    })),
  }
}
