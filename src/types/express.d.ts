import { UserType } from "./controllers.types";

declare global {
  namespace Express {
    interface Request {
      user?: UserType; // Make it optional
    }
  }
}
