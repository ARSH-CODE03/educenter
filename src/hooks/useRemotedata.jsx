import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";

export function useRemoteData(requests, deps = []) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const entries = await Promise.all(Object.entries(requests).map(async ([key, path]) => [key, await api.get(path)]));
      const next = {};
      for (const [key, response] of entries) {
        const root = response?.data ?? response;
        next[key] = root?.data ?? root;
      }
      setData(next);
    } catch (err) {
      setError(err.message || "Unable to load data from the server.");
      setData({});
    } finally { setLoading(false); }
  // requests is expected to be a stable object defined outside the component.
  }, deps);
  useEffect(() => { reload(); }, [reload]);
  return { data, loading, error, reload };
}
