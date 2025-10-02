import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:4000" });

export const getProducts = (params = {}, config = {}) =>
  API.get("/products", { params, ...config });

export const getProductById = (id) =>
  API.get(`/products/${id}`).then((res) => res.data);

export const createOrder = (order) =>
  API.post("/orders", order).then((res) => res.data);
