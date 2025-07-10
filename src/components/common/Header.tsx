"use client";

import { useRouter } from "next/router";
import "@/styles/globals.css";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());

    router.push("/login");
  };

  return (
    <header className="rounded-[10px] bg-linear-65 from-green-700 to-green-950 shadow-lg px-6 py-4 flex justify-between items-center text-white">
      {/* Logo */}
      <div
        className="text-2xl font-extrabold cursor-pointer tracking-wide"
        onClick={() => router.push("/dashboard")}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-white">
          Event Reminder
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-4 bg-white text-pink-600 font-semibold px-4 py-2 rounded-full hover:bg-pink-100 transition duration-300"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Header;
