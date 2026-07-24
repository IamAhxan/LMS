import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useTheme } from "next-themes";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "../../../../styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme } = useTheme();
const { isLoading, data, error, refetch } = useGetAllCoursesQuery(
  {},
  { refetchOnMountOrArgChange: true },
);
console.log("courses data:", data, "error:", error);
  const [deleteCourse, { isSuccess, error: errorDelete }] =
    useDeleteCourseMutation({});
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");

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
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2 className="dark:text-white text-black mt-4" size={20} />
          </Link>
        );
      },
    },
    {
      field: "  ",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <Button
            onClick={() => {
              setOpen(true);
              setCourseId(params.row.id);
            }}
          >
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

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully");
    }
    if (errorDelete) {
      if ("data" in errorDelete) {
        const errorMessage = errorDelete as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, errorDelete]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
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
          {open && (
            <Modal open={open} onClose={() => setOpen(false)}>
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-6 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-2 mt-6">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3] cursor-pointer text-white flex items-center justify-center`}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63031] cursor-pointer text-white flex items-center justify-center`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
