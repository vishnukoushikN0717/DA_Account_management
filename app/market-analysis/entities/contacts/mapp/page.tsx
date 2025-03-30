// This is the main page file, which can remain a Server Component or static by default
import { Suspense } from "react";
import MappingContent from "./MappingContent"; // Import the new Client Component

export default function MappingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      }
    >
      <MappingContent />
    </Suspense>
  );
} 