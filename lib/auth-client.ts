import { createAuthClient } from "better-auth/vue";
import { adminClient } from "better-auth/client/plugins";

const baseURL = process.client
  ? window.location.origin
  : process.env.NUXT_PUBLIC_SITE_URL;

export const authClient = createAuthClient({
  // baseURL: import.meta.env.PROD
  //   ? "https://studywithwoody.site"
  //   : "http://localhost:3000",
  baseURL,
  plugins: [adminClient()],
});

export const { signIn, signOut, useSession } = authClient;
