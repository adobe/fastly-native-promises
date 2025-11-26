export default {
  list: {
    data: [
      {
        id: 'store-id-1',
        name: 'test-secret-store',
        created_at: '2025-01-01T00:00:00Z',
        write_only: false,
      },
      {
        id: 'store-id-2',
        name: 'another-store',
        created_at: '2025-01-02T00:00:00Z',
        write_only: true,
      },
    ],
  },
  get: {
    id: 'store-id-1',
    name: 'test-secret-store',
    created_at: '2025-01-01T00:00:00Z',
    write_only: false,
  },
  post: {
    id: 'store-id-3',
    name: 'new-secret-store',
    created_at: '2025-01-03T00:00:00Z',
    write_only: false,
  },
  delete: {
    status: 'ok',
  },
  listSecrets: {
    data: [
      {
        name: 'secret1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        recreated: false,
      },
      {
        name: 'secret2',
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
        recreated: false,
      },
    ],
  },
  getSecret: {
    name: 'secret1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    recreated: false,
  },
  putSecret: {
    name: 'newsecret',
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-01-03T00:00:00Z',
    recreated: true,
  },
  deleteSecret: {
    status: 'ok',
  },
};
