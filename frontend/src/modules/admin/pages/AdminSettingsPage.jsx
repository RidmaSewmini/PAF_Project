import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardWithSidebar from "../../../components/layout/DashboardWithSidebar";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    footerText: "",
    contactInfo: ""
  });
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/admin/settings");
      setSettings(res.data);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8080/admin/settings", settings);
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <DashboardWithSidebar>
      <div className="absolute inset-0 bg-[#f8f9fc] pointer-events-none" />
      <div className="relative z-10 w-full max-w-4xl mx-auto mb-10 mt-6 min-h-[60vh] flex flex-col">
        
        <div className="bg-white rounded-[2rem] p-8 shadow-glass mb-6 border border-surface-container-highest flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="font-aldrich text-4xl text-on-surface">System Settings</h1>
            <p className="text-on-surface/60 font-medium mt-1">Configure global platform metadata and content.</p>
          </div>
          <button 
            onClick={handleSave}
            className="px-6 py-3 rounded-full font-bold text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm active:scale-95"
          >
            Save Settings
          </button>
        </div>

        <div className="flex-1 bg-white rounded-[2rem] p-6 sm:p-8 shadow-glass border border-surface-container-highest overflow-hidden">
          {loading ? (
             <div className="py-20 text-center text-on-surface/50 font-bold animate-pulse">Loading settings...</div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-on-surface/80 mb-2">Footer Copyright Text</label>
                <input
                  type="text"
                  value={settings.footerText || ""}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-container-highest rounded-xl bg-surface-container-low focus:outline-none focus:border-primary text-sm transition-colors"
                  placeholder="© 2026 CampusFlow • Your Campus, Streamlined. All rights reserved."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface/80 mb-2">Support Contact Info</label>
                <input
                  type="text"
                  value={settings.contactInfo || ""}
                  onChange={(e) => setSettings({ ...settings, contactInfo: e.target.value })}
                  className="w-full px-4 py-3 border border-surface-container-highest rounded-xl bg-surface-container-low focus:outline-none focus:border-primary text-sm transition-colors"
                  placeholder="support@campusflow.io"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardWithSidebar>
  );
}
