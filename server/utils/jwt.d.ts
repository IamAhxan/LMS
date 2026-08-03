import type { Response } from "express";
import type { IUser } from "../models/user.model.js";
interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none" | undefined;
    secure?: boolean;
}
export declare const accessTokenOptions: ITokenOptions;
export declare const refreshTokenOptions: ITokenOptions;
export declare const sendToken: (user: IUser, res: Response, statusCode: number) => void;
export {};
//# sourceMappingURL=jwt.d.ts.map