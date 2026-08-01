import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import React, { useEffect, useState } from "react";
import Loader from "../../components/Loader/Loader";
import CourseCard from "../../components/Course/CourseCard";
import { styles } from "@/styles/style";

type Props = {};

const Courses = (props: Props) => {
const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    if (data?.courses) {
      setCourses(data.courses);
    }
  }, [data]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-[90%] 800px:w-[80%] m-auto min-h-[85vh] py-10">
          <h1 className={`${styles.title} !text-start !text-[25px]`}>
            All Courses ({courses?.length || 0})
          </h1>
          <br />
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard item={item} key={index} />
              ))}
          </div>
          {courses && courses.length === 0 && (
            <p className="text-center text-[18px] dark:text-white text-black py-10">
              No courses found!
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default Courses;
