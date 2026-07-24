import React, { FC } from "react";
import CourseData from "./CourseData";
import CoursePlayer from "./../../../utils/CoursePlayer";
import { styles } from "../../../../styles/style";
import Ratings from "../../../utils/Ratings";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  isEdit: boolean
};

const CoursePreview: FC<Props> = ({
  courseData,
  handleCourseCreate,
  active,
  setActive,
  isEdit
}) => {
  const discountPercentage =
    ((courseData?.estimatedPrice - courseData?.price) /
      courseData?.estimatedPrice) *
    100;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const createCourse = () => {
    handleCourseCreate();
  };

  const prevButton = () => {
    setActive(active - 1);
  };

  return (
    <div className="w-[90%] md:w-[85%] m-auto py-5 mb-5">
      <div className="w-full relative">
        <div className="w-full mt-10">
          <CoursePlayer
            videoUrl={courseData?.demoUrl}
            title={courseData?.title}
          />
        </div>
        
        {/* Pricing Layout Structure */}
        <div className="flex items-center pt-5">
          <h1 className="text-[25px] font-semibold text-black dark:text-white">
            {courseData?.price === 0 ? "Free" : `${courseData?.price}$`}
          </h1>
          <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80 text-black dark:text-white">
            {courseData?.estimatedPrice}$
          </h5>
          <h4 className="pl-5 pt-1 text-[22px] text-emerald-500">
            {discountPercentagePrice}% off
          </h4>
        </div>

        {/* Action Button Layout */}
        <div className="flex items-center my-3">
          <div className={`${styles.button} !w-[180px] font-Poppins !bg-[crimson] cursor-not-allowed text-white`}>
            Buy Now {courseData?.price}$
          </div>
        </div>

        {/* Promo Code Input & Details */}
        <div className="flex items-center text-black dark:text-white mb-4">
          <input
            type="text"
            placeholder="Discount Code..."
            className={`${styles.input} !w-[50%] md:!w-[60%] !mt-0`}
          />
          <div className={`${styles.button} !w-[100px] ml-4 font-Poppins cursor-pointer`}>
            Apply
          </div>
        </div>

        {/* Course Core Perks (Using a structured flex column list layout) */}
        <div className="flex flex-col gap-2 my-4 text-black dark:text-white font-Poppins">
          <p className="pb-1">✓ Source Code Included</p>
          <p className="pb-1">✓ Full lifetime Access</p>
          <p className="pb-1">✓ Certificate of Completion</p>
          <p className="pb-1">✓ Premium Support</p>
        </div>

        {/* Course Headings */}
        <div className="w-full mt-5">
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            {courseData?.name}
          </h1>
          <div className="flex items-center justify-between pt-3 text-black dark:text-white">
            <div className="flex items-center gap-2">
              <Ratings rating={0} />
              <h5>0 Reviews</h5>
            </div>
            <h5>0 Students</h5>
          </div>
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-700" />

        {/* Benefits Section */}
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          What you'll learn
        </h1>
        {courseData?.benefits?.map((item: any, index: number) => (
          <div className="w-full flex items-center py-2 text-black dark:text-white" key={index}>
            <div className="w-[15px] mr-2">
              <IoCheckmarkDoneOutline size={20} className="text-emerald-500" />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}

        <br />
        
        {/* Prerequisites Section */}
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          What are the prerequisites for starting this course?
        </h1>
        {courseData?.prerequisites?.map((item: any, index: number) => (
          <div className="w-full flex items-center py-2 text-black dark:text-white" key={index}>
            <div className="w-[15px] mr-2">
              <IoCheckmarkDoneOutline size={20} className="text-emerald-500" />
            </div>
            <p className="pl-2">{item.title}</p>
          </div>
        ))}

        <br />

        {/* Course Description Section (Cleaned up raw text comment syntax bug) */}
        <div className="w-full text-black dark:text-white">
          <h1 className="text-[25px] font-Poppins font-[600]">
            Course Details
          </h1>
          <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden leading-relaxed">
            {courseData?.description}
          </p>
        </div>
        <br />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex items-center justify-between mt-8">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff]  rounded cursor-pointer"
          onClick={prevButton}
        >
          Prev
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff]  rounded cursor-pointer"
          onClick={createCourse}
        >
         {
          isEdit ? "Edit" : "Create"
         }
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;