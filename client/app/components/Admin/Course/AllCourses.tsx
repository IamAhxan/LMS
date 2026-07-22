import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import {format} from "timeago.js"

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
  const {isLoading, data, error} = useGetAllCoursesQuery({})

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "   ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Button>
        );
      },
    },
    {
      field: "  ",
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
  ];
  const rows: any[] = [];
  
  if (data && data.courses) {
    data.courses.forEach((item: any) => {
      rows.push({
        id: item._id,
        title: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt),
      });
    });
  }



  const headerBgColor = theme === "dark" ? "#3e4396" : "#A4A9FC";

  return (
    <div className="mt-[120px]">
        {
            isLoading ? (
                <Loader/>
            ) : (
                      <Box sx={{ m: "20px" }}>
        <Box
          sx={{
            m: "40px 0 0 0",
            height: "80vh",
            // Direct MUI CSS variable overrides for modern DataGrid versions
            "--DataGrid-containerBackground": headerBgColor,
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none",
            },
            // Style individual column headers and full header container
            "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
              backgroundColor: `${headerBgColor} !important`,
              color: "#fff !important",
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#fff",
              fontWeight: "bold",
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
            )
        }
    </div>
  );
};

export default AllCourses;
