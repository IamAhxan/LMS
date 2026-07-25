import React, { FC } from "react";
import Image from "next/image";
import Ratings from "@/app/utils/Ratings";

type Props = {
  item?: any;
};

const dummyReview = {
  name: "Genevieve Curran",
  avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  profession: "Full Stack Developer | Canada",
  comment:
    "The courses on this platform completely transformed my learning journey. The practical hands-on projects helped me land my dream role!",
  rating: 5,
};

const ReviewCard: FC<Props> = ({ item = dummyReview }) => {
  const avatarSrc =
    item?.avatar && typeof item.avatar === "string" && item.avatar.trim() !== ""
      ? item.avatar
      : dummyReview.avatar;

  return (
    <div className="w-full h-max relative z-10 dark:bg-slate-900 dark:bg-opacity-[0.20] border border-[#00000028] dark:border-[#ffffff1d] backdrop-blur shadow-[bg-slate-700] rounded-lg p-3 shadow-inner">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={avatarSrc}
            alt={item?.name || dummyReview.name}
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div>
            <h5 className="text-[18px] font-Poppins text-black dark:text-white">
              {item?.name || dummyReview.name}
            </h5>
            <p className="text-[14px] text-[#000000b2] dark:text-[#ffffffab] font-Poppins">
              {item?.profession || dummyReview.profession}
            </p>
          </div>
        </div>
        <Ratings rating={item?.rating ?? dummyReview.rating} />
      </div>

      <p className="pt-3 font-Poppins text-black dark:text-white text-[15px] leading-6">
        {item?.comment || dummyReview.comment}
      </p>
    </div>
  );
};

export default ReviewCard;