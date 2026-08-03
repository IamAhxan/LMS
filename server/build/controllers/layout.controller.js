import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import LayoutModel from "../models/layout.model.js";
import cloudinary from "cloudinary";
// Create Layout
export const createLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`${type} already exists`, 400));
        }
        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await LayoutModel.create(banner);
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item) => ({
                question: item.question,
                answer: item.answer,
            })));
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => ({
                title: item.title,
            })));
            await LayoutModel.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Edit layout (Upsert enabled so missing docs auto-create)
export const editLayout = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.body;
        if (type === "Banner") {
            const bannerData = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            const isNewImage = image && !image.startsWith("https");
            let imageCloud = {
                public_id: bannerData?.banner?.image?.public_id || "",
                url: bannerData?.banner?.image?.url || "",
            };
            if (isNewImage) {
                if (bannerData?.banner?.image?.public_id) {
                    await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
                }
                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });
                imageCloud = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            const banner = {
                image: imageCloud,
                title,
                subTitle,
            };
            await LayoutModel.findOneAndUpdate({ type: "Banner" }, { type: "Banner", banner }, { upsert: true, new: true });
        }
        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item) => ({
                question: item.question,
                answer: item.answer,
            })));
            // Uses findOneAndUpdate with upsert so it creates document if missing
            await LayoutModel.findOneAndUpdate({ type: "FAQ" }, { type: "FAQ", faq: faqItems }, { upsert: true, new: true });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item) => ({
                title: item.title,
            })));
            await LayoutModel.findOneAndUpdate({ type: "Categories" }, { type: "Categories", categories: categoriesItems }, { upsert: true, new: true });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Get layout by type
// Get layout by type
// Get layout by type
export const getLayoutByType = CatchAsyncError(async (req, res, next) => {
    try {
        const { type } = req.params;
        // Passing RegExp directly avoids the strict $regex query casting type mismatch
        const layout = await LayoutModel.find({
            type: { $regex: `^${type}$`, $options: "i" },
        });
        res.status(200).json({
            success: true,
            layout,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//# sourceMappingURL=layout.controller.js.map