export const APP_ACTIONS = {
    logout: 'logout',
} as const;

export type AppAction = typeof APP_ACTIONS[keyof typeof APP_ACTIONS];