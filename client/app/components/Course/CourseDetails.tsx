"use client";

import React, { useEffect, useState } from "react";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import { format } from "timeago.js";
import { IoCheckmarkDoneOutline, IoCloseOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Link from "next/link";
import CourseContentList from "../Course/CourseContentList";
import { useGetCourseDetailsQuery } from "@/redux/features/courses/coursesApi";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../Payment/CheckOutForm";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";

type Props = {
  data: any;
  clientSecret?: string;
  stripePromise?: any;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
};

const CourseDetails = ({
  data,
  clientSecret,
  stripePromise,
  setOpen: openAuthModel,
  setRoute,
}: Props) => {
  const { data: userData, isLoading } = useLoadUserQuery(undefined, {});
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
   setUser(userData?.user);
  }, [userData]);


  const discountPercentage =
    data?.estimatedPrice && data?.price
      ? ((data.estimatedPrice - data.price) / data.estimatedPrice) * 100
      : 0;

  const discountPercentagePrice = discountPercentage.toFixed(0);

  const isPurchased =
    user && user?.courses?.some((item: any) => item.courseId === data?._id);

  const handleOrder = (e: any) => {
    if (user) {
      // Logic for initiating payment/order modal
      console.log("Processing order...");
      setOpen(true);
    } else {
      setRoute("Login");
      openAuthModel(true);
    }
  };

  return (
    <div>
      <div className="w-[90%] 800px:w-[90%] m-auto py-5">
        <div className="w-full flex flex-col-reverse 800px:flex-row gap-8">
          {/* Left Main Content Column */}
          <div className="w-full 800px:w-[65%] 800px:pr-5">
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              {data?.name}
            </h1>

            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center">
                <Ratings rating={data?.ratings} />
                <h5 className="text-black dark:text-white ml-2">
                  {data?.reviews?.length || 0} Reviews
                </h5>
              </div>
              <h5 className="text-black dark:text-white">
                {data?.purchased || 0} Students
              </h5>
            </div>

            <br />
            {/* Learning Objectives */}
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What you&apos;ll learn from this course?
            </h1>
            <div>
              {data?.benefits?.map((item: any, index: number) => (
                <div
                  className="w-full flex 800px:items-center py-2"
                  key={index}
                >
                  <div className="w-[15px] mr-1">
                    <IoCheckmarkDoneOutline
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </div>
                  <p className="pl-2 text-black dark:text-white">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            <br />
            {/* Course Prerequisites */}
            <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
              What are the prerequisites for starting this course?
            </h1>
            {data?.prerequisites?.map((item: any, index: number) => (
              <div className="w-full flex 800px:items-center py-2" key={index}>
                <div className="w-[15px] mr-1">
                  <IoCheckmarkDoneOutline
                    size={20}
                    className="text-black dark:text-white"
                  />
                </div>
                <p className="pl-2 text-black dark:text-white">{item.title}</p>
              </div>
            ))}

            <br />
            <br />

            <div>
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Overview
              </h1>
              <CourseContentList data={data?.courseData} />
            </div>
            <br />
            <br />

            {/* Course Details Description */}
            <div className="w-full">
              <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                Course Details
              </h1>
              <p className="text-[18px] mt-[20px] whitespace-pre-line w-full overflow-hidden text-black dark:text-white">
                {data?.description}
              </p>
            </div>

            <br />
            <br />
            {/* Ratings & Reviews Breakdown */}
            <div className="w-full">
              <div className="800px:flex items-center gap-2">
                <Ratings rating={data?.ratings} />
                <h5 className="text-[25px] font-Poppins text-black dark:text-white">
                  {Number.isInteger(data?.ratings)
                    ? data?.ratings?.toFixed(1)
                    : data?.ratings?.toFixed(2)}{" "}
                  Course Rating • {data?.reviews?.length || 0} Reviews
                </h5>
              </div>
              <br />

              {/* Reviews List */}
              {data?.reviews &&
                [...data.reviews].reverse().map((item: any, index: number) => (
                  <div className="w-full pb-4" key={index}>
                    <div className="flex gap-3">
                      <div className="">
                        <Image
                          src={
                            item?.user?.avatar
                              ? item.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="rounded-full w-[50px] h-[50px] object-cover "
                        />
                      </div>

                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h5 className="text-[18px] font-semibold text-black dark:text-white">
                              {item?.user?.name}
                            </h5>
                            <Ratings rating={item?.rating} />
                          </div>
                        </div>
                        <p className="text-black dark:text-white mt-1">
                          {item?.comment}
                        </p>
                        <small className="text-[#000000d1] dark:text-[#ffffff83]">
                          {format(item?.createdAt)} •
                        </small>
                      </div>
                    </div>
                    {item.commentReplies.map((i: any, index: number) => (
                      <div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white">
                        <div className="w-[50px] h-[50px]">
                          <Image
                            src={
                              i.user.avatar
                                ? i.user.avatar.url
                                : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                            }
                            width={50}
                            height={50}
                            alt=""
                            className="w-[50px] h-[50px] rounded-full object-cover"
                          />
                        </div>
                        <div className="pl-2">
                          <div className="flex items-center">
                            <h5 className="text-[20px]">{i.user.name}</h5>{" "}
                            <VscVerifiedFilled className="text-[#0095F6] ml-2 text-[20px]" />
                          </div>
                          <p>{i.comment}</p>
                          <small className="text-[#ffffff83]">
                            {format(i.createdAt)} •
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Right Sticky Sidebar Column */}
          <div className="w-full 800px:w-[35%] relative">
            <div className="sticky top-[100px] left-0 z-50 w-full">
              <CoursePlayer videoUrl={data?.demoUrl} title={data?.title} />

              <div className="flex items-center pt-3">
                <h1 className="text-[25px] text-black dark:text-white font-semibold">
                  {data?.price === 0 ? "Free" : `${data?.price}$`}
                </h1>
                <h5 className="pl-3 text-[20px] line-through opacity-80 text-black dark:text-white">
                  {data?.estimatedPrice}$
                </h5>
                <h4 className="pl-5 text-[22px] text-black dark:text-white font-medium">
                  {discountPercentagePrice}% Off
                </h4>
              </div>

              {/* Purchase / Enter Course Button */}
              <div className="mt-5">
                {isPurchased ? (
                  <Link
                    className="w-full flex justify-center items-center py-3 px-6 bg-[#37a39a] text-white font-Poppins font-semibold rounded-full cursor-pointer hover:bg-[#2b827a] transition-all"
                    href={`/course-access/${data?._id}`}
                  >
                    Enter Course
                  </Link>
                ) : (
                  <button
                    disabled={isLoading}
                    className="w-full py-3 px-6 bg-[#e53935] text-white font-Poppins font-semibold rounded-full cursor-pointer hover:bg-[#c62828] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleOrder}
                  >
                    Buy Now {data?.price}$
                  </button>
                )}
              </div>

              {/* Extras List */}
              <div className="mt-6">
                <p className="pb-1 text-black dark:text-white font-medium">
                  • Source code included
                </p>
                <p className="pb-1 text-black dark:text-white font-medium">
                  • Full lifetime access
                </p>
                <p className="pb-1 text-black dark:text-white font-medium">
                  • Certificate of completion
                </p>
                <p className="pb-3 text-black dark:text-white font-medium">
                  • Premium support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <>
        {open && (
          <div className="w-full h-screen bg-[#00000036] fixed top-0 left-0 z-50 flex items-center justify-center">
            <div className="w-[500px] min-h-[500px] bg-white rounded-xl shadow p-3">
              <div className="w-full flex justify-end">
                <IoCloseOutline
                  size={40}
                  className="text-black cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="w-full">
                {stripePromise && clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm setOpen={setOpen} data={data} user={user} />
                  </Elements>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default CourseDetails;