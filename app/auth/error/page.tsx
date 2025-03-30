"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      console.error("Auth Error:", error);
    }
  }, [error]);

  const getErrorMessage = () => {
    switch (error) {
      case "Incorrect OTP":
        return "Invalid OTP. Please try again.";
      case "Configuration":
        return "System configuration error. Please try again later.";
      case null:
        return "Session expired. Please login again.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Authentication Error
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getErrorMessage()}
          </p>
        </div>

        <Button
          onClick={() => router.push('/auth/otp-login')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
}