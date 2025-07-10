import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CommonTextField from "../common/CommonTextField";
import api from "@/utils/api";
import { updateUser } from "@/store/slices/authSlice";

const PhoneNumberInput = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Separate state for country code and number
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    setPhoneNumber(user.phoneNumber || "");
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // digits only
    const limited = input.slice(0, 10); // max 10 digits
    setPhoneNumber(limited);
  };

  const handleSubmit = async () => {
    if (phoneNumber.length === 10) {
      const fullPhone = `${countryCode}${phoneNumber}`;
      console.log("Submitted:", fullPhone);
      const { data } = await api.put("/update-user", { phoneNumber });
      const updatedData = data.user;
      dispatch(updateUser(updatedData));
      localStorage.setItem("user", JSON.stringify({ ...user, ...updatedData }));
    } else {
      alert("Please enter a valid 10-digit number");
    }
  };

  return (
    <div className="flex items-center mb-2 ">
      {/* Country code (fixed or dropdown if needed) */}
      <div className="mx-2 text-gray-800 font-semibold">{countryCode}</div>

      <CommonTextField
        label="Enter Phone Number"
        value={phoneNumber}
        onChange={handleChange}
        maxLength={10}
      />

      <button
        disabled={phoneNumber.length !== 10}
        onClick={handleSubmit}
        className={`ml-4 mt-2 h-[50px] font-semibold px-4 py-2 rounded-full transition duration-300 ${
          phoneNumber.length === 10
            ? "bg-green-800 text-white hover:bg-green-700"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
    </div>
  );
};

export default PhoneNumberInput;
