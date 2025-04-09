export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface Usuario {
  _id: string;
  name: string;
  email: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  password?: string;
}
