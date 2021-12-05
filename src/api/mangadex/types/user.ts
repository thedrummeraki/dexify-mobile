export interface User {
  id: string;
  type: 'user';
  attributes: UserAttributes;
}

export interface UserAttributes {
  username: string;
  version: number;
  roles: string[];
}
