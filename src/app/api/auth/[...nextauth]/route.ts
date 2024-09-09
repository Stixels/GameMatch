import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../../../../lib/supabase";
import { Session, User } from "next-auth";

interface CustomSession extends Session {
  user: User & {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) {
          if (error.message.includes("Email not confirmed")) {
            throw new Error("Email not verified");
          }
          throw new Error(error.message);
        }

        if (!data.user) {
          throw new Error("User not found");
        }

        return data.user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (session.user) {
        (session.user as User & { id: string }).id = token.id as string;
      }
      return session as CustomSession;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
