"use client";

import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData";
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import {useRouter } from "next/navigation"; // 
import { useEditCourseMutation, useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import toast from "react-hot-toast";

type Props = {
    id: string
};

const EditCourse:FC<Props> = ({id}) => {

    const [editCourse, {isSuccess, error}] = useEditCourseMutation();
    const { data, refetch } = useGetAllCoursesQuery(
      {},
      { refetchOnMountOrArgChange: true },
    );

    const editCourseData = data && data.courses.find((i:any)=> i._id === id)
console.log(editCourseData)


  const router = useRouter(); // Fixed: Initialize router

  useEffect(() => {
    if (isSuccess) {
      toast.success("Course Updated Successfully");
      router.push("/admin/all-courses"); // Fixed: Use router.push instead of redirect()
    }
    if (error && "data" in error) {
      const errorMessage = error as any;
      toast.error(errorMessage.data.message || "Something went wrong");
    }
  }, [isSuccess, error, router]);

  const [active, setActive] = useState(0);


  useEffect(() => {
  if (editCourseData) {
    setCourseInfo({
      name: editCourseData.name,
      description: editCourseData.description,
      price: editCourseData.price,
      estimatedPrice: editCourseData.estimatedPrice,
      tags: editCourseData.tags,
      level: editCourseData.level,
      demoUrl: editCourseData.demoUrl,
      thumbnail: editCourseData?.thumbnail?.url,
    });
    setBenefits(editCourseData.benefits);
    setPrerequisites(editCourseData.prerequisites);
    setCourseContentData(editCourseData.courseData);
  }
}, [editCourseData]);


  const [courseInfo, setCourseInfo] = useState({
    name: "",
    description: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "",
    demoUrl: "",
    thumbnail: "",
  });
  const [benefits, setBenefits] = useState([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
  const [courseContentData, setCourseContentData] = useState([
    {
      videoUrl: "",
      title: "",
      description: "",
      videoSection: "Untitled Section",
      links: [
        {
          title: "",
          url: "",
        },
      ],
      suggestion: "",
    },
  ]);
  const [courseData, setCourseData] = useState({});

  // Helper function to build the complete data payload reliably
  const formatCoursePayload = () => {
    const formattedBenefits = benefits.map((benefit) => ({
      title: benefit.title,
    }));
    const formattedPrerequisites = prerequisites.map((prerequisite) => ({
      title: prerequisite.title,
    }));
    const formattedCourseContentData = courseContentData.map((courseContent) => ({
      videoUrl: courseContent.videoUrl,
      title: courseContent.title,
      description: courseContent.description,
      links: courseContent.links.map((link) => ({
        title: link.title,
        url: link.url,
      })),
      suggestion: courseContent.suggestion,
    }));

    return {
      name: courseInfo.name,
      description: courseInfo.description,
      price: courseInfo.price,
      estimatedPrice: courseInfo.estimatedPrice,
      tags: courseInfo.tags,
      thumbnail: courseInfo.thumbnail,
      level: courseInfo.level,
      demoUrl: courseInfo.demoUrl,
      totalVideos: courseContentData.length,
      benefits: formattedBenefits,
      prerequisites: formattedPrerequisites,
      courseContentData: formattedCourseContentData,
    };
  };

  const handleSubmit = async () => {
    const data = formatCoursePayload();
    setCourseData(data);
  };

  const handleCourseCreate = async () => {
const data = courseData;
await editCourse({id:editCourseData?._id, data})
  };

  return (
    <div className="w-full flex min-h-screen">
      <div className="w-[80%]">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 1 && (
          <CourseData
            benefits={benefits}
            setBenefits={setBenefits}
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CourseContent
            active={active}
            setActive={setActive}
            courseContentData={courseContentData}
            setCourseContentData={setCourseContentData}
            handleSubmit={handleSubmit}
          />
        )}
        {active === 3 && (
          <CoursePreview
            active={active}
            setActive={setActive}
            courseData={courseData}
            handleCourseCreate={handleCourseCreate}
             isEdit={true}
          />
        )}
      </div>
      <div className="w-[20%] mt-[100px] h-screen fixed z-10 top-18 right-0">
        <CourseOptions active={active} setActive={setActive} />
      </div>
    </div>
  );
};

export default EditCourse;