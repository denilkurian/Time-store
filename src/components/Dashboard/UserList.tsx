import React from "react"

type Props = {

}

const UserList: React.FC<Props> = () => {
    return (
        <div className="w-[500px]">
            <div className="mt-5 w-full">
                <h1 className="font-semibold">Best User List</h1>
                <div>
                </div>
            </div>
            < div className="w-full h-16 bg-[#514E6D1A] rounded-3xl border border-[#0000001A] flex items-center p-[10px] space-x-6" >
                <div className="w-[37.15px] h-[37.15px] rounded-full overflow-hidden object-cover">
                    <img src="../../../../public/landing-page-design-bg.jpg" alt="" />
                </div>

                <div className="w-full h-full flex justify-around">
                    <div className="text-start">
                        <p>John Sac</p>
                        <p className="font-semibold">Marketing</p>
                    </div>
                    <div className="text-start">
                        <p>John Sac</p>
                        <p className="font-semibold">Type</p>
                    </div>
                    <div className="text-start">
                        <p>John Sac</p>
                        <p className="font-semibold">Item</p>
                    </div>
                    <div className="text-start">
                        <p>John Sac</p>
                        <p className="font-semibold">Total Sales</p>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default UserList