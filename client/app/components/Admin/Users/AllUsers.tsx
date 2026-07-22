"use client";
import React, { FC, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import {styles} from "../../../../styles/style"

type Props = {
    isTeam: boolean;
};

const AllUsers:FC<Props> = ({isTeam}) => {
  const { theme } = useTheme();
  const { isLoading, data, error } = useGetAllUsersQuery({});
  const [active, setActive] = useState(false)

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
    { field: "created_at", headerName: "Joined at", flex: 0.5 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button>
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        );
      },
    },
    {
      field: "emailAction",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <a href={`mailto:${params.row.email}`}>
           
            <Button>
              <AiOutlineMail className="dark:text-white text-black" size={20} />
            </Button>
          </a>
        );
      },
    },
  ];

  // Clean data mapping using Array.map


const userList = isTeam 
  ? data?.users?.filter((item: any) => item.role === "admin") 
  : data?.users;

const rows = userList
  ? userList.map((item: any) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      courses: item.courses?.length || 0,
      created_at: format(item.createdAt),
    }))
  : [];

  const headerBgColor = theme === "dark" ? "#3e4396" : "#A4A9FC";

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box sx={{ m: "20px" }}>
            <div className="w-full flex justify-end">
                <div
                className={`${styles.button} !w-[250px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-white text-white`}
                onClick={()=>setActive(true)}
                >Add New Member</div>
            </div>
          <Box
            sx={{
              m: "40px 0 0 0",
              height: "80vh",
              "--DataGrid-containerBackground": headerBgColor,
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              // Header Styles
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
                backgroundColor: `${headerBgColor} !important`,
                color: "#fff !important",
                borderBottom: "none",
                borderRight: "none !important", // Removes column right borders
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#fff",
                fontWeight: "bold",
              },
              // Removes vertical column separator bar
              "& .MuiDataGrid-columnSeparator": {
                display: "none !important",
              },
              // Table Body
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30 !important"
                    : "1px solid #ccc !important",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                borderRight: "none !important",
              },
              // Table Footer & Pagination
              "& .MuiDataGrid-footerContainer": {
                color: "#fff",
                backgroundColor: `${headerBgColor} !important`,
                borderTop: "none",
              },
              "& .MuiTablePagination-root": {
                color: "#fff",
              },
              "& .MuiTablePagination-selectIcon": {
                color: "#fff",
              },
              "& .MuiCheckbox-root": {
                color: `${theme === "dark" ? "#fff" : "#000"} !important`,
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#fff !important",
              },
              "& .MuiSvgIcon-root": {
                color: "#fff !important",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllUsers;