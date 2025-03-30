"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-[60%_40%] lg:px-0">
    
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0">
          <img
            src="/assets/Doctors_small.jpg"
            alt="Medical professionals"
            className="h-full w-full object-cover"
          />
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
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                )}
                Sign In
              </Button>
            </div>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              href="/auth/forgot-password"
              className="hover:text-blue-600 underline underline-offset-4"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
