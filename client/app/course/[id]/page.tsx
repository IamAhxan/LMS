"use client"

import { use } from "react";
import CourseDetailsPage from "../../components/Course/CourseDetailsPage"

type Props = {
    params: Promise<{ id: string }>;
}

const Page = ({params}: any) => {
const resolvedParams = use<{ id: string }>(params);
  return (
    <div>
        <CourseDetailsPage id={resolvedParams.id}/>
    </div>
  )
}

export default Page