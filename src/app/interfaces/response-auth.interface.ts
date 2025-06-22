import { User } from './user.interface';

export interface AuthReponse {
  user: User;
  token: string;
}
