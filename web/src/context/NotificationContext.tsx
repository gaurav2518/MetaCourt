"use client";

import { API_BASE_URL } from "@/config/api";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/context/AuthContext";

export type DisputeNotification = {
  id: string;
  caseId: string;
  title: string;
  category: string;
  status: string;
  type?: "opposite_party" | "juror_vote";
  hasResponded: boolean;
  needsResponse: boolean;
  createdAt: string;
  votingDeadline?: string | null;
  message: string;
  actionUrl: string;
};

type NotificationContextValue = {
  notifications: DisputeNotification[];
  unreadCount: number;
  pendingDefenseCount: number;
  pendingJurorVotesCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  dismissAlert: (caseId?: string) => void;
  isAlertDismissed: (caseId: string) => boolean;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<DisputeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingDefenseCount, setPendingDefenseCount] = useState(0);
  const [pendingJurorVotesCount, setPendingJurorVotesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Load dismissed alert IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("metacourt_dismissed_alerts");
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const dismissAlert = useCallback((caseId?: string) => {
    if (!caseId) return;
    setDismissedIds((prev) => {
      const updated = Array.from(new Set([...prev, caseId]));
      try {
        localStorage.setItem(
          "metacourt_dismissed_alerts",
          JSON.stringify(updated)
        );
      } catch {
        // Ignore localStorage write errors
      }
      return updated;
    });
  }, []);

  const isAlertDismissed = useCallback(
    (caseId: string) => dismissedIds.includes(caseId),
    [dismissedIds]
  );

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setPendingDefenseCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setPendingDefenseCount(data.pendingDefenseCount || 0);
        setPendingJurorVotesCount(data.pendingJurorVotesCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch dispute notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch and interval polling
  useEffect(() => {
    let mounted = true;

    if (user && mounted) {
      void refreshNotifications();
    }

    const interval = setInterval(() => {
      if (user && document.visibilityState === "visible") {
        void refreshNotifications();
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user, refreshNotifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      pendingDefenseCount,
      pendingJurorVotesCount,
      loading,
      refreshNotifications,
      dismissAlert,
      isAlertDismissed,
    }),
    [
      notifications,
      unreadCount,
      pendingDefenseCount,
      pendingJurorVotesCount,
      loading,
      refreshNotifications,
      dismissAlert,
      isAlertDismissed,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useDisputeNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useDisputeNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
