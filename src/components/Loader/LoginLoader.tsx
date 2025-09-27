import { Ring } from "@uiball/loaders";

const LoginLoader = () => {
    return (
        <>
            <div className="fixed inset-0  justify-center items-center bg-black bg-opacity-65 z-100">
                <div className="flex text-white flex-col justify-center items-center h-screen">
                    <Ring size={70} lineWeight={5} speed={2} color="white" /><br/>
                    <p>Loading...</p>
                </div>   
            </div>
        </>
    );
};

export default LoginLoader;
