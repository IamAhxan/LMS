"use client"
import { useState } from 'react'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import DashboardHeader from '../../components/Admin/DashboardHeader'
import Heading from '@/app/utils/Heading'
import OrdersAnalytics from "../../components/Admin/Analytics/OrdersAnalytics"
import { useParams } from 'next/navigation'
import AllInvoices from '../../components/Order/AllInvoices'

const page = () => {
  const [open, setOpen] = useState(false)
  const params = useParams();
  const id = params?.id as string;
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
            <DashboardHeader setOpen={setOpen} />
            <AllInvoices/>
            

        </div>
      </div>
    </div>
  )
}

export default page