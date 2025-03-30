// components/SessionDebug.tsx
"use client";

import { useSession } from "next-auth/react";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div>
      <h1>Session Debug</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}