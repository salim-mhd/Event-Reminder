"use client";

import DashboardContent from "@/components/dashboard/DashboardContent";
import PrivateRoute from "@/components/PrivateRoute";
import { initSocket } from "@/socket/socket";
import { setEvents, updateEvent } from "@/store/slices/eventSlice";
import { RootState } from "@/store/store";
import api from "@/utils/api";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardPage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const findCalenderEvents = async () => {
    try {
      const response = await api.get("/calender-events");
      const { data } = response;
      dispatch(setEvents(data?.events));
    } catch (error) {
      console.error("Error fetching calendar events", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    findCalenderEvents();
  }, [user]);

  useEffect(() => {
    const socket = initSocket();
    socket.on("connect", () => {
      console.log("✅ Connected to socket: 88", socket.id);
    });

    socket.on("eventUpdate", (data: { event: any }) => {
      dispatch(updateEvent(data.event));
    });

    return () => {
      socket.off("update");
    };
  }, []);

  return (
    <>
      <PrivateRoute>
        <DashboardContent />
      </PrivateRoute>
    </>
  );
};

export default DashboardPage;
