import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../api/productApi";


export default function useFetchProducts({
  q = "",
  category = "",
  page = 1,
  limit = 12,
  sort = ""
} = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [reloadTick, setReloadTick] = useState(0);

  const refetch = useCallback(() => setReloadTick((t) => t + 1), []);

  const load = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      try {
        const paramsObj = {
          _page: currentPage,
          _limit: limit,
          q: q || undefined,
          category: category || undefined,
          _sort: sort || undefined
        };

        Object.keys(paramsObj).forEach((k) => paramsObj[k] === undefined && delete paramsObj[k]);

        const res = await getProducts(paramsObj, { signal });
        setData(Array.isArray(res.data) ? res.data : []);
        const totalCount = Number(res.headers?.["x-total-count"] ?? res.headers?.["X-Total-Count"] ?? res.data?.length ?? 0);
        setTotal(isNaN(totalCount) ? 0 : totalCount);
      } catch (err) {
        if (err?.name === "CanceledError" || err?.message === "canceled") {
          return;
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, q, category, sort]
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load, reloadTick]);

  useEffect(() => setCurrentPage(page), [page]);

  return {
    data,
    loading,
    error,
    total,
    page: currentPage,
    setPage: setCurrentPage,
    limit,
    refetch,
  };
}
