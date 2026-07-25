import React, { useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdOutlineOndemandVideo } from 'react-icons/md';

type Props = {
    data: any,
    activeVideo?:number,
    setActiveVideo: any,
    isDemo?:boolean,
}

const CourseContentList = (props: Props) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(
        new Set<String>()
    );


    const videoSections: string[] = [
        ...new Set<string>(props?.data?.map((item: any)=>item.videoSection))
    ]


    let totalCount: number = 0;

    const toggleSection = (section:string)=>{
        const newVisibleSections = new Set(visibleSections);
        if(newVisibleSections.has(section)){
            newVisibleSections.delete(section)
        }else{
            newVisibleSections.add(section);
        }
        setVisibleSections(newVisibleSections)
    }

return (
  <div
    className={`mt-[15px] w-full ${
      !props.isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"
    }`}
  >
    {videoSections.map((section: string, sectionIndex: number) => {
      const isSectionVisible = visibleSections.has(section);

      // Filter videos by section
      const sectionVideos: any[] = props.data?.filter(
        (item: any) => item.videoSection === section
      );

      const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
      const sectionVideoLength: number = sectionVideos.reduce(
        (totalLength: number, item: any) => totalLength + item.videoLength,
        0
      );

      const sectionStartIndex: number = totalCount; // Start index of videos within the current section
      totalCount += sectionVideoCount; // Update the total count of videos

      const sectionContentHours: number = sectionVideoLength / 60;

      return (
        <div
          className={`${!props.isDemo && "border-b border-[#ffffff8e] pb-2"}`}
          key={section}
        >
          {/* Section Header with Toggle */}
          <div className="w-full flex justify-between items-center cursor-pointer py-2">
            <h2 className="text-[22px] font-Poppins text-black dark:text-white">
              {section}
            </h2>
            <button
              className="text-black dark:text-white mr-4"
              onClick={() => toggleSection(section)}
            >
              {isSectionVisible ? (
                <BsChevronUp size={20} />
              ) : (
                <BsChevronDown size={20} />
              )}
            </button>
          </div>

          <h5 className="text-[14px] text-black dark:text-white opacity-70">
            {sectionVideoCount} Lessons •{" "}
            {sectionVideoLength < 60
              ? `${sectionVideoLength} mins`
              : `${sectionContentHours.toFixed(2)} hours`}
          </h5>

          {/* Section Videos List */}
          {isSectionVisible && (
            <div className="w-full mt-3">
              {sectionVideos.map((item: any, index: number) => {
                const videoIndex: number = sectionStartIndex + index;
                const contentLength: number = item.videoLength;

                return (
                  <div
                    className={`w-full ${
                      videoIndex === props.activeVideo ? "bg-slate-800" : ""
                    } cursor-pointer transition-all p-2 rounded`}
                    key={item._id || index}
                    onClick={() =>
                      props.isDemo ? null : props.setActiveVideo(videoIndex)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MdOutlineOndemandVideo
                          size={25}
                          className="mr-2 text-[#1cdada]"
                        />
                        <h1 className="text-[18px] text-black dark:text-white inline-block">
                          {item.title}
                        </h1>
                      </div>
                      <h5 className="text-[14px] text-black dark:text-white opacity-70">
                        {contentLength > 60
                          ? `${(contentLength / 60).toFixed(2)} hours`
                          : `${contentLength} mins`}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
}

export default CourseContentList