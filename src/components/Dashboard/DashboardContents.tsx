import React, { useEffect } from "react";
import UserActivityBarChart from "./chart/GraphChart";
import UserActivityRingChart from "./chart/RingChart";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchDashboardDetails } from "../../redux/feature/Dashboard/DashboardApi";

const DashboardContents: React.FC = () => {
  const { data, loading } = useSelector((state: RootState) => state.dashboard);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDashboardDetails());
  }, [dispatch]);

  const totalUsers = data?.data?.attributes?.users ?? 0;
  const activeUsers = data?.data?.attributes?.active_users ?? 0;

  const activeUsersPercentage =
    totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : "0"; // Up to 1 decimal
  const inactiveUsersPercentage = (100 - parseFloat(activeUsersPercentage)).toFixed(1);

  const ringChartData = [parseFloat(activeUsersPercentage), parseFloat(inactiveUsersPercentage)];

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between md:w-full lg:flex-col lg:w-5/6 flex-col w-full items-start">
        <div className="flex w-full justify-center md:justify-center lg:justify-between items-center flex-wrap">
          <UserActivityBarChart
            dataLastWeek={Object.values(data?.data?.attributes?.last_week_users ?? {}).reverse()}
            dataLastMonth={[
              Object.values(data?.data?.attributes?.last_month_users ?? []).slice(0, 7),
              Object.values(data?.data?.attributes?.last_month_users ?? []).slice(7, 14),
              Object.values(data?.data?.attributes?.last_month_users ?? []).slice(14, 21),
              Object.values(data?.data?.attributes?.last_month_users ?? []).slice(21, 28),
              Object.values(data?.data?.attributes?.last_month_users ?? []).slice(28),
            ]}
          />
          <UserActivityRingChart loading={loading} value={ringChartData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardContents;
