interface UserMenuItem {
  label: string;
  icon: string;
  command: () => void;
}

export interface UserMenuList {
  label: string;
  items: UserMenuItem[];
}

export interface DeleteUserRequest {
  security_question: string;
  security_answer: string;
}
