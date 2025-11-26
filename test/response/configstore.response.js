export default {
  list: [
    {
      id: 'config-store-id-1',
      name: 'test-config-store',
      created_at: '2025-01-01T00:00:00Z',
    },
    {
      id: 'config-store-id-2',
      name: 'another-config-store',
      created_at: '2025-01-02T00:00:00Z',
    },
  ],
  get: {
    id: 'config-store-id-1',
    name: 'test-config-store',
    created_at: '2025-01-01T00:00:00Z',
  },
  post: {
    id: 'config-store-id-3',
    name: 'new-config-store',
    created_at: '2025-01-03T00:00:00Z',
  },
  delete: {
    status: 'ok',
  },
  listItems: [
    {
      item_key: 'key1',
      item_value: 'value1',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z',
    },
    {
      item_key: 'key2',
      item_value: 'value2',
      created_at: '2025-01-02T00:00:00Z',
      updated_at: '2025-01-02T00:00:00Z',
    },
  ],
  getItem: {
    item_key: 'key1',
    item_value: 'value1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
  },
  putItem: {
    item_key: 'newkey',
    item_value: 'newvalue',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
  },
  deleteItem: {
    status: 'ok',
  },
  bulkUpdate: {
    status: 'ok',
  },
};
