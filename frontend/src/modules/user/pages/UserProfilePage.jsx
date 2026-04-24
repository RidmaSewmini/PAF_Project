import { useEffect, useState } from "react";
import axios from "axios";
import DashboardFooter from "../../../components/layout/DashboardFooter";
import ProfileLayout from "../../../components/profile/ProfileLayout";
import DashboardWithSidebar from "../../../components/layout/DashboardWithSidebar";
import { useAuth } from "../../../context/AuthContext";

export default function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setGlobalUser } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await axios.get(`http://localhost:8080/users/${userId}`);
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (payload) => {
    const userId = localStorage.getItem("userId");
    await axios.put(`http://localhost:8080/users/${userId}/profile`, payload);
    setUserData(prev => ({ ...prev, name: payload.name }));
  };

  const handleChangePassword = async (payload) => {
    const userId = localStorage.getItem("userId");
    await axios.post(`http://localhost:8080/users/${userId}/change-password`, payload);
  };

  const handleUploadPhoto = async (file) => {
    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("file", file);

    const res = await axios.post("http://localhost:8080/users/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    setUserData(prev => ({ ...prev, profileImageUrl: res.data.url }));
    setGlobalUser(prev => ({ ...prev, profileImageUrl: res.data.url }));
  };

  const handleRemovePhoto = async () => {
    const userId = localStorage.getItem("userId");
    await axios.delete(`http://localhost:8080/users/profile-image?userId=${userId}`);
    setUserData(prev => ({ ...prev, profileImageUrl: null }));
    setGlobalUser(prev => ({ ...prev, profileImageUrl: null }));
  };

  return (
    <DashboardWithSidebar>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-surface to-surface pointer-events-none" />
      <div className="relative z-10 w-full mb-10">
        <ProfileLayout 
          userData={userData}
          role="USER"
          loading={loading}
          onUpdateProfile={handleUpdateProfile}
          onChangePassword={handleChangePassword}
          onUploadPhoto={handleUploadPhoto}
          onRemovePhoto={handleRemovePhoto}
        />
      </div>
      <DashboardFooter />
    </DashboardWithSidebar>
  );
}
