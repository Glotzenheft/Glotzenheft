export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  security_question: string;
  security_answer: string;
}

export interface LoginAndMessageResponse {
  message: string;
  token: string;
}

export interface ResetPasswordCredentials {
  security_question: string;
  security_answer: string;
  new_password: string;
}
