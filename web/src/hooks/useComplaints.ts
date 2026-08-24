"use client";

import { useCallback, useState } from "react";
import { CATEGORIES, STATUS } from "@/constants";

type ComplaintRelationship = "complainant" | "opposite_party" | "juror" | "admin";

type ComplaintCategory = (typeof CATEGORIES)[number];
type ComplaintStatus = (typeof STATUS)[keyof typeof STATUS];

type FetchComplaintsParams = {
  as?: "complainant" | "opposite_party";
};

type ComplaintRecord = {
  caseId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  category: ComplaintCategory;
  createdAt?: string;
  updatedAt?: string;
};

type ComplaintListResponse = {
  complaints: ComplaintRecord[];
  message?: string;
};

type ComplaintDetailResponse = {
  complaint: ComplaintRecord;
  relationship: ComplaintRelationship;
  message?: string;
};

type FileComplaintResponse = {
  complaint: ComplaintRecord;
  message?: string;
};

type FileComplaintInput = {
  title: string;
  description: string;
  category: ComplaintCategory;
  oppositeParty: {
    name: string;
    email: string;
    organization?: string;
    description?: string;
    userId?: string;
  };
  evidence?: Array<{
    url: string;
    publicId: string;
    fileType?: "image" | "pdf" | "document" | "video";
    fileName?: string;
    fileSize?: number;
  }>;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useComplaints() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = useCallback(async (params?: FetchComplaintsParams) => {
    try {
      setLoading(true);
      setError(null);

      const query = new URLSearchParams();

      if (params?.as) {
        query.set("as", params.as);
      }

      const res = await fetch(
        `/api/complaints${query.toString() ? `?${query.toString()}` : ""}`
      );

      const data = (await res.json()) as ComplaintListResponse;

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to fetch complaints"
        );
      }

      return data.complaints;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch complaints");

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaint = useCallback(async (caseId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/complaints/${caseId}`
      );

      const data = (await res.json()) as ComplaintDetailResponse;

      if (!res.ok) {
        throw new Error(
          data?.message || "Failed to fetch complaint"
        );
      }

      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to fetch complaint");

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fileComplaint = useCallback(async (data: FileComplaintInput) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await res.json()) as FileComplaintResponse;

      if (!res.ok) {
        throw new Error(
          result?.message || "Failed to file complaint"
        );
      }

      return result.complaint;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to file complaint");

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,

    fetchComplaints,
    fetchComplaint,
    fileComplaint,
  };
}