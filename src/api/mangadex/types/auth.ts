export interface Token {
  session: string;
  refresh: string;
}

interface BasicResponse {
  result: 'ok' | 'error';
}

interface SuccessAuthResponse extends BasicResponse {
  result: 'ok';
  token: Token;
}

interface ErrorAuthResponse extends BasicResponse {
  result: 'error';
}

export type AuthResponse = SuccessAuthResponse | ErrorAuthResponse;
