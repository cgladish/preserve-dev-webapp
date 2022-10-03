import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import jwt, { JwtPayload } from "jsonwebtoken";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
  theme: {
    colorScheme: "dark",
    logo: "/logo-darkmode.svg",
    brandColor: "A45EE5",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  jwt: {
    encode: async ({ secret, token }) => {
      const encodedToken = jwt.sign(token, secret, { algorithm: "HS512" });

      return encodedToken;
    },
    decode: async ({ secret, token }) => {
      const verify = jwt.verify(token, secret);

      return verify as JwtPayload;
    },
  },
};

export default NextAuth(authOptions);
