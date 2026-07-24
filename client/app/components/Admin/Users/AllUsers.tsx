"use client";
import React, { FC, useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail, AiOutlineClose } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { styles } from "../../../../styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  
  // 1. Fetch all users
  const { isLoading, data, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // Modal & Form Local States
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userId, setUserId] = useState("");

  // 2. Initialize RTK Query Mutation Hooks
  const [updateUserRole, { isSuccess: isRoleSuccess, error: roleError }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: isDeleteSuccess, error: deleteError }] =
    useDeleteUserMutation();

  // 3. Effect for Role Update Response
  useEffect(() => {
    if (isRoleSuccess) {
      refetch();
      toast.success("User role updated successfully!");
      setActive(false);
      setEmail("");
    }
    if (roleError) {
      if ("data" in roleError) {
        const errorData = roleError as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isRoleSuccess, roleError, refetch]);

  // 4. Effect for Delete User Response
  useEffect(() => {
    if (isDeleteSuccess) {
      refetch();
      toast.success("User deleted successfully!");
      setOpenDeleteModal(false);
      setUserId("");
    }
    if (deleteError) {
      if ("data" in deleteError) {
        const errorData = deleteError as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isDeleteSuccess, deleteError, refetch]);

  // 5. Submit Role Update Handler
  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Find target user by email to retrieve their _id
    const targetUser = data?.users?.find(
      (user: any) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (!targetUser) {
      toast.error("User with this email not found!");
      return;
    }

    // Call update endpoint with id and role
    await updateUserRole({ id: targetUser._id, role });
  };

  // 6. Delete Action Handler
  const handleDelete = async () => {
    if (userId) {
      await deleteUser(userId);
    }
  };

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
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpenDeleteModal(true);
            setUserId(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      ),
    },
    {
      field: "emailAction",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => (
        <a href={`mailto:${params.row.email}`}>
          <Button>
            <AiOutlineMail className="dark:text-white text-black" size={20} />
          </Button>
        </a>
      ),
    },
  ];

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
              className={`${styles.button} !w-[220px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-white text-white cursor-pointer flex items-center justify-center font-Poppins rounded-md text-[14px]`}
              onClick={() => setActive(true)}
            >
              Add New Member
            </div>
          </div>

          <Box
            sx={{
              m: "40px 0 0 0",
              height: "80vh",
              "--DataGrid-containerBackground": headerBgColor,
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
                backgroundColor: `${headerBgColor} !important`,
                color: "#fff !important",
                borderBottom: "none",
                borderRight: "none !important",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                color: "#fff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-columnSeparator": { display: "none !important" },
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
              "& .MuiDataGrid-footerContainer": {
                color: "#fff",
                backgroundColor: `${headerBgColor} !important`,
                borderTop: "none",
              },
              "& .MuiTablePagination-root": { color: "#fff" },
              "& .MuiTablePagination-selectIcon": { color: "#fff" },
              "& .MuiCheckbox-root": {
                color: `${theme === "dark" ? "#fff" : "#000"} !important`,
              },
              "& .MuiDataGrid-sortIcon": { color: "#fff !important" },
              "& .MuiSvgIcon-root": { color: "#fff !important" },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {/* Add/Update Role Modal */}
          {active && (
            <Modal open={active} onClose={() => setActive(false)}>
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-6 outline-none">
                <div className="flex justify-between items-center pb-3">
                  <h1 className={`${styles.title} !text-[22px]`}>Add New Member</h1>
                  <AiOutlineClose
                    className="text-black dark:text-white cursor-pointer"
                    size={22}
                    onClick={() => setActive(false)}
                  />
                </div>

                <form onSubmit={handleRoleSubmit} className="mt-4">
                  <div className="w-full mb-4">
                    <label className={`${styles.label}`}>Enter User Email</label>
                    <input
                      type="email"
                      required
                      placeholder="user@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${styles.input} mt-2`}
                    />
                  </div>

                  <div className="w-full mb-6">
                    <label className={`${styles.label}`}>Select Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className={`${styles.input} mt-2 bg-transparent text-black dark:text-white border dark:border-white/20`}
                    >
                      <option value="admin" className="text-black dark:text-white dark:bg-slate-800">
                        Admin
                      </option>
                      <option value="user" className="text-black dark:text-white dark:bg-slate-800">
                        User
                      </option>
                    </select>
                  </div>

                  <div className="flex w-full items-center justify-end">
                    <input
                      type="submit"
                      value="Submit"
                      className={`${styles.button} !w-[120px] !h-[35px] cursor-pointer text-white`}
                    />
                  </div>
                </form>
              </Box>
            </Modal>
          )}

          {/* Delete User Modal */}
          {openDeleteModal && (
            <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-6 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-2 mt-6">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3] cursor-pointer text-white flex items-center justify-center`}
                    onClick={() => setOpenDeleteModal(false)}
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

export default AllUsers;