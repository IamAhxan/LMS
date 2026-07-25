import Link from "next/link";
import React, { FC } from "react";
import Image from "next/image";
import Ratings from "@/app/utils/Ratings";
import { AiOutlineUnorderedList } from "react-icons/ai";

type Props = {
  item: any;
  isProfile?: boolean;
};

const CourseCard: FC<Props> = ({ item, isProfile }) => {
  return (
    <Link
      href={!isProfile ? `/course/${item._id}` : `/course-access/${item._id}`}
    >
      <div className="w-full min-h-[35vh] dark:bg-slate-900 dark:bg-opacity-20 backdrop-blur border dark:border-[#ffffff1d] border-[#00000015] dark:shadow-[0_0_8px_!#fefefe05] shadow-sm rounded-lg p-3 lg:p-4 hover:shadow-md transition-all duration-300">
        <div className="w-full h-[180px] relative rounded overflow-hidden">
          <Image
            src={item.thumbnail?.url || "/assets/placeholder.png"}
            alt={item.name || "Course thumbnail"}
            fill
            className="object-cover"
          />
        </div>

        <br />
        <h1 className="font-Poppins text-[16px] text-black dark:text-[#fff] line-clamp-2">
          {item.name}
        </h1>

        <div className="w-full flex items-center justify-between pt-2">
          <Ratings rating={item.ratings} />
          <h5
            className={`text-black dark:text-white ${
              isProfile && "hidden 800px:inline"
            }`}
          >
            {item.purchased || 0} Students
          </h5>
        </div>

        <div className="w-full flex items-center justify-between pt-3">
          <div className="flex">
            <h3 className="text-black dark:text-white font-Poppins text-[16px]">
              {item.price === 0 ? "Free" : `$${item.price}`}
            </h3>
            <h5 className="pl-3 text-[14px] mt-[-2px] line-through opacity-80 text-black dark:text-white">
              {item.estimatedPrice && `$${item.estimatedPrice}`}
            </h5>
          </div>

          <div className="flex items-center gap-1 text-black dark:text-white">
            <AiOutlineUnorderedList size={20} />
            <h5 className="text-[14px]">
              {item.courseData?.length || 0} Lectures
            </h5>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
