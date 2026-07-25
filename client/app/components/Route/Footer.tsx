import React from "react";
import Link from "next/link";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="w-full border-t border-[#0000000e] dark:border-[#ffffff0e] bg-slate-900 dark:bg-opacity-20 backdrop-blur">
      <div className="w-[95%] 800px:w-[85%] m-auto py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1: About */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white font-Poppins">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white font-Poppins">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/course-dashboard"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  Course Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white font-Poppins">
              Social Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://youtube.com"
                  target="_blank"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  YouTube
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  className="text-base text-black dark:text-gray-300 hover:text-blue-500 font-Poppins"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-semibold text-black dark:text-white font-Poppins">
              Contact Info
            </h3>
            <p className="text-base text-black dark:text-gray-300 font-Poppins">
              Call Us: 1-800-123-4567
            </p>
            <p className="text-base text-black dark:text-gray-300 font-Poppins">
              Address: +7011 Park Avenue, New York, NY
            </p>
            <p className="text-base text-black dark:text-gray-300 font-Poppins">
              Mail Us: support@lmsplatform.com
            </p>
          </div>
        </div>

        <br />
        <br />

        <p className="text-center text-black dark:text-white font-Poppins text-[14px]">
          Copyright © {new Date().getFullYear()} LMS Platform | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;