"use client"

import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import AllCourses from "../../components/Admin/Course/AllCourses"
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
      <Heading
        title="Elearning - Admin"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, sed?"
        keywords="Programming, MERN, Redux, Machine Learning"
      />

      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
            <DashboardHero />
            <AllCourses/>
        </div>
      </div>
      </AdminProtected>
    </div>
  )
}

export default page