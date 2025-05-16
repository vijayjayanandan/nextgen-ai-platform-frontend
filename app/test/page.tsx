'use client';

import { useEffect, useState } from 'react';

export default function ClientTest() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Client-Side Test {mounted ? '(Mounted)' : '(Not Mounted)'}
      </h1>
      
      <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
        This should have a red background and border if Tailwind is working.
      </div>
      
      <div className="direct-test mt-8">
        This should be styled if direct CSS is working.
      </div>
    </div>
  );
}