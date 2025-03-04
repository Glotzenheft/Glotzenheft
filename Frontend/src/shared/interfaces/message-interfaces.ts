export interface MessageObject {
  life: number;
  severity: MessageStatusType;
  summary: string;
  detail: string;
}

export type MessageStatusType =
  | 'error'
  | 'success'
  | 'info'
  | 'warn'
  | 'danger'
  | 'secondary'
  | 'contrast';
