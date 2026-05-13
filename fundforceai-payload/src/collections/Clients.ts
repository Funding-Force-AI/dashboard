import type { CollectionConfig } from 'payload'

function isSuperAdmin(user: any) {
  return user?.role === 'super_admin'
}

function isAdmin(user: any) {
  return user?.role === 'admin'
}

function isClient(user: any) {
  return user?.role === 'client'
}

function isSuperAdminOrAdmin(user: any) {
  return isSuperAdmin(user) || isAdmin(user)
}

function getRelatedClientId(user: any) {
  if (!user?.relatedClient) return null

  return typeof user.relatedClient === 'object'
    ? user.relatedClient.id
    : user.relatedClient
}

export const Clients: CollectionConfig = {
  slug: 'clients',

  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'externalId',
      'name',
      'category',
      'status',
      'totalAllocation',
      'signedAt',
    ],
  },

  access: {
    admin: ({ req: { user } }) => {
      return isSuperAdminOrAdmin(user)
    },

    read: ({ req: { user } }) => {
      if (!user) return false

      if (isSuperAdminOrAdmin(user)) {
        return true
      }

      if (isClient(user)) {
        const relatedClientId = getRelatedClientId(user)

        if (!relatedClientId) return false

        return {
          id: {
            equals: relatedClientId,
          },
        }
      }

      return false
    },

    create: ({ req: { user } }) => {
      return isSuperAdminOrAdmin(user)
    },

    update: ({ req: { user } }) => {
      return isSuperAdminOrAdmin(user)
    },

    delete: ({ req: { user } }) => {
      return isSuperAdmin(user)
    },
  },

  fields: [
    {
      name: 'externalId',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Public-facing client ID, for example FF-2841.',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'signedAt',
      type: 'text',
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'Ready',
      options: [
        { label: 'Selected', value: 'Selected' },
        { label: 'Ready', value: 'Ready' },
        { label: 'Review', value: 'Review' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' },
      ],
    },
    {
      name: 'pointOfContact',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'ein',
      type: 'text',
      admin: {
        description:
          'Sensitive business identifier. Mask this on the frontend if shown.',
      },
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'totalAllocation',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        description:
          'Dollar amount, not cents, to match current frontend mock shape.',
      },
    },
    {
      name: 'vendors',
      type: 'array',
      fields: [
        {
          name: 'vendorId',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'purpose',
          type: 'text',
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Dollar amount, not cents.',
          },
        },
        {
          name: 'method',
          type: 'select',
          defaultValue: 'Card',
          options: [
            { label: 'Card', value: 'Card' },
            { label: 'ACH', value: 'ACH' },
            { label: 'Manual', value: 'Manual' },
          ],
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'Pending',
          options: [
            { label: 'Pending', value: 'Pending' },
            { label: 'Processing', value: 'Processing' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Failed', value: 'Failed' },
          ],
        },
      ],
    },
    {
      name: 'history',
      type: 'array',
      fields: [
        {
          name: 'eventId',
          type: 'text',
          required: true,
        },
        {
          name: 'action',
          type: 'text',
          required: true,
        },
        {
          name: 'time',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}