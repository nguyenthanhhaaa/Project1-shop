import axios from "axios";
const API = axios.create({ baseURL: "http://localhost:4000" });

/**
 * Create order
 * @param {Object} order
 */
export async function createOrder(order) {
  const res = await API.post("/orders", order);
  return res.data;
}

/**
 * Fake send email (store record in /emails)
 * @param {Object} email
 */
export async function createEmail(email) {
  const res = await API.post("/emails", email);
  return res.data;
}

export default API;
