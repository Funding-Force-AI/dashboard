import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const users = await payload.find({
    collection: 'users',
    limit: 10,
  })

  return Response.json({
    message: 'Funding API connected',
    userCount: users.totalDocs,
    users: users.docs,
  })
}
