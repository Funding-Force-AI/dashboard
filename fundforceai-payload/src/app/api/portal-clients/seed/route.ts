/**
 * POST /api/portal-clients/seed
 *
 * ⚠️  TEMPORARILY PUBLIC — no auth required for first boot.
 *     After running once, replace this file with the locked version.
 *
 * Creates:
 *   - 1 super_admin user (admin@merbi.com)
 *   - 1 admin user (ops@merbi.com)
 *   - 13 client businesses with vendor allocations
 *   - 13 client user logins (one per business, linked via relatedClient)
 *
 * Safe to run multiple times — skips existing records.
 */

import { withPublic, withCors, apiJson } from '@/lib/apiHandler'
import { seedUsers, seedClients } from '@/lib/seed/seedData'

export const OPTIONS = withCors()

export const GET = withPublic(async () => {
  return apiJson({
    ok: true,
    message: 'Seed route ready. Use POST to run.',
    adminUsers: seedUsers.length,
    clients: seedClients.length,
  })
})

export const POST = withPublic(async ({ payload }) => {
  const results = {
    adminsCreated: [] as string[],
    adminsSkipped: [] as string[],
    clientsCreated: [] as string[],
    clientsSkipped: [] as string[],
    clientUsersCreated: [] as string[],
    clientUsersSkipped: [] as string[],
  }

  // ------------------------------------------------------------------
  // 1. Create admin/operator users
  // ------------------------------------------------------------------
  for (const adminUser of seedUsers) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: adminUser.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      results.adminsSkipped.push(adminUser.email)
      continue
    }

    await payload.create({
      collection: 'users',
      data: {
        email: adminUser.email,
        password: adminUser.password,
        fullName: adminUser.fullName,
        role: adminUser.role,
      },
      overrideAccess: true,
    })

    results.adminsCreated.push(adminUser.email)
  }

  // ------------------------------------------------------------------
  // 2. Create client businesses + linked user logins
  // ------------------------------------------------------------------
  for (const seedClient of seedClients) {

    let clientRecord: any = null

    const existingClient = await payload.find({
      collection: 'clients',
      where: { externalId: { equals: seedClient.externalId } },
      limit: 1,
      overrideAccess: true,
    })

    if (existingClient.docs.length > 0) {
      clientRecord = existingClient.docs[0]
      results.clientsSkipped.push(seedClient.externalId)
    } else {
      clientRecord = await payload.create({
        collection: 'clients',
        data: {
          externalId: seedClient.externalId,
          name: seedClient.name,
          signedAt: seedClient.signedAt,
          category: seedClient.category,
          status: seedClient.status,
          pointOfContact: seedClient.pointOfContact,
          email: seedClient.email,
          phone: seedClient.phone,
          ein: seedClient.ein,
          address: seedClient.address,
          totalAllocation: seedClient.totalAllocation,
          vendors: seedClient.vendors,
          history: seedClient.history,
        },
        overrideAccess: true,
      })
      results.clientsCreated.push(seedClient.externalId)
    }

    const existingUser = await payload.find({
      collection: 'users',
      where: { email: { equals: seedClient.userEmail } },
      limit: 1,
      overrideAccess: true,
    })

    if (existingUser.docs.length > 0) {
      results.clientUsersSkipped.push(seedClient.userEmail)
      continue
    }

    await payload.create({
      collection: 'users',
      data: {
        email: seedClient.userEmail,
        password: seedClient.userPassword,
        fullName: seedClient.userFullName,
        role: 'client',
        relatedClient: clientRecord.id,
      },
      overrideAccess: true,
    })

    results.clientUsersCreated.push(seedClient.userEmail)
  }

  return apiJson({
    ok: true,
    message: 'Seed complete — NOW REPLACE THIS FILE WITH THE LOCKED VERSION',
    results,
    loginCredentials: {
      superAdmin: { email: 'admin@merbi.com', password: 'MerbiAdmin2026' },
      admin: { email: 'ops@merbi.com', password: 'MerbiOps2026' },
      clients: seedClients.map((c) => ({
        business: c.name,
        email: c.userEmail,
        password: c.userPassword,
        totalAllocation: c.totalAllocation,
      })),
    },
  })
})
