import React, { useState, useMemo, useEffect } from 'react';
import ProductPage from './ProductPage';
import ServicePage from './ServicePage';
import Footer from './Footer';
import ProductFilter from './FIlter';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { setActivePage } from '../../redux/feature/Guest/guestSlice';

const HomePage: React.FC = () => {
    const location = useLocation();
    const [searchValue, setSearchValue] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const activePage = useSelector((state: RootState) => state.guest.pageType);

    const [filters, setFilters] = useState<{
        category: string;
        minPrice: number | null;
        maxPrice: number | null;
        minOrder: number | null;
    }>({
        category: '',
        minPrice: null,
        maxPrice: null,
        minOrder: null,
    });

    const handleFilterChange = (newFilters: { category: string; minPrice: number | null; maxPrice: number | null, minOrder: number | null }) => {
        setFilters(newFilters);
    };

    useEffect(() => {
        if (location.state?.pageType) {
            dispatch(setActivePage(location.state.pageType));
        }
    }, [location.state, dispatch]);

    const handleButtonClick = (page: string) => {
        setSearchValue("");
        dispatch(setActivePage(page));
    };

    const productPageMemo = useMemo(() => (
        <ProductPage filters={filters} name={searchValue as string} />
    ), [filters, searchValue]);

    const servicePageMemo = useMemo(() => (
        <ServicePage filters={filters} name={searchValue as string} />
    ), [filters, searchValue]);

    return (
        <div className='bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black py-2 mt-10'>
            <div className='px-3 flex flex-col md:flex-row'>
                <div className='flex flex-col items-center max-w-[800px]'>
                    <div className='sticky top-[30px]'>
                        <div className="my-5 flex transition-all duration-[10s]">
                            <button
                                className={`p-[10px] min-w-[108px] border-[1px] ${activePage === 'Product'
                                    ? 'bg-[#6056E6] text-white border-[#6056E6]'
                                    : 'bg-[#ffffff] dark:bg-gray-800 dark:text-white text-[#6056E6] border-[#6056E6]'
                                    }`}
                                onClick={() => handleButtonClick('Product')}
                            >
                                Product
                            </button>
                            <button
                                className={`p-[10px] min-w-[108px] border-[1px] ${activePage === 'Service'
                                    ? 'bg-[#6056E6] text-white dark:text-white border-[#6056E6]'
                                    : 'bg-[#ffffff] dark:bg-gray-800 dark:text-white text-[#6056E6] border-[#6056E6]'
                                    }`}
                                onClick={() => handleButtonClick('Service')}
                            >
                                Service
                            </button>
                        </div>
                        <div className='mb-5 hidden md:block'>
                            <div className='sticky top-[100px] z-30 mb-5'>
                                <ProductFilter onFilterChange={handleFilterChange}
                                    heading={activePage === 'Product' ? 'Products' : 'Services'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex bg-[#F6EFFF] dark:bg-gray-900 dark:text-white text-black h-full w-full">

                    <div className="w-full">
                        <form className="max-w-md mx-auto">
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    id="default-search"
                                    value={searchValue || ''}
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder={`Enter ${activePage} Name`}
                                    required
                                />
                            </div>
                        </form>
                        <div
                            className={`p-4 rounded-r w-full transition-opacity duration-500 ease-in-out ${activePage === "Product" ? "opacity-100 block" : "opacity-0 hidden"
                                }`}
                        >
                            {productPageMemo}
                        </div>
                        <div
                            className={`p-4 rounded-r w-full transition-opacity duration-500 ease-in-out ${activePage === "Service" ? "opacity-100 block" : "opacity-0 hidden"
                                }`}
                        >
                            {servicePageMemo}
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </div>
    );
};

export default HomePage;
