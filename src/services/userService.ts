
import axios from 'axios';
import { API_BASE_URL } from '@/constants';


export interface RequestLimitResponse {
    total_requests: number;
    remaining_requests: number;
    total_cost: number;
    success: boolean;
    user_email: string;
    user_id: number;
}

/**
 * Check and update the request limit for the current user
 * This should be called every time a sheet is successfully applied
 */
export async function checkRequestLimit(token: string): Promise<RequestLimitResponse> {
    try {
        const response = await axios.get(`${API_BASE_URL}/request-limit`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            window.location.href = '/login';
            return Promise.reject(new Error("Session expired. Please log in again."));
        }
        if (error.response && error.response.status === 403) {
            // Re-throw the specific error message from server
            throw new Error(error.response.data.error || "No remaining requests");
        }
        console.error("Error checking request limit:", error);
        throw error;
    }
}
