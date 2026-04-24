import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [enabled, setEnabled] = useState(true);
  const isFirstLoad = useRef(true);
  const lastFetchedUserIdRef = useRef(null);

  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Derived state
  const unseenCount = notifications.filter((n) => !n.isSeen).length;

  const prevIdsRef = useRef(new Set());
  const audioUnlocked = useRef(false);
  const audioRef = useRef(null);

  // Pre-load audio object explicitly
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  // One-time interaction hook exactly as requested
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioUnlocked.current) return;
      
      const audioToUnlock = new Audio("/notification.mp3");
      audioToUnlock.volume = 0; // Silent unlock
      audioToUnlock.play()
        .then(() => {
           audioUnlocked.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const fetchNotifications = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    let isNewUser = false;
    if (lastFetchedUserIdRef.current !== userId) {
        lastFetchedUserIdRef.current = userId;
        isFirstLoad.current = true;
        prevIdsRef.current.clear();
        isNewUser = true;
        setNotifications([]); // Flush organically immediately
    }

    try {
      const res = await axios.get(`http://localhost:8080/notifications/${userId}`);
      const newlyFetched = res.data;

      let hasNewItems = false;
      if (!isNewUser) {
        newlyFetched.forEach((incoming) => {
           if (!prevIdsRef.current.has(incoming.id)) {
              hasNewItems = true;
           }
        });
      }

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      } else if (hasNewItems && enabledRef.current) {
        if (audioUnlocked.current && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        toast.success(newlyFetched[0]?.message || "New notification received!", {
           style: {
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#333',
              minWidth: '300px'
           }
        });
      }

      // Sync refs strictly to fetched truths
      newlyFetched.forEach(n => prevIdsRef.current.add(n.id));

      setNotifications((prev) => {
        // Prevent duplicate notifications in state via Map
        const unique = new Map();
        
        // If this fetch triggered upon a newly rotated user, drop the entire 'prev' memory!
        if (!isNewUser) {
           prev.forEach((n) => unique.set(n.id, n));
        }
        
        // Merge fetch incoming
        newlyFetched.forEach((incoming) => {
           unique.set(incoming.id, incoming); // Overwrite with server truth
        });

        // Convert back and sort descending by date
        const mergedArray = [...unique.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return mergedArray;
      });
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15-second polling
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAsUnread = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/unread/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:8080/notifications/read-all/${userId}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsSeen = async () => {
     const userId = localStorage.getItem("userId");
     try {
       await axios.put(`http://localhost:8080/notifications/seen/${userId}`);
       setNotifications((prev) => prev.map((n) => ({ ...n, isSeen: true })));
     } catch (err) {
       console.error(err);
     }
  };

  const toggleNotifications = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unseenCount,
        enabled,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        markAllAsSeen,
        toggleNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
