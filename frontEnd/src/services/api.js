import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000, // Increased timeout to 120000ms (2 minutes) to prevent pipeline timeouts
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    console.error("API Error:", message);
    return Promise.reject(new Error(message));
  }
);

// API methods
export const companiesAPI = {
  getSimilar: (domain) => api.post("/companies", { domain }),
};

export const leadsAPI = {
  search: (domain) => api.post("/search-leads", { domain }),
  enrich: (personId) => api.post("/enrich", { personId }),
};

export const emailAPI = {
  send: (toEmail, toName, subject, message) =>
    api.post("/send-email", { toEmail, toName, subject, message }),
};

export const pipelineAPI = {
  run: (domain) => api.post("/pipeline", { domain }),
};

export const healthAPI = {
  check: () => api.get("/health"),
};

export default api;
