import {
  MessageObject,
  MessageStatusType,
} from '../interfaces/message-interfaces';

export const ERR_OBJECT_INVALID_AUTHENTICATION: MessageObject = {
  life: 7000,
  severity: 'error',
  summary: 'Ungültige Authentifizierung',
  detail: 'Ihre Sitzung ist abgelaufen. Sie werden abgemeldet.',
};

export const getMessageObject = (
  severity: MessageStatusType,
  summary: string = '',
  detail: string = ''
): MessageObject => {
  return {
    life: 7000,
    severity,
    summary,
    detail,
  };
};

export const REQUEST_THROTTLE_TIME: number = 10000; // in ms
