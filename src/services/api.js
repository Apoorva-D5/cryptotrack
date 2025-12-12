import axios from "axios";

const API = axios.create({
 baseURL: process.env.REACT_APP_API_URL,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

// -------------------- AUTH --------------------
export const registerUser = (data) =>
  API.post("/api/auth/register", data);

export const loginUser = (data) =>
  API.post("/api/auth/login", data);

// -------------------- PORTFOLIO --------------------
export const addToPortfolio = (data) =>
  API.post("/api/portfolio/add", data);

export const getUserPortfolio = () =>
  API.get("/api/portfolio/user");

export const deletePortfolioItem = (id) =>
  API.delete(`/api/portfolio/${id}`);

// -------------------- WATCHLIST --------------------
export const addToWatchlist = (data) =>
  API.post("/api/watchlist/add", data);

export const getWatchlist = () =>
  API.get("/api/watchlist/user");

export const deleteWatchlistItem = (id) =>
  API.delete(`/api/watchlist/${id}`);

export default API;
