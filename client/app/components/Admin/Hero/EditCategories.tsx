import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { FC, useEffect, useState } from "react";
import { styles } from "../../../../styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";
import Loader from "../../Loader/Loader";

type Props = {};

const EditCategories: FC<Props> = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isLoading: editLoading, isSuccess, error }] =
    useEditLayoutMutation();

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.categories) {
      setCategories(data.layout.categories);
    }
    if (isSuccess) {
      refetch();
      toast.success("Categories updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message || "Failed to update categories");
      }
    }
  }, [data, isSuccess, error, refetch]);

  const handleCategoryChange = (id: any, value: string) => {
    setCategories((prevCategories) =>
      prevCategories.map((c) => (c._id === id ? { ...c, title: value } : c))
    );
  };

  const newCategoryHandler = () => {
    if (categories[categories.length - 1]?.title === "") {
      toast.error("Category title cannot be empty!");
    } else {
      setCategories([
        ...categories,
        {
          _id: Date.now().toString(),
          title: "",
        },
      ]);
    }
  };

  const handleDeleteCategory = (id: any) => {
    setCategories((prevCategories) =>
      prevCategories.filter((c) => c._id !== id)
    );
  };

  const areCategoriesUnchanged = (original: any[], updated: any[]) => {
    return JSON.stringify(original) === JSON.stringify(updated);
  };

  const isAnyEmpty = (categoryList: any[]) => {
    return categoryList.some((c) => c.title.trim() === "");
  };

  const handleEdit = async () => {
    if (isAnyEmpty(categories)) {
      toast.error("Please fill in all category titles before saving!");
      return;
    }

    if (!areCategoriesUnchanged(data?.layout?.categories, categories)) {
      await editLayout({
        type: "Categories",
        categories: categories.map(({ title }) => ({ title })),
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>All Categories</h1>
          <br />
          <div className="w-[90%] 800px:w-[60%] m-auto flex flex-col items-center">
            {categories &&
              categories.map((item: any) => (
                <div key={item._id} className="p-3 w-full">
                  <div className="flex items-center w-full justify-between">
                    <input
                      className={`${styles.input} !w-[80%] !text-[20px] !bg-transparent !border-b !border-gray-300 dark:!border-gray-700 outline-none focus:!border-[#42d383] transition-all`}
                      value={item.title}
                      onChange={(e) =>
                        handleCategoryChange(item._id, e.target.value)
                      }
                      placeholder="Enter category title..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[22px] cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => handleDeleteCategory(item._id)}
                    />
                  </div>
                </div>
              ))}
            <br />
            <br />
            <div className="w-full flex justify-center">
              <IoMdAddCircleOutline
                className="dark:text-white text-black text-[30px] cursor-pointer hover:opacity-80"
                onClick={newCategoryHandler}
              />
            </div>
          </div>

          {/* Floating Save Button */}
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
              areCategoriesUnchanged(data?.layout?.categories, categories) ||
              isAnyEmpty(categories)
                ? "!cursor-not-allowed"
                : "!cursor-pointer !bg-[#42d383]"
            } !rounded absolute bottom-12 right-12`}
            onClick={
              areCategoriesUnchanged(data?.layout?.categories, categories) ||
              isAnyEmpty(categories)
                ? () => null
                : handleEdit
            }
          >
            {editLoading ? "Saving..." : "Save"}
          </div>
        </div>
      )}
    </>
  );
};

export default EditCategories;