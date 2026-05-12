import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['externalId', 'name', 'category', 'status', 'totalAllocation', 'signedAt'],
  },
  fields: [
    {
      name: 'externalId',
      type: 'text',
      required: true,
      unique: true,
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
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'totalAllocation',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Dollar amount, not cents, to match current frontend mock shape.',
      },
    },
    {
      name: 'vendors',
      type: 'array',
      fields: [
        { name: 'vendorId', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'purpose', type: 'text' },
        { name: 'amount', type: 'number', required: true },
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
        { name: 'eventId', type: 'text', required: true },
        { name: 'action', type: 'text', required: true },
        { name: 'time', type: 'text', required: true },
      ],
    },
  ],
}
