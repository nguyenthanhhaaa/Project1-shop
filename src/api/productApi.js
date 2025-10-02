import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:4000" });

function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [k, v]) => {
    if (v !== undefined && v !== null) acc[k] = v;
    return acc;
  }, {});
}

export const getProducts = (params = {}, options = {}) =>
  API.get("/products", { params: cleanParams(params), signal: options.signal })
    .then((res) => ({
      data: Array.isArray(res.data) ? res.data : [],
      total: parseInt(res.headers?.["x-total-count"] || res.headers?.["X-Total-Count"] || "0", 10),
    }));

export const getProductById = (id, config = {}) =>
  API.get(`/products/${id}`, config).then((res) => res.data);

export const createOrder = (order, config = {}) =>
  API.post("/orders", order, config).then((res) => res.data);

export const getCategories = (options = {}) =>
  API.get("/categories", { signal: options.signal })
    .then((res) => {
      const arr = res.data;
      if (Array.isArray(arr) && arr.length && typeof arr[0] === "object") {
        return arr.map((c) => c.name);
      }
      return arr;
    });

export default API;
