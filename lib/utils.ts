import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function parseSSEStream(stream: ReadableStream): AsyncGenerator<any> {
  const reader = stream.getReader();
  
  const asyncGenerator = (async function* () {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.trim()) {
            const [event, data] = line.split(':');
            const trimmedData = data.trim();
            
            if (!trimmedData || trimmedData === "data:") {
              continue;
            }
            
            // If the line starts with "data:", remove that prefix
            const dataContent = trimmedData.startsWith("data:") 
              ? trimmedData.substring(5).trim() 
              : trimmedData;
            
            // Handle different event types
            if (event === 'metadata') {
              try {
                const metadata = JSON.parse(dataContent);
                yield { type: 'metadata', data: metadata };
              } catch (e) {
                console.error('Failed to parse metadata:', e);
              }
            } else if (event === 'done') {
              yield { type: 'done' };
            } else if (event === 'data') {
              // For Claude API, we just need to yield the text content
              yield { type: 'data', text: dataContent };
            }
          }
        }
      }
    } catch (error) {
      console.error('SSE stream error:', error);
      throw error;
    }
  })();

  return asyncGenerator;
}
