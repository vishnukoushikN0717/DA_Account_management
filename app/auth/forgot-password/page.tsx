"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setEmailSent(true);
    }, 100);
  };

  return (
    // <div className="container flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[60%_40%] lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0">
          <img src="/assets/Doctors_small.jpg" alt="Medical professionals" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-blue-100 mix-blend-multiply" />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <img src="/assets/da-logo.png" alt="DA LOGO" />
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">Enter your email to receive a password reset link.</p>
          </div>
          {!emailSent ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" autoComplete="email" disabled={isLoading} className="border-blue-100 focus-visible:ring-blue-500" />
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />}
                Send Reset Link
              </Button>
            </form>
          ) : (
            <p className="text-center text-sm text-muted-foreground">A password reset link has been sent to your email.</p>
          )}
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/auth/login" className="hover:text-blue-600 underline underline-offset-4">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

