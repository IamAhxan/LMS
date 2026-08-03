import { Document, Model } from "mongoose";
import type { IUser } from "./user.model.js";
interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies?: IComment[];
}
interface IReview extends Document {
    user: IUser;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}
interface ILink extends Document {
    title: string;
    url: string;
}
interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}
interface ICourse extends Document {
    name: string;
    description?: string;
    categories: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: {
        title: string;
    }[];
    prerequisites: {
        title: string;
    }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}
declare const CourseModel: Model<ICourse>;
export default CourseModel;
//# sourceMappingURL=course.model.d.ts.map