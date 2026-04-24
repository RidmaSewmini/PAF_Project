import React from "react";
import DashboardLayout from "./DashboardLayout";
import UserSidebar from "./UserSidebar";
import AdminSidebar from "./AdminSidebar";

export default function DashboardWithSidebar({ children }) {
  const role = localStorage.getItem("role");

  return (
    <DashboardLayout sidebar={role === "ADMIN" ? <AdminSidebar /> : <UserSidebar />}>
      {children}
    </DashboardLayout>
  );
}
