export interface AdminUser {
  id: number;
  username: string;
  password: string;
  email: string;
  role: 'admin';
}

export interface AuthSession {
  username: string;
  role: string;
  loginTime: string;
}
