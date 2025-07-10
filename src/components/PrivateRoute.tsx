"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createUser } from "@/store/slices/authSlice"; // adjust path if needed

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [isClient, setIsClient] = useState(false);

  console.log("user", user);

  useEffect(() => {
    setIsClient(true);

    const token = localStorage.getItem("token");
    const localUser: any = localStorage.getItem("user");

    if (!token) {
      router.push("/login");
    } else {
      if (!user && localUser) {
        try {
          const parsedUser = JSON.parse(localUser);
          dispatch(createUser(parsedUser));
        } catch (error) {
          console.error("Error parsing local user:", error);
          router.push("/login");
        }
      }
    }
  }, [router, user, dispatch]);

  // Wait until client is ready to render anything that relies on localStorage
  if (!isClient) return null;

  return <>{children}</>;
};

export default PrivateRoute;
