// lib/api/auth.ts
"use client";

import { apiClient } from './base';
import { setCookie, getCookie, deleteCookie } from '@/lib/utils/cookies';
import type { AuthResponse, Credentials, RefreshTokenResponse, User } from '@/types/auth';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
};

/**
 * Authentication API client
 */
export class AuthApi {
  /**
   * Login with email and password
   */
  async login(credentials: Credentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(
        AUTH_ENDPOINTS.LOGIN, 
        credentials
      );
      
      // Set cookies to store authentication tokens
      setCookie('access_token', response.access_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: response.expires_in,
        path: '/',
      });
      
      // Store refresh token
      setCookie('refresh_token', response.refresh_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Authentication failed');
    }
  }
  
  /**
   * Refresh the access token using the refresh token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = getCookie('refresh_token');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await apiClient.post<RefreshTokenResponse>(
        AUTH_ENDPOINTS.REFRESH, 
        { refresh_token: refreshToken }
      );
      
      // Update the access token cookie
      setCookie('access_token', response.access_token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: response.expires_in,
        path: '/',
      });
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Clear cookies if refresh fails
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      
      throw new Error(error instanceof Error ? error.message : 'Authentication refresh failed');
    }
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT, {});
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear cookies regardless of API response
      deleteCookie('access_token');
      deleteCookie('refresh_token');
    }
  }
  
  /**
   * Get the current user's profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>(AUTH_ENDPOINTS.ME);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user profile');
    }
  }
}

// Create and export a singleton instance
export const authApi = new AuthApi();

/**
 * Server action for handling login
 */
export async function loginAction(credentials: Credentials): Promise<{ success: boolean; error?: string }> {
  try {
    await authApi.login(credentials);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Authentication failed' 
    };
  }
}

/**
 * Server action for handling logout
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await authApi.logout();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}
