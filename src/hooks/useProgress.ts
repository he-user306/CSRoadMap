import { useCallback, useEffect, useState } from "react";
import type { NodeStatus, ProgressMap } from "../types/roadmap";

const STORAGE_KEY = "cs-roadmap-progress";
const validStatuses = new Set<NodeStatus>([
  "not_started",
  "learning",
  "completed",
]);

function readStoredProgress(): ProgressMap {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([, value]) =>
          typeof value === "string" && validStatuses.has(value as NodeStatus),
      ),
    ) as ProgressMap;
  } catch {
    return {};
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(() =>
    readStoredProgress(),
  );

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getStatus = useCallback(
    (nodeId: string): NodeStatus => progress[nodeId] ?? "not_started",
    [progress],
  );

  const setStatus = useCallback((nodeId: string, status: NodeStatus) => {
    setProgress((prev) => ({
      ...prev,
      [nodeId]: status,
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({});
  }, []);

  return {
    progress,
    getStatus,
    setStatus,
    resetProgress,
  };
}
