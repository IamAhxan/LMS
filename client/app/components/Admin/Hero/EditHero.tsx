import { useEditLayoutMutation, useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { styles } from "../../../../styles/style";
import toast from "react-hot-toast";

type Props = {};

const EditHero: FC<Props> = (props: Props) => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const { data, refetch } = useGetHeroDataQuery("Banner", {
    refetchOnMountOrArgChange: true
  });

  const [editLayout, {isLoading, isSuccess, error}] = useEditLayoutMutation();

  useEffect(() => {
    if (data) {
      setTitle(data?.layout?.banner?.title || "");
      setSubTitle(data?.layout?.banner?.subTitle || "");
      setImage(data?.layout?.banner?.image?.url || "");
    }
    if(isSuccess){
      refetch()
      toast.success("Hero updated successfully")
    }
if (error && "data" in error) {
  const errorData = error as any;
  toast.error(errorData?.data?.message || "Failed to update Hero");
}
  }, [data, isSuccess, error]);

  const handleUpdate = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (reader.readyState === 2) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
   await editLayout({
    type: "Banner",
    image,
    title,
    subTitle
   })
  };

  return (
    <div className="w-full 1000px:flex items-center min-h-screen relative pt-[80px]">
      {/* Left Side: Hero Image inside Blue Circle */}
      <div className="1000px:w-[40%] flex items-center justify-center relative">
        <div className="relative 1500px:h-[600px] 1500px:w-[600px] 1100px:h-[500px] 1100px:w-[500px] h-[400px] w-[400px] hero_animation rounded-full flex items-center justify-center">
          <div className="relative flex items-center justify-center w-[85%] h-[85%]">
            <img
              src={image}
              alt="Hero Banner"
              className="object-contain max-w-full max-h-full z-[10]"
            />
            <input
              type="file"
              name=""
              id="banner"
              accept="image/*"
              onChange={handleUpdate}
              className="hidden"
            />
            <label htmlFor="banner" className="absolute bottom-2 right-2 z-20">
              <AiOutlineCamera className="dark:text-white text-black text-[22px] cursor-pointer" />
            </label>
          </div>
        </div>
      </div>

      {/* Right Side: Title, Subtitle, and Save Button */}
      <div className="1000px:w-[60%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left px-5">
        <textarea
          className="dark:text-white resize-none text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[50px] 1500px:text-[60px] font-[600] bg-transparent outline-none border-none"
          placeholder="Improve Your Online Learning Experience Better Instantly"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={3}
        />
        <br />
        <textarea
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          placeholder="We have 40k+ Online courses & 500K+ Online registered student. Find your desired Courses from them."
          className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[75%] 1100px:!w-[85%] w-full bg-transparent resize-none px-3 outline-none border-none"
          rows={3}
        />
        <br />
        <br />
        <div
          className={`${
            styles.button
          } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
            data?.layout?.banner?.title !== title ||
            data?.layout?.banner?.subTitle !== subTitle ||
            data?.layout?.banner?.image?.url !== image
              ? "!cursor-pointer !bg-[#42d383]"
              : "!cursor-not-allowed"
          } !rounded absolute bottom-12 right-12`}
          onClick={
            data?.layout?.banner?.title !== title ||
            data?.layout?.banner?.subTitle !== subTitle ||
            data?.layout?.banner?.image?.url !== image
              ? handleEdit
              : () => null
          }
        >
          Save
        </div>
      </div>
    </div>
  );
};

export default EditHero;