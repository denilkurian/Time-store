import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

type Props = {
    dataLastWeek?: number[]; // Data for the last week
    dataLastMonth?: number[][]; // Data for the last month (array of weekly data)
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserActivityBarChart: React.FC<Props> = ({ dataLastWeek, dataLastMonth }) => {
    const [showLastWeek, setShowLastWeek] = useState(true);

    const defaultDataLastWeek = [10, 40, 30, 20, 50, 10, 20];
    const defaultDataLastMonth = [
        [50, 60, 45, 30, 25, 70, 40],
        [80, 35, 50, 65, 70, 30, 20],
        [50, 40, 10, 30, 55, 60, 20],
        [40, 35, 25, 45, 50, 60, 30],
    ];
    const dataToUse = showLastWeek ? dataLastWeek || defaultDataLastWeek : dataLastMonth || defaultDataLastMonth;
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const currentDay = currentDate.getDate();

    const chartData = {
        labels: showLastWeek
            ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            : Array.from({ length: dataLastMonth ? dataLastMonth.length : 4 }, (_, i) => `Week ${i + 1}`),
        datasets: [
            {
                label: `User Activity (${showLastWeek ? `Week of ${currentDay}` : currentMonth})`,
                data: dataToUse.flat(),
                backgroundColor: "#3E5481",
                borderRadius: 5,
                barThickness: showLastWeek ? 15 : 10,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#3E5481",
                },
            },
            y: {
                grid: {
                    color: "#E0E0E0",
                },
                ticks: {
                    color: "#3E5481",
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <div className="p-4 dark:bg-gray-800 dark:border-0 bg-white border rounded-lg w-full md:min-w-[500px] h-auto md:h-[400px]">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
                    <h1 className="text-lg sm:text-xl font-bold text-[#3E5481]">User Activity</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowLastWeek(true)}
                            className={`px-3 py-1 rounded-full ${showLastWeek ? "bg-[#3E5481] text-white" : "bg-gray-200 text-black"
                                }`}
                        >
                            Last Week
                        </button>
                        <button
                            onClick={() => setShowLastWeek(false)}
                            className={`px-3 py-1 rounded-full ${!showLastWeek ? "bg-[#3E5481] text-white" : "bg-gray-200 text-black"
                                }`}
                        >
                            Last Month
                        </button>
                    </div>
                </div>
                {/* Chart Section */}
                <div className="h-[300px] w-full">
                    <Bar options={options} data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default UserActivityBarChart;
