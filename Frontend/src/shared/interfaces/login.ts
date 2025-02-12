export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  validationQuestion: string;
  validationAnswer: string;
}

export interface LoginAndMessageResponse {
  message: string;
  token: string;
}

export interface ResetPasswordCredentials {
  username: string;
  validationQuestion: string;
  validationAnswer: string;
  newPassword: string;
}
