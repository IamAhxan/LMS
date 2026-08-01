import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import React, { useState } from "react";
import Loader from "../Loader/Loader";
import Heading from "@/app/utils/Heading";
import CourseContentMedia from "./CourseContentMedia";
import CourseContentList from "./CourseContentList";
import Header from "../Header";

type Props = {
  id: string;
  user: any;
};

const CourseContent = ({ id, user }: Props) => {
  const { data, isLoading, refetch } = useGetCourseContentQuery(id, {refetchOnMountOrArgChange:true});
  const [activeVideo, setActiveVideo] = useState(0);
  const [open, setOpen] = useState(false)
  const [route, setRoute] = useState("Login")

  // ASSUMPTION: response is { success, content: [...] } like your other endpoints.
  // If your controller actually returns a bare array, change this line to: const content = data;
  const content = data?.content;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : content ? (
        <>
        <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute}/>
        <div className="w-full grid 800px:grid-cols-10">
          <Heading
            title={content[activeVideo]?.title}
            description="anything"
            keywords={content[activeVideo]?.tags}
          />
          <div className="col-span-7">
            <CourseContentMedia
              data={content}
              id={id}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              user={user}
              refetch={refetch}
            />
          </div>
          <div className="hidden 800px:block col-span-3">
            <CourseContentList
              setActiveVideo={setActiveVideo}
              data={content}
              activeVideo={activeVideo}
            />
          </div>
        </div>
        </>
      ) : (
        <p className="text-center mt-10">Failed to load course content.</p>
      )}
    </>
  );
};

export default CourseContent;