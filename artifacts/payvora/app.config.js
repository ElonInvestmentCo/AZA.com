/**
 * Payvora Expo config — replaces app.json for dynamic env support.
 *
 * Key env vars (set in Railway / Replit Secrets):
 *   EXPO_PUBLIC_DOMAIN        — production host, e.g. "www.payvora.org"
 *   EXPO_PUBLIC_API_URL       — explicit API base URL (optional; derived from
 *                               EXPO_PUBLIC_DOMAIN when not set)
 *   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID — Google OAuth web client ID
 *
 * The `origin` fed to expo-router controls:
 *   - web build base URL
 *   - OAuth redirect URI for web
 *   - deep-link verification for Android App Links / Universal Links
 */

const rawDomain = (process.env.EXPO_PUBLIC_DOMAIN || "www.payvora.org")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const productionOrigin = `https://${rawDomain}`;

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  expo: {
    name: "Payvora",
    slug: "payvora",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",

    /* Deep-link scheme used by expo-auth-session on native builds */
    scheme: "payvora",

    userInterfaceStyle: "dark",
    newArchEnabled: true,

    splash: {
      image: "./assets/images/icon.png",
      resizeMode: "contain",
      backgroundColor: "#0A0A0F",
    },

    ios: {
      supportsTablet: false,
      bundleIdentifier: "org.payvora.app",
      /* Required for Apple Sign-In entitlement */
      usesAppleSignIn: true,
    },

    android: {
      package: "org.payvora.app",
      /* Enables Android App Links for OAuth callbacks */
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "https",
              host: rawDomain,
              pathPrefix: "/auth",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    plugins: [
      [
        "expo-router",
        {
          /* Points the web build and link verification to the production domain */
          origin: productionOrigin,
        },
      ],
      "expo-font",
      "expo-web-browser",
      /* Required plugin for Apple Sign-In to work in native builds */
      "expo-apple-authentication",
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      /* Surfaced via Constants.expoConfig.extra in the app at runtime */
      apiUrl: process.env.EXPO_PUBLIC_API_URL || `${productionOrigin}/api-server`,
      productionDomain: rawDomain,
    },
  },
};
