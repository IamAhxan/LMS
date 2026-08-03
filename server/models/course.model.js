import mongoose, { Document, Model, Schema } from "mongoose";
const reviewSchema = new Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0,
    },
    comment: String,
    commentReplies: [Object],
}, { timestamps: true });
const LinkSchema = new Schema({
    title: String,
    url: String,
});
const commentSchema = new Schema({
    user: Object,
    question: String,
    questionReplies: [Object],
}, { timestamps: true });
const courseDataSchema = new Schema({
    videoUrl: String,
    videoThumbnail: Object,
    videoSection: String,
    title: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [LinkSchema],
    suggestion: String,
    questions: [commentSchema],
});
const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    categories: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [
        {
            title: String,
        },
    ],
    prerequisites: [
        {
            title: String,
        },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
});
const CourseModel = mongoose.model("Course", courseSchema);
export default CourseModel;
//# sourceMappingURL=course.model.js.map