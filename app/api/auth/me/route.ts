// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authApi } from "@/lib/api/auth";

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token");
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get current user from the API
    const user = await authApi.getCurrentUser();
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    
    // Try to refresh the token if authentication failed
    if (error instanceof Error && error.message === "Authentication required") {
      try {
        await authApi.refreshToken();
        
        // Try again after refreshing
        const user = await authApi.getCurrentUser();
        return NextResponse.json(user);
      } catch (refreshError) {
        // If refresh fails, return 401
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}