interface UserMenuItem {
  label: string;
  icon: string;
  command: () => void;
}

export interface UserMenuList {
  label: string;
  items: UserMenuItem[];
}
