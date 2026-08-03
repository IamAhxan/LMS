"use client";

import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import CourseCard from "../components/Course/CourseCard";
import { styles } from "@/styles/style";

type Props = {};

const CoursesInner = () => {
  const searchParams = useSearchParams();
  const search = searchParams?.get("title");

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
  // Query with capitalized "Categories" to match MongoDB type definition
  const { data: categoriesData } = useGetHeroDataQuery("Categories");

  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<any>([]);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (!data?.courses) return;

    let filtered = [...data.courses];

    // 1. Filter by Category
    if (category !== "All") {
      filtered = filtered.filter((course: any) => {
        // Check both 'categories' and 'tags' fields from your API schema
        const courseCategory = course.categories || course.category || course.tags;

        if (!courseCategory) return false;

        // If categories is stored as an array (e.g. ["Programming", "Web Dev"])
        if (Array.isArray(courseCategory)) {
          return courseCategory.some((cat: any) => {
            const val = typeof cat === "string" ? cat : cat?.title;
            return val?.toLowerCase().trim() === category.toLowerCase().trim();
          });
        }

        // If categories is stored as a plain string
        if (typeof courseCategory === "string") {
          return courseCategory.toLowerCase().trim() === category.toLowerCase().trim();
        }

        // If categories is stored as an object
        if (typeof courseCategory === "object") {
          return (
            courseCategory?.title?.toLowerCase().trim() ===
            category.toLowerCase().trim()
          );
        }

        return false;
      });
    }

    // 2. Filter by Search Query (Uses course.name and fallback course.title)
    if (search && search.trim() !== "") {
      const query = search.trim().toLowerCase();
      filtered = filtered.filter((course: any) => {
        const courseTitle = (course.name || course.title || "").toLowerCase();
        return courseTitle.includes(query);
      });
    }

    setCourses(filtered);
  }, [data, category, search]);

  const categories = categoriesData?.layout?.categories ?? [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Header
            route={route}
            setRoute={setRoute}
            open={open}
            setOpen={setOpen}
            activeItem={1}
          />

          <div className="w-[95%] 800px:w-[85%] m-auto min-h-[70vh]">
            <Heading
              title="All Courses"
              description="Explore our wide range of courses and find the perfect one for you."
              keywords="Programming Community, Coding Skills"
            />

            {/* Category Filter Pills */}
            <div className="w-full flex items-center flex-wrap my-5">
              <div
                className={`h-[35px] ${
                  category === "All" ? "bg-[crimson]" : "bg-[#5050cb]"
                } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                onClick={() => setCategory("All")}
              >
                All
              </div>

              {categories.map((item: any, index: number) => (
                <div
                  key={item._id || index}
                  className={`h-[35px] ${
                    category === item._id ? "bg-[crimson]" : "bg-[#5050cb]"
                  } m-3 px-3 rounded-[30px] flex items-center justify-center font-Poppins cursor-pointer text-white`}
                  onClick={() => setCategory(item._id)}
                >
                  {item.title}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {courses && courses.length === 0 && (
              <div
                className={`${styles.label} justify-center min-h-[50vh] flex items-center text-center`}
              >
                {search
                  ? "No courses found!"
                  : "No courses found in this category. Please try another one!"}
              </div>
            )}

            {/* Courses Grid */}
            {courses && courses.length > 0 && (
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] 1500px:grid-cols-4 1500px:gap-[35px] mb-12 border-0">
                {courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={item._id || index} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

const Page = (props: Props) => {
  return (
    <Suspense fallback={<Loader />}>
      <CoursesInner />
    </Suspense>
  );
};

export default Page;