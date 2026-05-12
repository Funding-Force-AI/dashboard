import type { CollectionConfig } from 'payload'

export const Disbursements: CollectionConfig = {
  slug: 'disbursements',
  admin: {
    useAsTitle: 'vendorName',
    defaultColumns: ['clientName', 'vendorName', 'amountCents', 'purpose', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'clientId',
      type: 'text',
      required: true,
    },
    {
      name: 'clientName',
      type: 'text',
      required: true,
    },
    {
      name: 'vendorId',
      type: 'text',
      required: true,
    },
    {
      name: 'vendorName',
      type: 'text',
      required: true,
    },
    {
      name: 'amountCents',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'purpose',
      type: 'select',
      required: true,
      options: [
        { label: 'Marketing', value: 'marketing' },
        { label: 'Google Ads', value: 'google_ads' },
        { label: 'SEO', value: 'seo' },
        { label: 'Web Development', value: 'web_dev' },
        { label: 'Lead Generation', value: 'lead_gen' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'railType',
      type: 'select',
      required: true,
      defaultValue: 'ghost',
      options: [
        { label: 'Ghost / Demo', value: 'ghost' },
        { label: 'ACH', value: 'ach' },
        { label: 'Same-Day ACH', value: 'same_day_ach' },
        { label: 'Card', value: 'card' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Returned', value: 'returned' },
      ],
    },
    {
      name: 'idempotencyKey',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'provider',
      type: 'text',
      defaultValue: 'manual',
    },
    {
      name: 'providerPaymentId',
      type: 'text',
    },
  ],
}
