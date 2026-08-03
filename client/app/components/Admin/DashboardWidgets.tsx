import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "./../../components/Admin/Analytics/UsersAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "./Analytics/OrdersAnalytics";
import AllInvoices from "../../components/Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value && value > 0 ? Math.min(value, 100) : 0}
        size={45}
        color={value && value > 0 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [userComparePercentage, setUserComparePercentage] = useState<any>();
  const [orderComparePercentage, setOrderComparePercentage] = useState<any>();

  const { data: usersData, isLoading: usersLoading } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersAnalyticsQuery({});

  // 1. User Analytics Logic
  useEffect(() => {
    if (usersData) {
      const userMonths =
        usersData?.users?.last12Months ||
        usersData?.last12Months ||
        [];

      console.log("User 12-Month Buckets:", userMonths);

      if (userMonths.length > 0) {
        // Calculate total count across all 12 months
        const totalUsers = userMonths.reduce((acc: number, item: any) => acc + (item.count || 0), 0);

        if (userMonths.length >= 2) {
          const lastTwo = userMonths.slice(-2);
          const previousMonth = lastTwo[0]?.count ?? 0;
          const currentMonth = lastTwo[1]?.count ?? 0;

          const percentChange =
            previousMonth === 0
              ? currentMonth > 0 ? 100 : 0
              : ((currentMonth - previousMonth) / previousMonth) * 100;

          setUserComparePercentage({
            // Uses current month count, or falls back to total count if current month is 0
            displayCount: currentMonth > 0 ? currentMonth : totalUsers,
            percentChange,
          });
        } else {
          setUserComparePercentage({ displayCount: totalUsers, percentChange: 0 });
        }
      }
    }
  }, [usersData]);

  // 2. Order Analytics Logic
  useEffect(() => {
    if (ordersData) {
      const orderMonths =
        ordersData?.orders?.last12Months ||
        ordersData?.last12Months ||
        [];

      console.log("Order 12-Month Buckets:", orderMonths);

      if (orderMonths.length > 0) {
        // Calculate total count across all 12 months
        const totalOrders = orderMonths.reduce((acc: number, item: any) => acc + (item.count || 0), 0);

        if (orderMonths.length >= 2) {
          const lastTwo = orderMonths.slice(-2);
          const previousMonth = lastTwo[0]?.count ?? 0;
          const currentMonth = lastTwo[1]?.count ?? 0;

          const percentChange =
            previousMonth === 0
              ? currentMonth > 0 ? 100 : 0
              : ((currentMonth - previousMonth) / previousMonth) * 100;

          setOrderComparePercentage({
            // Uses current month count, or falls back to total count if current month is 0
            displayCount: currentMonth > 0 ? currentMonth : totalOrders,
            percentChange,
          });
        } else {
          setOrderComparePercentage({ displayCount: totalOrders, percentChange: 0 });
        }
      }
    }
  }, [ordersData]);

  const formatPercentage = (percent: number | undefined) => {
    if (percent === undefined || isNaN(percent)) return "0%";
    const formatted = Math.round(percent);
    return formatted >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  return (
    <div className="mt-[30px] min-h-screen">
      {/* Top Section */}
      <div className="grid grid-cols-12 gap-5 p-5">
        <div className="col-span-8">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="col-span-4 pt-[50px]">
          {/* Sales / Orders Widget */}
          <div className="w-full dark:bg-[#111C43] rounded-sm shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                  {ordersLoading ? "..." : orderComparePercentage?.displayCount ?? 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    orderComparePercentage?.percentChange > 0
                      ? orderComparePercentage?.percentChange
                      : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4 dark:text-[#fff] text-black">
                  {formatPercentage(orderComparePercentage?.percentChange)}
                </h5>
              </div>
            </div>
          </div>

          {/* New Users Widget */}
          <div className="w-full dark:bg-[#111C43] rounded-sm shadow my-8 p-5">
            <div className="flex items-center justify-between">
              <div>
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                  {usersLoading ? "..." : userComparePercentage?.displayCount ?? 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel
                  value={
                    userComparePercentage?.percentChange > 0
                      ? userComparePercentage?.percentChange
                      : 0
                  }
                  open={open}
                />
                <h5 className="text-center pt-4 dark:text-[#fff] text-black">
                  {formatPercentage(userComparePercentage?.percentChange)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-12 gap-5 p-5 mt-[-20px]">
        <div className="col-span-8 dark:bg-[#111c43] h-[40vh] shadow-sm rounded-sm">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="col-span-4">
          <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;