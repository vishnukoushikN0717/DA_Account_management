// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth/next';
import { authOptions } from './options';

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
export const OPTIONS = NextAuth(authOptions);