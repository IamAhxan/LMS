import mongoose, {Document, Model, Schema} from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const emailRegexPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar:{
        public_id: string;
        url: string;
    }
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword(password: string): Promise<boolean>;
    SignAccessToken (): string;
    SignRefreshToken (): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate:{
            validator: function(value: string) {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email address"
        },
        unique: true,
        },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String
        }
    ]
}, {timestamps: true});

// Hash the Password before saving the user
userSchema.pre<IUser>("save", async function(next) {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Sign Access Token
userSchema.methods.SignAccessToken = function() {
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || " ", {
        expiresIn: "5m"
    });
}

// Sign Refresh Token
userSchema.methods.SignRefreshToken = function() {
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN  || " ", {
        expiresIn: "3d"
    });
}

// Compare Password
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

const userModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default userModel;