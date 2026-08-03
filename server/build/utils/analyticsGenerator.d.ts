import { Document, Model } from "mongoose";
interface MonthData {
    month: string;
    count: number;
}
export declare function generateLast12MonthsData<T extends Document>(model: Model<T>): Promise<{
    last12Months: MonthData[];
}>;
export {};
//# sourceMappingURL=analyticsGenerator.d.ts.map