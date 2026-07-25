import { styles } from "@/styles/style";
import Image from "next/image";
import ReviewCard from "../../components/Review/ReviewCard"
import React from "react";

type Props = {};

const Reviews = (props: Props) => {
  const reviews = [
    {
      name: "Genevieve Curran",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      profession: "Full Stack Developer | Canada",
      comment:
        "The courses on this platform completely transformed my learning journey. The practical hands-on projects helped me land my dream role!",
      rating: 5,
    },
    {
      name: "Mark Antony",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      profession: "UI/UX Designer | USA",
      comment:
        "Incredible content quality and step-by-step explanations. Highly recommended for anyone looking to upskill efficiently.",
      rating: 5,
    },
    {
      name: "Sophia Chen",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      profession: "Software Engineer | UK",
      comment:
        "The community support and instructor responsiveness are unmatched. Whenever I got stuck, I received help almost instantly.",
      rating: 4.5,
    },
    {
      name: "Alex Rivera",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      profession: "Frontend Developer | Spain",
      comment:
        "Clear, structured, and up-to-date with modern tech stacks. Best investment I've made for my tech career.",
      rating: 5,
    },
    {
      name: "David Kim",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      profession: "Backend Specialist | South Korea",
      comment:
        "The real-world architecture examples gave me deep insight into system design. Essential knowledge for modern dev roles.",
      rating: 5,
    },
    {
      name: "Emma Watson",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      profession: "Data Analyst | Australia",
      comment:
        "Well-paced modules with great exercises. Perfect for balancing full-time work while learning new frameworks.",
      rating: 4.5,
    },
  ];
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[50%]">
          <Image
            src={require("../../../public/assets/banner-img-1.png")}
            alt="business"
            width={700}
            height={700}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are <span className="text-gradient">Our Strength</span>{" "}
            <br /> See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque unde
            voluptatum dignissimos, nulla perferendis dolorem voluptate nemo
            possimus magni deleniti natus accusamus officiis quasi nihil
            commodi, praesentium quidem, quis doloribus?
          </p>
        </div>

        <br />
        <br />




      </div>
     <div className="columns-1 md:columns-2 gap-[25px] mb-12 [&>*]:mb-[25px] [&>*]:break-inside-avoid">
  {reviews &&
    reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
</div>
    </div>
  );
};

export default Reviews;
