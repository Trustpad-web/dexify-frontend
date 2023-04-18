import { Spinner } from "flowbite-react";

export default function LoadingScreen() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Spinner className="w-[48px] h-[48px] fill-secondary"/>
        </div>
    )
}