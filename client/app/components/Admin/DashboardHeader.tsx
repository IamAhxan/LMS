"use client";
import ThemeSwitcher from "../../utils/ThemeSwitcher";
import React, { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";

type Props = {
  open?: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({open, setOpen}) => {


  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[999]">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          3
        </span>
      </div>

      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 right-5 z-10 rounded p-3 overflow-y-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>

          {/* Notification Item Example */}
          <div className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] rounded-md mb-2">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black dark:text-white">
                New Question Received
              </p>
              <p className="text-black dark:text-white cursor-pointer text-[14px]">
                Mark as read
              </p>
            </div>
            <p className="p-2 text-black dark:text-[#ffffffb3] text-[14px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ssed do
              eiusmod tempor.
            </p>
            <p className="p-2 text-black dark:text-[#ffffffb3] text-[12px]">
              5 days ago
            </p>
          </div>

          {/* Additional static layout item for reference */}
          <div className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] rounded-md mb-2">
            <div className="w-full flex items-center justify-between p-2">
              <p className="text-black dark:text-white">New Order Received</p>
              <p className="text-black dark:text-white cursor-pointer text-[14px]">
                Mark as read
              </p>
            </div>
            <p className="p-2 text-black dark:text-[#ffffffb3] text-[14px]">
              A new student just enrolled in your premium course track.
            </p>
            <p className="p-2 text-black dark:text-[#ffffffb3] text-[12px]">
              2 hours ago
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
