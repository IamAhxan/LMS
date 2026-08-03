import { Document } from "mongoose";
interface FaqItem extends Document {
    question: string;
    answer: string;
}
interface Category extends Document {
    title: string;
}
interface BannerImage extends Document {
    public_id: string;
    url: string;
}
interface Layout extends Document {
    type: String;
    faq: FaqItem[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    };
}
declare const LayoutModel: import("mongoose").Model<Layout, {}, {}, {}, Document<unknown, {}, Layout, {}, import("mongoose").DefaultSchemaOptions> & Layout & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Layout>;
export default LayoutModel;
//# sourceMappingURL=layout.model.d.ts.map