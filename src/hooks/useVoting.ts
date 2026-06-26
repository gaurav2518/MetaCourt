"use client";

import { useCallback, useState } from "react";

import { VOTE_TYPES } from "@/constants";

type VoteType = (typeof VOTE_TYPES)[keyof typeof VOTE_TYPES];

export function useVoting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const castVote = useCallback(
    async (caseId: string, vote: VoteType) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/votes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caseId,
            vote,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to cast vote");
        }

        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to cast vote";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getVotes = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/votes/${caseId}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch votes");
      }

      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch votes";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const hasVoted = useCallback(
    async (caseId: string): Promise<boolean> => {
      const data = await getVotes(caseId);
      return Boolean(data.hasVoted);
    },
    [getVotes]
  );

  return {
    loading,
    error,
    castVote,
    getVotes,
    hasVoted,
  };
}