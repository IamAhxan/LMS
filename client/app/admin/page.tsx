"use client";

import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/AdminSidebar";
import DashboardHero from "../components/Admin/DashboardHero"
import AdminProtected from "../hooks/adminProtected";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
      <Heading
        title="Elearning - Admin"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, sed?"
        keywords="Programming, MERN, Redux, Machine Learning"
      />

      <div className="flex h-[200vh]">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
            <DashboardHero  isDashboard={true}/>
        </div>
      </div>
      </AdminProtected>
    </div>
  );
};

export default page;
