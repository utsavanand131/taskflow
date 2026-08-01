"use client";

import { ApolloProvider } from "@apollo/client/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { apolloClient } from "@/lib/graphql";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </GoogleOAuthProvider>
  );
}
