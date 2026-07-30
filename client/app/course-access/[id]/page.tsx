"use client";

import Loader from "@/app/components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import CourseContent from "../../components/Course/CourseContent";
type Props = {
  params: Promise<{ id: string }>; // 2. Update type definition to Promise
};

const Page = ({ params }: Props) => {
  // 3. Unwrap params asynchronously using React.use()
  const { id } = use(params);

  const router = useRouter();
  const { isLoading, error, data } = useLoadUserQuery(undefined, {});


  useEffect(() => {
    // 1. Redirect if fetching user failed (unauthorized/token expired)
    if (error) {
      router.push("/");
      return;
    }

    // 2. Once data is successfully loaded, verify course access
    if (data) {
      const isPurchased = data?.user?.courses?.some(
        (item: any) => item._id === id || item.courseId === id
      );

      if (!isPurchased) {
        router.push("/");
      }
    }
  }, [data, error, id, router]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      {data && <CourseContent id={id} user={data.user} />}
    </div>
  );
};

export default Page;