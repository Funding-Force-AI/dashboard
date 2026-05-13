import configPromise from '@payload-config'
import { getPayload } from 'payload'

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'no-store',
}

const DEFAULT_FIRM_AVAILABLE_CAPITAL = 25840000

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}

function getVendorAmount(vendor) {
  return Number(vendor?.amount || 0)
}

function isCompleted(status) {
  return status === 'completed'
}

function isProcessing(status) {
  return status === 'processing'
}

function isToday(value) {
  if (!value) return false

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

export const GET = async () => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const clientsResult = await payload.find({
      collection: 'clients',
      limit: 1000,
      sort: '-createdAt',
    })

    const clients = clientsResult.docs || []

    const firmAvailableCapital =
      Number(process.env.AVAILABLE_CAPITAL || 0) || DEFAULT_FIRM_AVAILABLE_CAPITAL

    let totalPlannedCapital = 0
    let pendingDisbursement = 0
    let inFlight = 0
    let completedCapital = 0
    let disbursedToday = 0

    let vendorLineCount = 0
    let pendingCount = 0
    let processingCount = 0
    let completedCount = 0

    for (const client of clients) {
      const vendors = client.vendors || []

      for (const vendor of vendors) {
        const amount = getVendorAmount(vendor)
        const status = normalizeStatus(vendor.status)

        vendorLineCount += 1
        totalPlannedCapital += amount

        if (isCompleted(status)) {
          completedCapital += amount
          completedCount += 1

          if (isToday(vendor.completedAt || vendor.updatedAt)) {
            disbursedToday += amount
          }

          continue
        }

        if (isProcessing(status)) {
          inFlight += amount
          processingCount += 1
          continue
        }

        pendingDisbursement += amount
        pendingCount += 1
      }
    }

    const availableAfterPlanned = firmAvailableCapital - totalPlannedCapital
    const availableAfterCompleted = firmAvailableCapital - completedCapital

    return Response.json(
      {
        ok: true,
        message: 'Firm-wide admin metrics loaded',
        metrics: {
          firmAvailableCapital,
          availableCapital: firmAvailableCapital,
          availableAfterPlanned,
          availableAfterCompleted,
          totalPlannedCapital,
          pendingDisbursement,
          inFlight,
          completedCapital,
          disbursedToday: disbursedToday || completedCapital,
          merchantCount: clientsResult.totalDocs,
          vendorLineCount,
          pendingCount,
          processingCount,
          completedCount,
        },
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error) {
    console.error('Metrics route error:', error)

    return Response.json(
      {
        ok: false,
        error: error?.message || 'Failed to load metrics',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}
