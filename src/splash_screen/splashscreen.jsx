import { useState, useEffect, useRef } from "react";
import image1 from "../assets/Teal and White Modern Fashion Poster.png";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function SplashScreen() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSettingsClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleChangePassword = () => {
    setDropdownOpen(false);
    navigate("/change-password");
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/image-upload");
    } else {
      navigate("/login");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[2fr_3fr] relative">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center px-12 text-[#1f3d36] relative">
        {/* NAVBAR BUTTONS TOP-RIGHT INSIDE LEFT PANEL */}
        {user && (
          <div
            className="absolute top-4 right-4 flex gap-2 items-center"
            ref={dropdownRef}
          >
            {/* SETTINGS BUTTON */}
            <div className="relative">
              <button
                onClick={handleSettingsClick}
                className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition flex items-center justify-center"
                title="Settings"
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={handleChangePassword}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    Change Password
                  </button>
                  {/* Add more options here if needed */}
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}

        <h1 className="text-5xl font-bold mb-5">AI Fashion Stylist</h1>

        <p className="text-lg">
          <span className="text-red-600 font-bold">
            Discover outfits powered by AI{" "}
          </span>
          <br /> That understand your taste, recommend trendy styles, and help
          you look confident every day with perfectly matched fashion choices.
        </p>

        <button
          onClick={handleGetStarted}
          className="w-fit bg-[#1f3d36] text-white font-semibold px-10 py-3 mt-4 rounded-full hover:opacity-90 transition"
        >
          Get Started
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center">
        <div className="w-[620px] h-[800px] flex items-center justify-center">
          <img
            src={image1}
            alt="AI Fashion"
            className="w-full h-full object-cover rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
