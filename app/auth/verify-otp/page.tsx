"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type MessageType = {
  text: string;
  type: "error" | "success";
} | null;

function VerifyOTPContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageType>(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  if (!email) {
    console.error("Email parameter is missing in the URL.");
    router.push("/auth/otp-login");
    return null;
  }

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedOtp = pastedData.slice(0, 6).split("");

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedOtp.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const otpValue = otp.join("");

    try {
      const result = await signIn("credentials", {
        email,
        otp: otpValue,
        isInternal: "true", // Adjust if supporting external users
        redirect: false,
      });

      if (!result?.ok) {
        // If the error is "CredentialsSignin", replace it with "INCORRECT OTP"
        const errorMessage = result?.error === "CredentialsSignin"
          ? "Incorrect OTP"
          : (result?.error || "Invalid OTP");

        throw new Error(errorMessage);
      }

      // Fetch session with credentials included
      const sessionResponse = await fetch("/api/auth/session", {
        credentials: "include", // Ensure cookies are sent
      });
      const sessionData = await sessionResponse.json();

      console.log("Session Response Status:", sessionResponse.status);
      console.log("Session Data:", sessionData);

      if (sessionResponse.ok && sessionData?.user) {
        setMessage({
          text: "OTP verified successfully! Redirecting...",
          type: "success",
        });

        setTimeout(() => {
          if (!sessionData.user.onboarderStatus) {
            router.push("/auth/onboarding");
          } else if (sessionData.user.role === "internal") {
            router.push("/internal/dashboard");
          } else if (sessionData.user.role === "external") {
            router.push("/external/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        // Retry after a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const retryResponse = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const retryData = await retryResponse.json();

        if (!retryResponse.ok || !retryData?.user) {
          throw new Error("Failed to create session");
        }

        setMessage({
          text: "OTP verified successfully! Redirecting...",
          type: "success",
        });
        setTimeout(() => {
          if (!retryData.user.onboarded) {
            router.push("/auth/onboarding");
          } else if (retryData.user.role === "internal") {
            router.push("/internal/dashboard");
          } else if (retryData.user.role === "external") {
            router.push("/external/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: error instanceof Error ? error.message : "Failed to verify OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!canResend || !email) return;

    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch("/api/AccountManager/WAVInternalUser/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email), // Send as object
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setCanResend(false);
      setTimer(30);
      setMessage({
        text: "OTP has been resent successfully!",
        type: "success",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setMessage({
        text: error instanceof Error ? error.message : "Failed to resend OTP. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingClick = () => {
    console.log("Onboarding button clicked");
    setShowOnboardingModal(false);
    router.push("/auth/onboarding");
  };

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
              Verify OTP
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 font-inter">
              Enter the OTP sent to <span className="font-semibold text-blue-600">{email}</span>
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-7">
            {message && (
              <div
                className={`text-sm text-center p-2 rounded-md ${message.type === "success"
                  ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                  : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                  }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <Label htmlFor="otp" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Enter OTP
              </Label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 rounded-md 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                             dark:bg-gray-800 dark:border-gray-600 dark:text-white
                             transition-all duration-200 ease-in-out
                             shadow-sm hover:border-blue-400"
                    maxLength={1}
                    required
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 
                       rounded-lg transition-colors duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                       dark:bg-blue-600 dark:hover:bg-blue-700"
              disabled={isLoading || otp.some((digit) => digit === "")}
            >
              {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
              )}
              Verify OTP
            </Button>
          </form>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Haven't Received?</span>
              <Button
                variant="link"
                onClick={resendOTP}
                disabled={!canResend || isLoading}
                className={`p-0 h-auto text-sm font-medium text-blue-600 hover:text-blue-700 
                 dark:text-blue-400 dark:hover:text-blue-300
                 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                ) : canResend ? (
                  "Resend OTP"
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showOnboardingModal}
        onOpenChange={(open) => {
          console.log("Dialog onOpenChange:", open);
          if (!open) {
            setShowOnboardingModal(false);
          }
        }}
      >
        <DialogContent className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900 dark:text-white">
              🎉 Welcome Onboard!
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600 dark:text-gray-300">
              You are one step away! Tell us something about yourself before we take you to our amazing dashboards.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                         dark:bg-blue-500 dark:hover:bg-blue-600
                         px-6 py-2 rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={(e) => {
                e.preventDefault();
                console.log("Sure button clicked");
                handleOnboardingClick();
              }}
            >
              Sure!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="container relative flex min-h-screen flex-col items-center justify-center">
          <div className="animate-pulse space-y-8 w-full max-w-[350px]">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="flex gap-3 justify-center">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="w-12 h-12 rounded-md bg-muted" />
                  ))}
              </div>
            </div>
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}