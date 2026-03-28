import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email:    { label: "Email",           type: "email" },
        password: { label: "Mot de passe",    type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        // Charger plan + docsUsed depuis la BDD
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, docsUsed: true, docsLimit: true },
        });
        if (dbUser) {
          (session.user as any).plan      = dbUser.plan;
          (session.user as any).docsUsed  = dbUser.docsUsed;
          (session.user as any).docsLimit = dbUser.docsLimit;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error:  "/auth",
  },
  events: {
    // Donner 1 doc gratuit à l'inscription
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data:  { docsLimit: 1 },
      });
    },
  },
});
