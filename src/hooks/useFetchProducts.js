import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "../api/productApi";

export default function useFetchProducts({
  q = "",
  category = "",
  page = 1,
  limit = 12,
  sort = "",
} = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [reloadTick, setReloadTick] = useState(0);

  const controllerRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (controllerRef.current) {
        try { controllerRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

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
          _sort: sort || undefined,
        };

        const res = await getProducts(paramsObj, { signal });
        if (!mountedRef.current) return;
        setData(Array.isArray(res.data) ? res.data : []);
        setTotal(Number.isNaN(Number(res.total)) ? 0 : Number(res.total));
      } catch (err) {
        if (
          err?.name === "CanceledError" ||
          err?.code === "ERR_CANCELED" ||
          /canceled/i.test(err?.message || "")
        ) {
          return;
        }
        if (!mountedRef.current) return;
        setError(err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [currentPage, limit, q, category, sort]
  );

  useEffect(() => {
    if (controllerRef.current) {
      try { controllerRef.current.abort(); } catch (e) {}
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    load(controller.signal);

    return () => {
      try { controller.abort(); } catch (e) {}
    };
  }, [load, reloadTick]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

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
