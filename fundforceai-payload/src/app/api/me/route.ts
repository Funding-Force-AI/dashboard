import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
}

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export const GET = async () => {
  try {
    const payload = await getPayload({
      config: configPromise,
    })

    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    if (!user) {
      return Response.json(
        {
          ok: false,
          user: null,
          error: 'Not authenticated',
        },
        {
          status: 401,
          headers: corsHeaders,
        },
      )
    }

    return Response.json(
      {
        ok: true,
        user,
      },
      {
        headers: corsHeaders,
      },
    )
  } catch (error: any) {
    console.error('/api/me error:', error)

    return Response.json(
      {
        ok: false,
        error: error?.message || 'Failed to load current user',
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}