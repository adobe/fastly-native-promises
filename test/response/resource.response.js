export default {
  list: [
    {
      id: 'resource-link-id-1',
      name: 'secrets',
      resource_id: 'store-id-1',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 'resource-link-id-2',
      name: 'config',
      resource_id: 'config-store-id-1',
      created_at: '2025-01-02T00:00:00Z',
    },
  ],
  get: {
    id: 'resource-link-id-1',
    name: 'secrets',
    resource_id: 'store-id-1',
    created_at: '2025-01-01T00:00:00Z',
  },
  post: {
    id: 'resource-link-id-3',
    name: 'newsecrets',
    resource_id: 'store-id-3',
    created_at: '2025-01-03T00:00:00Z',
  },
  put: {
    id: 'resource-link-id-1',
    name: 'updated-secrets',
    resource_id: 'store-id-1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
  delete: {
    status: 'ok',
  },
};
