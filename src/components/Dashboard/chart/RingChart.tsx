import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import Skeleton from '@mui/material/Skeleton';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    value: number[];
    loading: boolean;  // Added loading state prop
};

const UserActivityRingChart: React.FC<Props> = ({ value, loading }) => {
    const data = {
        datasets: [
            {
                data: value,
                backgroundColor: ["#514E6D", "#A3AED0"],
                hoverBackgroundColor: ["#3E5481", "#C5C7D0"],
                borderWidth: 0,
                cutout: "75%",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    // Customizing the label in the tooltip
                    label: function (context: any) {
                        // Get the index of the dataset
                        const index = context.dataIndex;
                        const value = context.raw;

                        // Return a custom label
                        if (index === 0) {
                            return `Active Users: ${value}%`;
                        } else if (index === 1) {
                            return `Inactive Users: ${value}%`;
                        }
                        return '';
                    },
                },
            },
        },
    };

    return (
        <div className="w-full md:mt-5 lg:mt-0 mt-5 p-6 bg-white dark:bg-gray-800 rounded-lg border dark:border-0 md:w-[320px] h-[350px] flex flex-col justify-center items-center">
            {/* Loading Effect */}
            {loading ? (
                <div className="w-full flex justify-center items-center flex-col">
                    <Skeleton sx={{ height: 170, width: 170 }} animation="wave" variant="circular" className="mb-5" />
                    <Skeleton sx={{ height: 20, width: '100%' }} animation="wave" variant="rectangular" className="mb-3" />
                    <Skeleton sx={{ height: 20, width: '100%' }} animation="wave" variant="rectangular" />
                </div>
            ) : (
                <>
                    {/* Chart Container */}
                    <div className="relative w-[170px] h-[170px] mb-6">
                        <Doughnut data={data} options={options} />
                        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-[#3E5481] dark:text-gray-200">{value[0]}%</span>
                            <span className="text-sm text-gray-500">Active Users</span>
                        </div>
                    </div>

                    {/* Legend Section */}
                    <div className="w-full space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-sm"
                                    style={{ backgroundColor: "#514E6D" }}
                                ></div>
                                <span className="text-sm text-[#3E5481]">Active Users</span>
                            </div>
                            <span className="text-sm font-bold text-[#3E5481] dark:text-gray-200">{value[0]}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-4 h-4 rounded-sm"
                                    style={{ backgroundColor: "#A3AED0" }}
                                ></div>
                                <span className="text-sm text-[#3E5481]">Inactive Users</span>
                            </div>
                            <span className="text-sm font-bold text-[#3E5481] dark:text-gray-200">{value[1]}%</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserActivityRingChart;
