import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';

interface TimeCardProps {
    count: number; // Final count value
    description: string;
    icon?: React.ReactNode;
    className?: string;
    loading?: boolean;
    duration?: number;
}

const Cards: React.FC<TimeCardProps> = ({ count, description, icon, className, loading, duration = 2000 }) => {
    const [displayCount, setDisplayCount] = useState(0);
    const { isCollapse } = useSelector((state: RootState) => state.ui)

    useEffect(() => {
        if (!loading) {
            let start = 0;
            const startTime = performance.now();

            const step = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                start = Math.floor(progress * count);

                setDisplayCount(start);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        }
    }, [count, duration, loading]);

    return (
        <div
            className={`${className} flex dark:bg-[#1f2937] dark:text-white flex-col items-start justify-between p-4 bg-gradient-to-b from-[#0E124880] to-[#9D98D380] rounded-3xl md:w-4/5 relative overflow-hidden h-36 py-10 px-[10px] shrink w-72`}
        >
            {loading ? (
                <div className="flex flex-col w-full h-full justify-center space-y-4 animate-pulse">
                    <div className="w-2/3 h-6 bg-gray-300 dark:bg-gray-400 rounded-md"></div>
                    <div className="w-1/2 h-10 bg-gray-300 dark:bg-gray-400 rounded-md"></div>
                    <div className="absolute bottom-[50px] right-3 w-14 h-14 bg-gray-300 dark:bg-gray-400 rounded-full"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-row items-center justify-between w-full">
                        <p className={`font-thin ${isCollapse ? 'text-2xl' : 'text-xl'} transition-all ease-in-out duration-200 dark:text-white text-white`}>
                            {description}
                        </p>

                        <div className="text-gray-900 dark:text-white text-[50px] flex-shrink-0">{icon}</div>
                    </div>
                    <div className="mt-2">
                        <p className="text-white text-2xl font-bold transition-all ease-in-out duration-500">{displayCount}</p>
                    </div>
                </>
            )}
        </div>

    );
};

export default Cards;
