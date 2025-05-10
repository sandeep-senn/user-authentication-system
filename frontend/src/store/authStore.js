import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

    login : async (email, password) => {
    console.log("🔹 Sending Login Request...");
    console.log("🔹 Email:", email);
    console.log("🔹 Password:", password);

    try {
        const res = await axios.post(
            "http://localhost:5000/api/auth/login", 
            { email, password }, 
            {
                headers: {
                    "Content-Type": "application/json", // ✅ Important
                }
            }
        );

        console.log("✅ Login Success:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Login Error:", error.response?.data);
        throw error.response?.data?.message || "Login failed";
    }
},
	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
	
		console.log("🛠️ Sending verification request with code:", code); // ✅ Debugging
	
		if (!code) {
			console.error("❌ Verification code is missing!");
			set({ error: "Verification code is missing", isLoading: false });
			return;
		}
	
		try {
			const response = await axios.post(
				`${API_URL}/verify-email`,
				{ code },
				{ headers: { "Content-Type": "application/json" }, withCredentials: true }
			);
	
			console.log("✅ Response received:", response.data);
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
	
			return response.data;
		} catch (error) {
			console.error("❌ Verify Email Error:", error.response?.data || error);
			set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
