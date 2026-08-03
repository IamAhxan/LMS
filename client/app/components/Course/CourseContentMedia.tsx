"use client";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import {
  useAddAnswerInQuestionMutation,
  useAddNewQuestionMutation,
  useAddReplyInReviewMutation,
  useAddReviewInCourseMutation,
  useGetCourseDetailsQuery,
} from "@/redux/features/courses/coursesApi";
import { styles } from "@/styles/style";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineStar,
} from "react-icons/ai";
import { BiMessage } from "react-icons/bi";
import { VscVerifiedFilled } from "react-icons/vsc";
import { format } from "timeago.js";
import socketIO from "socket.io-client";
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_URI || "http://localhost:8000";
const socketId = socketIO(ENDPOINT, {
  transports: ["websocket"],
});

type Props = {
  data: any;
  id: string;
  activeVideo: number;
  setActiveVideo: (activeVideo: number) => void;
  user: any;
  refetch: any;
};

const CourseContentMedia = ({
  data,
  id,
  activeVideo,
  setActiveVideo,
  user,
  refetch,
}: Props) => {
  if (!data || data.length === 0) return null;
  const [activeBar, setActiveBar] = useState(0);
  const [question, setQuestion] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [answer, setAnswer] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [isReviewReply, setIsReviewReply] = useState(false);
  const [reply, setReply] = useState("");
  const [reviewId, setReviewId] = useState("");

  const { data: courseData, refetch: courseRefetch } = useGetCourseDetailsQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [
    addNewQuestion,
    { isSuccess, error, isLoading: questionCreationLoading },
  ] = useAddNewQuestionMutation({});

  const [
    addAnswerInQuestion,
    {
      isSuccess: answerSuccess,
      error: answerError,
      isLoading: answerCreationLoading,
    },
  ] = useAddAnswerInQuestionMutation();

  const course = courseData?.course;

  const [
    addReviewInCourse,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInCourseMutation();

  const [
    addReplyInReview,
    {
      isSuccess: replySuccess,
      error: replyError,
      isLoading: replyCreationLoading,
    },
  ] = useAddReplyInReviewMutation();

  const isReviewExists = course?.reviews?.find(
    (item: any) => item.user._id === user._id,
  );

  const handleQuestion = () => {
    if (question.length === 0) {
      toast.error("Question can't be empty");
    } else {
      addNewQuestion({
        question,
        courseId: id,
        contentId: data[activeVideo]._id,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setQuestion("");
      refetch();
      socketId.emit("notification", {
        title: "New Question",
        message: `You have a new question for ${data[activeVideo]?.title}`,
        userId: user._id,
      });
      toast.success("Question Added Successfully");
    }
    if (answerSuccess) {
      setAnswer("");
      refetch();

      toast.success("Answer Added Successfully");
      if(user.role === "admin"){
        socketId.emit("notification", {
          title: "New Answer",
          message: `You have a new reply in your question for ${data[activeVideo]?.title}`,
          userId: user._id,
        });
      }


    }
    if (error && "data" in error) {
      const errorMessage = error.data as any;
      toast.error(errorMessage?.data?.message);
    }
    if (answerError && "data" in answerError) {
      const errorMessage = answerError.data as any;
      toast.error(errorMessage?.data?.message);
    }
    if (reviewSuccess) {
      setReview("");
      setRating(1);
      courseRefetch();
      socketId.emit("notification", {
        title: "New Review",
        message: `You have a new review for ${data[activeVideo]?.title}`,
        userId: user._id,
      });
      toast.success("Review Added Successfully");
    }
    if (reviewError && "data" in reviewError) {
      const errorMessage = reviewError?.data as any;
      toast.error(errorMessage?.data?.message);
    }
    if (replySuccess) {
      setReply("");
      setIsReviewReply(false);
      toast.success("Reply Added Successfully");
    }
    if (replyError && "data" in replyError) {
      const errorMessage = replyError?.data as any;
      toast.error(errorMessage?.data?.message);
    }
  }, [
    isSuccess,
    error,
    answerSuccess,
    answerError,
    reviewSuccess,
    reviewError,
    replySuccess,
    replyError,
  ]);

  const handleAnswerSubmit = () => {
    //  answer, courseId, contentId, questionId
    addAnswerInQuestion({
      answer,
      courseId: id,
      contentId: data[activeVideo]._id,
      questionId,
    });
  };

  const handleReviewSubmit = async () => {
    if (review.length === 0) {
      toast.error("Review can't be empty");
    } else {
      addReviewInCourse({
        review,
        rating,
        courseId: id,
      });
    }
  };

  const handleReviewReplySubmit = async () => {
    if (!replyCreationLoading && reply.length > 0) {
      addReplyInReview({
        comment: reply,
        courseId: id,
        reviewId,
      });
    }
  };

  return (
    <div className="w-[95%] 800px:w-[86%] py-4 m-auto">
      <CoursePlayer
        title={data[activeVideo]?.title}
        videoUrl={data[activeVideo]?.videoUrl}
      />
      <div className="w-full flex items-center justify-between my-3">
        <div
          className={`${styles.button} text-white !w-[110px] !min-h-[40px] !py-[unset] ${
            activeVideo === 0 && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)
          }
        >
          <AiOutlineArrowLeft className="mr-2" />
          Prev Lesson
        </div>
        <div
          className={`${styles.button} text-white !w-[110px] !min-h-[40px] !py-[unset] ${
            data.length - 1 === activeVideo && "!cursor-no-drop opacity-[.8]"
          }`}
          onClick={() =>
            setActiveVideo(
              data && data.length - 1 === activeVideo
                ? activeVideo
                : activeVideo + 1,
            )
          }
        >
          Next Lesson
          <AiOutlineArrowRight className="ml-2" />
        </div>
      </div>

      <h1 className="pt-2 text-[25px] font-[600] text-black dark:text-[white]">
        {data[activeVideo].title}
      </h1>
      <br />
      <div className="w-full p-4 flex items-center justify-between  bg-slate-100 dark:bg-slate-900  bg-opacity-20 backdrop-blur shadow-[bg-slate-700] rounded shadow-inner">
        {["Overview", "Resources", "Q&A", "Reviews"].map((text, index) => (
          <h5
            key={index}
            className={`800px:text-[20px] cursor-pointer  ${
              activeBar === index
                ? "text-red-500"
                : "text-black dark:text-white"
            }`}
            onClick={() => setActiveBar(index)}
          >
            {text}
          </h5>
        ))}
      </div>
      <br />
      {activeBar === 0 && (
        <p className="text-[18px] whitespace-pre-line mb-3 dark:text-white text-black">
          {data[activeVideo]?.description}
        </p>
      )}
      {activeBar === 1 && (
        <div>
          {data[activeVideo]?.links?.map((item: any, index: number) => (
            <div className="mb-5" key={index}>
              <h2 className="800px:text-[20px] 800px:inline-block text-black dark:text-white">
                {item.title && item.title + " :"}
              </h2>
              <a
                className="inline-block text-[#4395c4] 800px:text-[20px] 800px:pl-2"
                href={item.url}
              >
                {item.url}
              </a>
            </div>
          ))}
        </div>
      )}
      {activeBar === 2 && (
        <>
          <div className="flex w-full">
            <Image
              src={
                user?.avatar
                  ? user.avatar.url
                  : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
              }
              width={50}
              height={50}
              alt=""
              className="rounded-full w-[50px] h-[50px] object-cover "
            />
            <textarea
              name=""
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              id=""
              cols={40}
              rows={5}
              placeholder="Write your question..."
              className="outline-none bg-transparent ml-3 border border-[#ffffff57] 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${questionCreationLoading && "cursor-not-allowed"}`}
              onClick={questionCreationLoading ? () => {} : handleQuestion}
            >
              Submit
            </div>
          </div>
          <br />
          <br />
          <div className="w-full h-[1px] bg-[#ffffff3b]"></div>
          <div className="">
            <CommentReply
              data={data}
              activeVideo={activeVideo}
              answer={answer}
              setAnswer={setAnswer}
              handleAnswerSubmit={handleAnswerSubmit}
              user={user}
              setQuestionId={setQuestionId}
              answerCreationLoading={answerCreationLoading}
            />
          </div>
        </>
      )}
      {activeBar === 3 && (
        <div className="w-full  text-black dark:text-white">
          {!isReviewExists && (
            <>
              <div className="flex w-full">
                <Image
                  src={
                    user?.avatar
                      ? user.avatar.url
                      : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                  }
                  width={50}
                  height={50}
                  alt="User Avatar"
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="w-full">
                  <h5 className="pl-3 text-[20px] font-[500] dark:text-white text-black">
                    Give a Rating <span className="text-red-500">*</span>
                  </h5>

                  {/* Star Selection */}
                  <div className="flex w-full ml-2 pb-3">
                    {[1, 2, 3, 4, 5].map((i) =>
                      rating >= i ? (
                        <AiFillStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          className="mr-1 cursor-pointer"
                          color="rgb(246,186,0)"
                          size={25}
                          onClick={() => setRating(i)}
                        />
                      ),
                    )}
                  </div>

                  {/* Review Input */}
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    cols={40}
                    rows={5}
                    placeholder="Write your review..."
                    className="outline-none bg-transparent ml-3 border border-[#00000057] dark:border-[#ffffff83] text-black dark:text-white 800px:w-full p-2 rounded w-[90%] 800px:text-[18px] font-Poppins"
                  ></textarea>
                </div>
              </div>

              {/* Submit Button */}
              <div className="w-full flex justify-end">
                <button
                  disabled={reviewCreationLoading}
                  className={`${styles.button} !w-[120px] !h-[40px] text-[18px] mt-5 ${
                    reviewCreationLoading ? "cursor-not-allowed opacity-80" : ""
                  }`}
                  onClick={
                    reviewCreationLoading ? () => {} : handleReviewSubmit
                  }
                >
                  Submit
                </button>
              </div>
            </>
          )}
          <br />

          {/* Divider Line */}
          <div className="w-full my-5 border-t border-[#ffffff3b]" />

          {/* Reviews List */}
          <div className="w-full">
            {course?.reviews &&
              [...course.reviews].reverse().map((item: any, index: number) => (
                <div className="w-full my-5" key={item?._id || index}>
                  <div className="w-full flex gap-3">
                    {/* User Avatar */}
                    <Image
                      src={
                        item?.user?.avatar
                          ? item.user.avatar.url
                          : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                      }
                      width={50}
                      height={50}
                      alt="Reviewer Avatar"
                      className="rounded-full w-[50px] h-[50px] object-cover"
                    />

                    {/* Review Details */}
                    <div className="dark:text-white text-black w-full">
                      <div className="flex items-center gap-2">
                        <h5 className="text-[18px] font-[500]">
                          {item?.user?.name || "User"}
                        </h5>
                        <Ratings rating={item?.rating} />
                      </div>

                      <p className="py-1 text-[16px]">
                        {item?.comment || item?.review}
                      </p>

                      <small className="text-[#000000b8] dark:text-[#ffffff83]">
                        {item?.createdAt ? format(item.createdAt) : "Recently"}
                      </small>
                    </div>
                  </div>
                  {user?.role === "admin" && item.commentReplies.length=== 0 && (
                    <span
                      className={` ${styles.label} !ml-10 cursor-pointer`}
                      onClick={() => {
                        setIsReviewReply(true);
                        setReviewId(item._id);
                      }}
                    >
                      Add Reply
                    </span>
                  )}
                  {isReviewReply && reviewId===item._id &&(
                    <div className="w-full flex relative">
                      <input
                        type="text"
                        placeholder="Enter your reply..."
                        value={reply}
                        onChange={(e: any) => setReply(e.target.value)}
                        className="block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#fff] p-[5px] w-[95%]"
                      />
                      <button
                        type="submit"
                        className="absolute right-0 bottom-1"
                        onClick={handleReviewReplySubmit}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {item.commentReplies.map((i: any, index: number) => (
                    <div className="w-full flex 800px:ml-16 my-5">
                      <div className="w-[50px] h-[50px]">
                        <Image
                          src={
                            i?.user?.avatar
                              ? i.user.avatar.url
                              : "https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="rounded-full w-[50px] h-[50px] object-cover "
                        />
                      </div>
                      <div className="pl-2">
                        <div className="flex items-center">
                          <h5 className="text-[20px]">{item?.user?.name}</h5>{" "}
                          {item?.user?.role === "admin" && (
                            <VscVerifiedFilled className="ml-2 text-blue-500" />
                          )}
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
          <br />
        </div>
      )}
    </div>
  );
};

const CommentReply = ({
  data,
  activeVideo,
  answer,
  setAnswer,
  handleAnswerSubmit,
  user,
  setQuestionId,
  answerCreationLoading,
}: any) => {
  return (
    <>
      <div className="w-full my-3">
        {data[activeVideo]?.questions?.map((item: any, index: any) => (
          <CommentItem
            key={index}
            data={data}
            activeVideo={activeVideo}
            item={item}
            index={index}
            answer={answer}
            setAnswer={setAnswer}
            setQuestionId={setQuestionId}
            handleAnswerSubmit={handleAnswerSubmit}
            answerCreationLoading={answerCreationLoading}
          />
        ))}
      </div>
    </>
  );
};

const CommentItem = ({
  data,
  item,
  index,
  answer,
  setAnswer,
  setQuestionId,
  handleAnswerSubmit,
  answerCreationLoading,
}: any) => {
  const [replyActive, setReplyActive] = useState(false);
  return (
    <>
      <div className="my-4">
        <div className="flex mb-2">
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
          <div className="pl-3 dark:text-white text-black">
            <h5 className="text-[20px]">{item?.user?.name}</h5>
            <p>{item?.question}</p>
            <small className="text-[#000000b8] dark:text-[#ffffff83]">
              {!item.createdAt ? " " : format(item?.createdAt)} •
            </small>
          </div>
        </div>

        <div className="w-full flex">
          <span
            className="800px:pl-16text-[#000000b8] dark:text-[#ffffff83] cursor-pointer mr-2"
            onClick={() => {
              (setReplyActive(!replyActive), setQuestionId(item._id));
            }}
          >
            {!replyActive
              ? item.questionReplies.length !== 0
                ? "AllReplies"
                : "Add Reply"
              : "Hide Replies"}
          </span>
          <BiMessage
            size={20}
            className=" text-[#000000b8] dark:text-[#ffffff83] cursor-pointer"
          />
          <span className="pl-1 mt-[-4px] cursor-pointer text-[#000000b8] dark:text-[#ffffff83]">
            {item.questionReplies.length}
          </span>
        </div>
        {replyActive && (
          <>
            {item.questionReplies.map((item: any) => (
              <div className="w-full flex 800px:ml-16 my-5 text-black dark:text-white">
                <div>
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
                <div className="pl-3">
                  <div className="flex items-center">
                    <h5 className="text-[20px]">{item?.user?.name}</h5>{" "}
                    {item?.user?.role === "admin" && (
                      <VscVerifiedFilled className="ml-2 text-blue-500" />
                    )}
                  </div>
                  <p>{item.answer}</p>
                  <small className="text-[#000000b8] dark:text-[#ffffff83]">
                    {format(item.createdAt)} •
                  </small>
                </div>
              </div>
            ))}

            <>
              <div className="w-full flex relative text-black dark:text-white">
                <input
                  type="text"
                  placeholder="Enter your reply..."
                  value={answer}
                  onChange={(e: any) => setAnswer(e.target.value)}
                  className={`text-black dark:text-white block 800px:ml-12 mt-2 outline-none bg-transparent border-b border-[#00000027] dark:border-[#fff] p-[5px] w-[95%] ${answerCreationLoading || (answer === "" && "cursor-not-allowed")}`}
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-1"
                  onClick={handleAnswerSubmit}
                  disabled={answer === "" || answerCreationLoading}
                >
                  Submit
                </button>
              </div>
              <br />
            </>
          </>
        )}
      </div>
    </>
  );
};

export default CourseContentMedia;
