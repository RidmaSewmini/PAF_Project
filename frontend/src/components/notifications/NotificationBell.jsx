import React from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationBell({ onClick }) {
  const { unseenCount } = useNotifications();

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
      aria-label="Notifications"
    >
      <span className="text-2xl text-on-surface/80">🔔</span>
      {unseenCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white px-1">
          {unseenCount > 99 ? "99+" : unseenCount}
        </span>
      )}
    </button>
  );
}
