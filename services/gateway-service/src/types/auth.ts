import type { AuthenticatedUser } from '@chatapp/common';

interface LoginInput {
      email:string;
      password:string;
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
 