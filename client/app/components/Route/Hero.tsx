import Image from 'next/image';
import Link from 'next/link';
import React, { FC } from 'react'
import { BiSearch } from 'react-icons/bi';



const Hero: FC = () => {
  return (
    // Added 'relative' and 'overflow-hidden' to ensure the background animation stays contained
    <div className='w-full 1000px:flex items-center relative min-h-screen overflow-hidden '>

      {/* 1. Background Animation Circle */}
      {/* Positioned absolute; z-0 to keep it behind content */}
      <div className="absolute left-[6%] top-[40%] 1000px:top-[100px] 1100px:right-[-52px] 1100px:top-[100px] 1500px:h-[600px] 1500px:w-[600px] 1500px:top-[10%] 1100px:h-[600px] 1100px:w-[600px] h-[40vh] w-[40vh] hero_animation rounded-full z-0"></div>

      {/* 2. Image Container (Left Side) */}
      {/* 45% width provides better balance for the image at 1100px */}
      <div className="1000px:w-[50%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
        <Image
          src="/assets/banner-img-1.png"
          alt="Online Learning Banner"
          width={1200}
          height={800}
          className='object-contain 1100px:max-w-[90%] w-[85%] 1500px:max-w-[85%] h-auto'
          priority
        />
      </div>

      {/* 3. Text Content Container (Right Side) */}
      {/* '1000px:items-start' and '1000px:pl-10' remove the fake margin look */}
      <div className="1000px:w-[50%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left mt-[80px] 1000px:mt-0 1000px:pl-10 z-10 px-5 1000px:px-0">
        
        {/* Heading: Removed max-width that caused the alignment gap */}
        <h2 className='1000px:pr-50 1500px:pr-0 dark:text-white text-[#000000c7] text-[32px] w-full 1000px:text-[55px] 1500px:text-[60px] font-[600] font-Josefin py-2 1000px:leading-[65px] 1500px:leading-[75px]'>
          Improve Your Online Learning Experience Better Instantly
        </h2>

        {/* Paragraph: Controlled width for readability at high resolutions */}
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] mt-4 1100px:w-[85%] 1500px:w-[60%]">
          We have 40k+ Online courses & 500k+ Online registered students. Find your desired Courses from them.
        </p>

        {/* Search Input: Fixed the dark:placeholder typo */}
        <div className="1500px:w-[60%] 1100px:w-[85%] w-full h-[50px] bg-transparent relative mt-8">
          <input 
            type="search" 
            placeholder='Search Courses' 
            className='bg-transparent border border-[#0000002b] dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-3 w-full h-full outline-none text-[#000000] dark:text-[#ffffffe6] text-[18px] font-[500] font-Josefin' 
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className='text-white' size={25} />
          </div>
        </div>

        {/* Social Proof / Avatars: Fixed negative margins and text=[crimson] typo */}
        <div className="1500px:w-[60%] 1100px:w-[85%] w-full flex items-center mt-10 justify-center 1000px:justify-start">
          <div className="flex items-center">
            <Image
              src="/assets/client-1.jpg"
              alt='Client'
              className='rounded-full border-2 border-white dark:border-[#111]'
              width={45}
              height={45}
            />
            <Image
              src="/assets/client-2.jpg"
              alt='Client'
              className='rounded-full ml-[-15px] border-2 border-white dark:border-[#111]'
              width={45}
              height={45}
            />
            <Image
              src="/assets/client-3.jpg"
              alt='Client'
              className='rounded-full ml-[-15px] border-2 border-white dark:border-[#111]'
              width={45}
              height={45}
            />
          </div>
          <p className='font-Josefin dark:text-[#edfff4] text-[#000000b3] pl-3 text-[16px] font-[600]'>
            500K+ People already trusted us.{" "}
            <Link href="/courses" className="dark:text-[#46e256] text-[crimson] hover:underline transition-all">
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Hero