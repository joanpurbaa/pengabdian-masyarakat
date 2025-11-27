import axios from "axios";

const API_BASE_URL =
	import.meta.env.VITE_API_BASE;

export const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		// handle error from server
		if(error.response && error.response.data) {
			const errorFallback = error.response.data
			console.error("API Error:", errorFallback);

			return Promise.reject(errorFallback);
		}
		
		// handle connection error
		console.log("Network Error:", error)
		return Promise.reject({
			statusCode: 500,
			message: "Failed to connect to the server. Check your internet connection.",
			error: "Nerwork Error"
		}) 
		
	}
);
