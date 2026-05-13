import type { CollectionConfig } from 'payload'

function isSuperAdmin(user: any) {
  return user?.role === 'super_admin'
}

function isAdmin(user: any) {
  return user?.role === 'admin'
}

function isSuperAdminOrAdmin(user: any) {
  return isSuperAdmin(user) || isAdmin(user)
}

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'role', 'relatedClient'],
  },

  access: {
    admin: ({ req: { user } }) => {
      return isSuperAdminOrAdmin(user)
    },

    read: ({ req: { user } }) => {
      if (!user) return false

      if (isSuperAdmin(user)) {
        return true
      }

      if (isAdmin(user)) {
        return {
          role: {
            not_equals: 'super_admin',
          },
        }
      }

      return {
        id: {
          equals: user.id,
        },
      }
    },

    create: ({ req: { user }, data }) => {
      if (!user) return false

      if (isSuperAdmin(user)) {
        return true
      }

      if (isAdmin(user)) {
        return data?.role === 'client'
      }

      return false
    },

    update: ({ req: { user }, data }) => {
      if (!user) return false

      if (isSuperAdmin(user)) {
        return true
      }

      if (isAdmin(user)) {
        if (data?.role && data.role !== 'client') {
          return false
        }

        return {
          role: {
            equals: 'client',
          },
        }
      }

      return {
        id: {
          equals: user.id,
        },
      }
    },

    delete: ({ req: { user } }) => {
      return isSuperAdmin(user)
    },
  },

  fields: [
    {
      name: 'fullName',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        {
          label: 'Super Admin',
          value: 'super_admin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Client',
          value: 'client',
        },
      ],
      access: {
        create: ({ req: { user } }) => {
          return isSuperAdminOrAdmin(user)
        },
        update: ({ req: { user } }) => {
          return isSuperAdmin(user)
        },
      },
    },
    {
      name: 'relatedClient',
      type: 'relationship',
      relationTo: 'clients',
      required: false,
      admin: {
        condition: (_, siblingData) => siblingData?.role === 'client',
      },
    },
  ],
}