import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;

        console.log("Authorize - user från DB:", user.email, user.role);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          apartment: user.apartment,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      console.log("JWT trigger:", trigger, "user:", user, "token:", token);
      if (user) {
        token.id = user.id as string;
        token.role = user.role as string;
        token.apartment = (user.apartment ?? null) as string | null;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session - token.role:", token.role);
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.apartment = token.apartment as string | null;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);