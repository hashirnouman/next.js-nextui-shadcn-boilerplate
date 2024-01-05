import { User } from "@/types/intefaces";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      
      //type: "credentials",
      name: "Credentials",

      credentials: {},
      async authorize(credentials, req) {
        const { email, name, role, permission, id, saId } = credentials as {
          email: string;
          name: string;
          role : string;
          permission: string;
          id : string;
          saId : string;
        };
        // perform you login logic
        // find out user from db
        if (email == "" || role == "" || name === "") {
          throw new Error("invalid credentials");
        }
        // if everything is fine
        return {
          id: id,
          saId: saId,
          name: name,
          userEmail: email,
          role: role,
          permissions: permission,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  // callbacks: {
  //   jwt(params) {
  //     // update token
  //     // if (params.user?.role) {
  //     //   params.token.role = params.user.role;
  //     // }
  //     // return final_token
  //     debugger;
  //     return params.token;
  //   },
  // },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token;

      return session;
    },
  },
};

export default NextAuth(authOptions);
