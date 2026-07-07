"use client"
import React from 'react'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import Heading from "../../../app/utils/Heading"
import CreateCourse from "../../components/Admin/Course/CreateCourse"
import DashboardHeader from "../../components/Admin/DashboardHeader"

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <Heading
        title="Elearning - Create Course"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, sed?"
        keywords="Programming, MERN, Redux, Machine Learning"
      />
      <div className="flex">
        <div className="1500px:w-[16%] w-1/5">
            <AdminSidebar/>
        </div>
        <div className="w-[85%]">
            <DashboardHeader/>
            <CreateCourse/>
        </div>
      </div>
    </div>
  )
}

export default page