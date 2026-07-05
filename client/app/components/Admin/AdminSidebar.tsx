"use client"
import React, { FC, JSX, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography } from "@mui/material";
import "react-pro-sidebar/dist/css/styles.css";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import avatarDefault from "../../../public/assets/client-1.jpg";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

interface ItemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: (title: string) => void;
}

const Item: FC<ItemProps> = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Link href={to} className="w-full h-full block">
        <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
      </Link>
    </MenuItem>
  );
};

const SectionTitle = ({ title, isCollapsed }: { title: string; isCollapsed: boolean }) => {
  if (isCollapsed) return null;
  return (
    <Typography
      variant="h5"
      className="!text-[18px] text-black dark:text-[#ffffffc1] font-Poppins font-[400] !mt-[20px] !mb-[10px] !ml-[30px]"
    >
      {title}
    </Typography>
  );
};

const AdminSidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const logoutHandler = () => {
    // Wire up your logout mutation/action here
    console.log("Logging out...");
  };

  return (
    <Box
      sx={{
        // 1. Force outer wrapper root container background to match theme color
        "& .pro-sidebar": {
          background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"}`,
          height: "100vh",
        },
        // 2. Clear out container overflow structures
        "& .pro-sidebar-inner": {
          background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"}`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-menu-item": {
          color: `${theme === "dark" ? "#fff" : "#000"}`,
        },
        // 3. Style native scrollbars inside pro-sidebar inner block to remove blue highlights
        "& .pro-sidebar-inner::-webkit-scrollbar": {
          width: "6px",
        },
        "& .pro-sidebar-inner::-webkit-scrollbar-track": {
          background: `${theme === "dark" ? "#111C43" : "#fff"}`,
        },
        "& .pro-sidebar-inner::-webkit-scrollbar-thumb": {
          background: `${theme === "dark" ? "#5b6fe650" : "#868dfb50"}`,
          borderRadius: "10px",
        },
      }}
      className="!bg-white dark:!bg-[#111C43] !h-screen fixed top-0 left-0 z-[999]"
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
            }}
          >
            {!isCollapsed && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  ml: "15px",
                }}
              >
                <Link href="/admin">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    ELearning
                  </h3>
                </Link>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER PROFILE */}
          {!isCollapsed && (
            <Box sx={{ mb: "25px" }}>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
<div className="w-[100px] h-[100px] relative mb-5">
  <Image
    alt="profile-user"
    fill
    src={user?.avatar?.url || avatarDefault}
    className="cursor-pointer rounded-full border-[3px] border-[#5b6fe6] object-cover"
    sizes="100px"
    priority
  />
</div>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1] font-Poppins !font-[500] mt-[10px]"
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  className="text-black dark:text-[#ffffffc1] font-Poppins"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          {/* SIDEBAR NAVIGATION ITEMS */}
          <Box sx={{ paddingLeft: isCollapsed ? undefined : "10%" }}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Data" isCollapsed={isCollapsed} />
            <Item
              title="Users"
              to="/admin/users"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Content" isCollapsed={isCollapsed} />
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Customization" isCollapsed={isCollapsed} />
            <Item
              title="Hero"
              to="/admin/hero"
              icon={<WebIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Controllers" isCollapsed={isCollapsed} />
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Analytics" isCollapsed={isCollapsed} />
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <SectionTitle title="Extras" isCollapsed={isCollapsed} />
            <Item
              title="Settings"
              to="/admin/settings"
              icon={<SettingsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <MenuItem icon={<ExitToAppIcon />} onClick={logoutHandler}>
              <Typography className="!text-[16px] !font-Poppins">
                Logout
              </Typography>
            </MenuItem>
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default AdminSidebar;