import React, { useEffect, useState } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { fetchCategories, fetchServiceCategories } from "../../redux/feature/products/productSlice";
import Slider from '@mui/material/Slider';
import { fetchSettings } from "../../redux/feature/Settings/settingApi";

interface ProductFilterProps {
    onFilterChange: (filters: { category: string; minPrice: number | null; maxPrice: number | null, minOrder: number | null }) => void;
    heading: string;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilterChange, heading }) => {
    const [category, setCategory] = useState<string | null>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { categories, serviceCategories } = useSelector((state: RootState) => state.product);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);
    const { settingsValue } = useSelector((state: RootState) => state.settings)

    const handleCategoryChange = (event: SelectChangeEvent<string | null>) => {
        const newCategory = event.target.value;
        setCategory(newCategory);
        onFilterChange({ category: newCategory as string, minPrice, maxPrice, minOrder: null });
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        event;
        const [newMinPrice, newMaxPrice] = newValue as number[];
        setMinPrice(newMinPrice);
        setMaxPrice(newMaxPrice);
        onFilterChange({ category: category as string, minPrice: newMinPrice, maxPrice: newMaxPrice, minOrder: null });
    };

    useEffect(() => {
        dispatch(fetchSettings());
        console.log("dd", settingsValue);
        dispatch(fetchCategories());
        dispatch(fetchServiceCategories());
    }, [dispatch]);

    return (
        <div className="w-64 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Filter {heading}</h2>

            {/* Category Filter */}
            <div className="mb-6">
                <FormControl
                    sx={{
                        m: 0,
                        width: '100%',
                        '& .MuiOutlinedInput-root': {
                            color: darkMode ? 'white' : 'black',
                            '& fieldset': {
                                borderColor: darkMode ? 'gray' : 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: darkMode ? 'lightgray' : 'blue',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: darkMode ? 'white' : 'black',
                        },
                        '& .MuiMenuItem-root': {
                            backgroundColor: darkMode ? '#333' : '#fff',
                            color: darkMode ? 'white' : 'black',
                        },
                    }} >
                    <InputLabel id="category-select-label">Categories</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={category || ''}
                        label="Categories"
                        onChange={handleCategoryChange}
                        fullWidth
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {(heading === 'Services' ? (
                            serviceCategories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category?.attributes?.name}
                                </MenuItem>
                            ))
                        ) : (
                            categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category?.name}
                                </MenuItem>
                            ))
                        ))}
                    </Select>
                </FormControl>

                {/* Price Range Filter with Slider */}
                <div className="mb-6 mt-5">
                    <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Price Range (INR)</h3>
                    <Slider
                        value={[minPrice || 0, maxPrice || 11]}
                        min={0}
                        max={111}
                        step={500}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `₹${value}`}
                    />
                    <div className="flex justify-between mt-2 text-gray-600 dark:text-gray-300">
                        <span>₹{minPrice || 0}</span>
                        <span>₹{maxPrice || 111}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;