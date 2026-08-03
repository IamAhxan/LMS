import { Document, Model } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{
        courseId: string;
    }>;
    comparePassword(password: string): Promise<boolean>;
    SignAccessToken(): string;
    SignRefreshToken(): string;
}
declare const userModel: Model<IUser>;
export default userModel;
//# sourceMappingURL=user.model.d.ts.map