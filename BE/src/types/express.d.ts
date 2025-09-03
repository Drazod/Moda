// express.d.ts
import { LoginRequest } from "./general"; // Adjust this import path as needed

declare global {
  namespace Express {
    interface Request {
      user?: LoginRequest; // Typing the 'user' property
    }
  }
}

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}

export interface State {
  ORDERED: "ORDERED";
  PENDDING: "PENDDING";
}
