export interface User {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export interface TokenForApi {
  prefix: string;
  methods: ('*' | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
}
