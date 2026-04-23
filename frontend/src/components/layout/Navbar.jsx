import { useEffect, useState } from "react";
import LoggedInNav from "./LoggedInNav";
import DefaultNav from "./DefaultNav";

const Navbar = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Check localStorage on mount
    setUserId(localStorage.getItem("userId"));

    // Listen to storage events just in case login/logout happens in another tab
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return userId ? <LoggedInNav /> : <DefaultNav />;
};

export default Navbar;
