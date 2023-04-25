import { Tooltip } from "flowbite-react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function CustomTooltip({title, content} : {
    title: string,
    content: string,
}) {
    return (
        <Tooltip animation="duration-300" style="light" title={title} content={
            <div className="max-w-[300px] text-justify text-description">
                {content}
            </div>
        }>
            <HiOutlineInformationCircle />
        </Tooltip>
    )
}