import React from 'react'

type Props = {
    title: string | null;
    className?: string;
    welcome?: string;
}
const Heading: React.FC<Props> = ({ title }) => {
    return (
        <div className='bg-[#F6EFFF] dark:bg-gray-900 dark:text-white  text-black'>
            <div className="flexF flex-col -space-y-1">
                <h1 className="text-[40px] font-semibold">{title}</h1>
                {/* <small className="tracking-[4px] text-[14px] font-thin">{welcome}</small> */}
            </div>
        </div>
    )
}

export default Heading