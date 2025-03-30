import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import SessionWrapper from "./SessionWrapper"; // Import the new wrapper

// import "react-datepicker/dist/react-datepicker.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WAV',
  description: 'WAV Description'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper> {/* Wrap children with SessionWrapper */}
            {children}
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}