// app/api/auth/[...nextauth]/options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

const API_BASE_URL_INTERNAL = process.env.NEXT_PUBLIC_API_BASE_URL_INTERNAL;
const API_BASE_URL_EXTERNAL = process.env.NEXT_PUBLIC_API_BASE_URL_EXTERNAL;

// Extend the User type to include required fields
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    userRole: string;
    onboarderStatus: boolean;
    role: string; // "internal" or "external"
    companyId?: string | null; // Optional, only for external users
  }

  interface Session {
    user: User;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
        isInternal: { label: "Is Internal", type: "text" }, // Added to distinguish user type
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials || !credentials.email || !credentials.otp) {
          console.error("Missing credentials");
          throw new Error("Configuration error");
        }

        const decodedEmail = decodeURIComponent(credentials.email);
        const isInternalUser = credentials.isInternal === "true"; // Use flag from signIn
        const validateUrl = isInternalUser
          ? `${API_BASE_URL_INTERNAL}/api/WAVInternalUser/validate-otp`
          : `${API_BASE_URL_EXTERNAL}/api/WAVExternalUser/validate-otp`;

        const payload = { email: decodedEmail, otp: credentials.otp };

        console.log('=== OTP Validation Debug ===');
        console.log('URL:', validateUrl);
        console.log('Payload:', payload);

        try {
          // Validate OTP
          const verifyRes = await fetch(validateUrl, {
            method: "POST",
            headers: {
              "accept": "*/*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const responseText = await verifyRes.text();
          console.log('Response Status:', verifyRes.status);
          console.log('Raw Response:', responseText);

          const validationData = JSON.parse(responseText);
          console.log('Parsed Response:', validationData);

          if (!verifyRes.ok || !validationData?.message) {
            console.error('Validation Failed:', validationData);
            return null;
          }

          // Fetch user details by email
          const userDetailsUrl = isInternalUser
            ? `${API_BASE_URL_INTERNAL}/api/WAVInternalUser/byEmail/${encodeURIComponent(decodedEmail)}`
            : `${API_BASE_URL_EXTERNAL}/api/WAVExternalUser/byEmail/${encodeURIComponent(decodedEmail)}`;

          const userDetailsRes = await fetch(userDetailsUrl, {
            method: "GET",
            headers: {
              "accept": "*/*",
              "Content-Type": "application/json",
            },
          });

          if (!userDetailsRes.ok) {
            const userDetailsErrorText = await userDetailsRes.text();
            console.error('Failed to fetch user details:', userDetailsErrorText);
            return null;
          }

          const userDetails = await userDetailsRes.json();
          console.log('User Details:', userDetails);

          if (!userDetails?.id) {
            console.error('User details missing id:', userDetails);
            return null;
          }

          // Construct user object with required fields
          const user: User = {
            id: userDetails.id.toString(), // Ensure id is a string
            email: userDetails.email,
            userRole: userDetails.userRole || "user", // Default to "user" if missing
            onboarderStatus: userDetails.onboarderStatus || false,
            role: isInternalUser ? "internal" : "external",
            verified: userDetails.verified || false, // Default to false if missing
            onboarded: userDetails.onboarded || false, // Default to false if missing
          };

          // Add companyId for external users only
          if (!isInternalUser) {
            user.companyId = userDetails.companyId || null;
          }

          return user;

        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/otp-login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback - User:", user);
        token.id = user.id;
        token.email = user.email;
        token.userRole = user.userRole;
        token.onboarderStatus = user.onboarderStatus;
        token.role = user.role;
        if (user.companyId) {
          token.companyId = user.companyId; // Store companyId for external users
        }
      }
      console.log("JWT Callback - Token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Token:", token);
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.userRole = token.userRole as string;
        session.user.onboarderStatus = token.onboarderStatus as boolean;
        session.user.role = token.role as string;
        if (token.companyId) {
          session.user.companyId = token.companyId as string | null;
        }
      }
      console.log("Session Callback - Session:", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug messages
};