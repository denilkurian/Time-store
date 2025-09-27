import { BsGraphUp } from 'react-icons/bs';
import { useEffect } from 'react';
import Cards from '../../components/Card/Card';
import { PiUsersThreeLight } from 'react-icons/pi';
import DashboardContents from '../../components/Dashboard/DashboardContents';
import Heading from '../../components/Heading/Heading';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { useDispatch } from 'react-redux';
import { fetchDashboardDetails } from '../../redux/feature/Dashboard/DashboardApi';
import { AiOutlineGift } from "react-icons/ai";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const DashboardHome = () => {

    const { data, loading } = useSelector((state: RootState) => state.dashboard);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!data || !data.data || Object.keys(data.data.attributes || {}).length === 0) {
            dispatch(fetchDashboardDetails());
        }
    }, [data, dispatch]);

    return (
        <div className="bg-[#F6EFFF] dark:bg-gray-900 dark:text-white  text-black px-3 py-4 h-full">
            <div className="min-w-5/6 max-w-full">
                <div className="flex flex-col -space-y-1">
                    <Heading title="Dashboard" welcome="Welcome Admin" />
                </div>
                <div className="mx-3 mt-10 md:mt-5 grid grid-cols-1 justify-items-center sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 gap-x-1 gap-y-5">
                    <Cards
                        count={data?.data.attributes.users as number}
                        description="Total Users"
                        loading={loading}
                        // duration={500}
                        icon={<PiUsersThreeLight />}

                    />
                    <Cards
                        count={data?.data.attributes.products as number}
                        description="Total Products"
                        loading={loading}
                        // duration={500}
                        icon={<AiOutlineGift />}
                    />
                    <Cards
                        count={data?.data.attributes.services as number}
                        description="Total Services"
                        loading={loading}
                        // duration={500}
                        icon={<BsGraphUp />}
                    />
                    <Cards
                        count={data?.data.attributes.approvals as number}
                        description="Total Approvals"
                        loading={loading}
                        // duration={500}
                        icon={<IoIosCheckmarkCircleOutline />}
                    />
                </div>


                <div className="mt-10">
                    <DashboardContents />
                </div>

            </div>
        </div>
    )
}

export default DashboardHome