export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface LoginAndMessageResponse {
  message: string;
  token: string;
}
