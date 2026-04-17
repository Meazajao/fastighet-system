import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      apartment: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    apartment: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
    apartment: string | null;
  }
}