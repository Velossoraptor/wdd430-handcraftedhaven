
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, verifyPassword } from "@/app/lib/data";

// Create the auth configuration
const authConfig = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;
          const normalizedEmail = email.toLowerCase().trim();

          // Get user from database
          const user = await getUserByEmail(normalizedEmail);
          
          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isValid = await verifyPassword(password, user.password);
          
          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.fname ? `${user.fname} ${user.lname || ''}`.trim() : user.email,
            account_type: user.account_type,
          };
          
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Authentication error:", error);
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.account_type = (user as { account_type?: string }).account_type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.account_type = token.account_type as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
});


export const { handlers, auth, signIn, signOut } = authConfig;


export const { GET, POST } = handlers;