// login.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function OTPLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const emailValue = formData.get("email") as string;
    setEmail(emailValue);

    // Add API URL check
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      console.error("API URL not configured");
      setError("API configuration error");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting to send OTP to:", emailValue);

      const response = await fetch('/api/AccountManager/WAVInternalUser/send-otp', {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailValue),
      });

      // Log the raw response for debugging
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // Try to get the response text first
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let errorData;
      try {
        // Try to parse it as JSON if possible
        errorData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        errorData = { message: responseText || response.statusText };
      }

      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });

        throw new Error(
          errorData.message ||
          `Failed to send OTP (${response.status}: ${response.statusText})`
        );
      }

      console.log('Success:', errorData);
      router.push(`/auth/verify-otp?email=${encodeURIComponent(emailValue)}`);
    } catch (error) {
      console.error("Full error details:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Always display the same simple error message regardless of the actual error
      setError("User not found or inactive.");
    } finally {
      setIsLoading(false);
    }
  };

  // No need for clear error handler with simple message

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[60%_40%] lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0">
          <img
            src="/assets/Doctors_small.jpg"
            alt="Medical professionals"
            className="h-[100%] w-[100%] object-cover"
          />
          <div className="absolute inset-0 bg-blue-100 mix-blend-multiply" />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative">
          <img
            src="/assets/da-logo.png"
            alt="DA LOGO"
            className="absolute top-[-200px] left-2/4 transform -translate-x-1/2 h-59"
          />

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-inter">
              Welcome to WAV
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 font-inter">
              Please enter your registered E-mail address
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-7">
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 rounded px-3 py-2 mb-3">
                  <p className="text-red-500 dark:text-red-400 text-center">
                    User not found or inactive.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className={`border-gray-300 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 ${error ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                )}
                Send OTP
              </Button>
            </div>
          </form>

          <div style={{ marginTop: "70px" }} className="text-center text-sm text-gray-800 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}