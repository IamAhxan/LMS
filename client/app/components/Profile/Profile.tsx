"use client";
import React, { FC, useEffect, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import { useLogoutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import CourseCard from "../Course/CourseCard";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const {} = useLogoutQuery(undefined, {
    skip: !logout,
  });
  
  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  const logoutHandler = async () => {
    setLogout(true);
    await signOut({ redirect: false });
    dispatch(apiSlice.util.resetApiState());
    router.push("/");
  };

  // 1. Move scroll listener inside useEffect with cleanup
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

useEffect(() => {
  if (data && user) {
    const allCourses = data.courses || data.course || [];

    if (Array.isArray(user.courses)) {
      const filteredCourses = user.courses
        .map((userCourse: any) => {
          // Extracts courseId first, falls back to _id if userCourse is formatted differently
          const userCourseId = typeof userCourse === "string" 
            ? userCourse 
            : (userCourse.courseId || userCourse._id);

          return allCourses.find(
            (course: any) => String(course._id) === String(userCourseId)
          );
        })
        .filter((course: any) => course !== undefined);

      setCourses(filteredCourses);
    }
  }
}, [data, user]);

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border-[#0000001e] dark:border-[#ffffff1d] rounded-[5px] dark:shadow-sm shadow-lg mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SidebarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>

      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={null} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}

      {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8 mt-[80px]">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard
                  item={item}
                  key={index}
                  isProfile={true}
                />
              ))}
          </div>
          {courses?.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins text-black dark:text-white mt-[50px]">
              You don't have any purchased courses!
            </h1>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;