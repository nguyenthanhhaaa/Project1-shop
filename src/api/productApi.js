import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:4000" });

function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null) acc[k] = v;
    return acc;
  }, {});
}

export const getProducts = (params = {}, config = {}) =>
  API.get("/products", { params: cleanParams(params), ...config });

export const getProductById = (id, config = {}) =>
  API.get(`/products/${id}`, config).then((res) => res.data);

export const createOrder = (order, config = {}) =>
  API.post("/orders", order, config).then((res) => res.data);

export const getCategories = (options = {}) =>
  API.get("/categories", { signal: options.signal }).then((res) => res.data);

export default API;
