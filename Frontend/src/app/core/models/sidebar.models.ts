import { AppAction } from "../constants/actions.constants";

export interface SidebarMenuItem {
    label: string;
    icon: string;
    routerLink?: string;
    action?: AppAction;
}