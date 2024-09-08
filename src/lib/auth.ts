import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createConnection } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const db = await createConnection();
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
          credentials?.email,
        ]);
        const user = rows[0];

        if (user && bcrypt.compareSync(credentials?.password, user.password)) {
          return user;
        }

        return null;
      },
    }),
  ],
});
