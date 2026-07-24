"use client"
import AdminSidebar from '../../components/Admin/AdminSidebar'
import DashboardHeader from '../../components/Admin/DashboardHeader'
import Heading from '@/app/utils/Heading'
import OrdersAnalytics from "../../components/Admin/Analytics/OrdersAnalytics"
import { useParams } from 'next/navigation'


type Props = {}

const page = () => {
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
            <DashboardHeader setOpen={function (open: boolean): void {
            throw new Error('Function not implemented.')
          } }/>
            <OrdersAnalytics/>

        </div>
      </div>
    </div>
  )
}

export default page