import React, { FC } from "react";
import Image from "next/image";
import avatarDefault from "../../../public/assets/client-1.jpg";
import { RiLockPasswordLine } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { AiOutlineLogout } from "react-icons/ai";

type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SidebarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logoutHandler,
}) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 1 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user?.avatar?.url || avatar || avatarDefault}
          alt=""
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] rounded-full cursor-pointer"
          width={30}
          height={30}
        />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins">
          My Account
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
        onClick={() => setActive(2)}
      >
        <RiLockPasswordLine size={20} fill="#fff" />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins">
          Change Password
        </h5>
      </div>

      <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
        onClick={() => setActive(3)}
      >
        <SiCoursera size={20} fill="#fff" />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins">
          Enrolled Courses
        </h5>
      </div>

              <div
        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? "dark:bg-slate-800 bg-white" : "bg-transparent"}`}
        onClick={() => logoutHandler()}
      >
        <AiOutlineLogout size={20} fill="#fff" />
        <h5 className="pl-2 800px:block hidden text-black dark:text-white font-Poppins">
          Log Out
        </h5>
      </div>


    </div>
  );
};

export default SidebarProfile;
