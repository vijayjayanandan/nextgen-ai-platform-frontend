// hooks/use-media-query.ts
"use client";

import { useEffect, useState } from "react";

/**
 * Hook for managing media queries
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    // Default to false on the server
    if (typeof window === "undefined") {
      return false;
    }
    
    // Use matchMedia API to determine if the query matches
    return window.matchMedia(query).matches;
  });
  
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    
    // Create the media query list
    const mediaQueryList = window.matchMedia(query);
    
    // Define the change handler to update state
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    // Using deprecated addListener for better browser compatibility
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      // @ts-ignore - For older browsers
      mediaQueryList.addListener(listener);
    }
    
    // Update matches if the query state changes
    setMatches(mediaQueryList.matches);
    
    // Clean up
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        // @ts-ignore - For older browsers
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query]);
  
  return matches;
}