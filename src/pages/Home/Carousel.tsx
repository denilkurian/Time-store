import React, { useState } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const Carousel: React.FC = () => {
    const slides = [
        {
            id: 1,
            title: 'Desktop and Laptops',
            subtitle: 'Up to 70% off',
            image: 'https://s3-alpha-sig.figma.com/img/5c7f/fad8/ad50094133956ffa464b8e1ec94ee0a1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=S9Hy-Qq2KFp8aAcOLGGt3sxWkBfzmw5lSUgw0LKHH07wTSbckg5oL1uJpdEOCYlSYpI~6EZstxUPOD3JW8TezcMNcZCcHbI1Ag~3iFUrZvDdawGa1oGsv-SYsVN1hx5TZ0C3vKgSgcvEangYz0RmIOh2uJ4zYgRKS6XP3N4TpLaF1Yk8tX9GQ1-07n6doTDW4wyXtnDB42-PTHBs0af~m8Dr0Dt1Z-lqobc2N0hrkh2kR7pmueEMXCM99GjEyhi-6juGLlWieH0VfOeDwxWjDiP6LPPePIZQr3HcohvrMlcWEHqspeCtKtTdDHTnl5lfvuHGstdOydihmqCjFtbW~g__', // Replace with your image URL
        },
        {
            id: 2,
            title: 'Smartphones and Gadgets',
            subtitle: 'Up to 50% off',
            image: 'https://s3-alpha-sig.figma.com/img/5c7f/fad8/ad50094133956ffa464b8e1ec94ee0a1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=S9Hy-Qq2KFp8aAcOLGGt3sxWkBfzmw5lSUgw0LKHH07wTSbckg5oL1uJpdEOCYlSYpI~6EZstxUPOD3JW8TezcMNcZCcHbI1Ag~3iFUrZvDdawGa1oGsv-SYsVN1hx5TZ0C3vKgSgcvEangYz0RmIOh2uJ4zYgRKS6XP3N4TpLaF1Yk8tX9GQ1-07n6doTDW4wyXtnDB42-PTHBs0af~m8Dr0Dt1Z-lqobc2N0hrkh2kR7pmueEMXCM99GjEyhi-6juGLlWieH0VfOeDwxWjDiP6LPPePIZQr3HcohvrMlcWEHqspeCtKtTdDHTnl5lfvuHGstdOydihmqCjFtbW~g__', // Replace with your image URL
        },
        {
            id: 3,
            title: 'Accessories and More',
            subtitle: 'Up to 30% off',
            image: 'https://s3-alpha-sig.figma.com/img/5c7f/fad8/ad50094133956ffa464b8e1ec94ee0a1?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=S9Hy-Qq2KFp8aAcOLGGt3sxWkBfzmw5lSUgw0LKHH07wTSbckg5oL1uJpdEOCYlSYpI~6EZstxUPOD3JW8TezcMNcZCcHbI1Ag~3iFUrZvDdawGa1oGsv-SYsVN1hx5TZ0C3vKgSgcvEangYz0RmIOh2uJ4zYgRKS6XP3N4TpLaF1Yk8tX9GQ1-07n6doTDW4wyXtnDB42-PTHBs0af~m8Dr0Dt1Z-lqobc2N0hrkh2kR7pmueEMXCM99GjEyhi-6juGLlWieH0VfOeDwxWjDiP6LPPePIZQr3HcohvrMlcWEHqspeCtKtTdDHTnl5lfvuHGstdOydihmqCjFtbW~g__', // Replace with your image URL
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? slides.length - 1 : prevIndex - 1
        );
    };
    return (
        <div className="relative w-full h-56 flex items-center justify-center bg-gradient-to-r from-[#6056E6] to-[#1D9BEA] rounded-lg overflow-hidden">
            {/* Slide */}
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out transform"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="flex-shrink-0 w-full h-full flex items-center justify-center text-center px-4"
                    >
                        <div className='flex items-center justify-around w-full -space-x-36'>
                            <div className='text-left -space-y-2'>
                                <h2 className="text-2xl font-bold text-white">{slide.title}</h2>
                                <p className="text-lg text-white mt-2">{slide.subtitle}</p>
                            </div>
                            <div>
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-[100px] mt-4 mx-auto"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Left Arrow */}
            <button
                onClick={handlePrev}
                className="absolute left-4 text-black transition"
            >
                <MdKeyboardArrowLeft className='text-white text-8xl' />
            </button>

            {/* Right Arrow */}
            <button
                onClick={handleNext}
                className="absolute right-4 text-black rounded-full transition"
            >
                <MdKeyboardArrowRight className='text-white text-8xl'/>

            </button>
        </div>
    )
}

export default Carousel