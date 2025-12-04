import "next-auth";

declare module "next-auth" {
  /**
   * Extend the built-in User type
   */
  interface User {
    id: string; // Add id to User
    account_type?: string;
  }

  /**
   * Extend the built-in Session type
   */
  interface Session {
    user: User; // This uses our extended User type
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the built-in JWT type
   */
  interface JWT {
    id: string;
    account_type?: string;
  }
}