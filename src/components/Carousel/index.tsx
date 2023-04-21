import { Carousel } from "flowbite-react";
import { ReactNode } from "react";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export default function CustomCarousel({
  children,
  isLeftControlShow,
  isRightControlShow,
}: {
  children: ReactNode;
  isLeftControlShow: boolean;
  isRightControlShow: boolean;
}) {
  return (
    <div className="w-[calc(100%)] md:w-[calc(1536px_-_320px_-_20px)]">
      <Carousel
        slideInterval={5000}
        slide={false}
        indicators={false}
        className="top-funds-carousel"
        leftControl={isLeftControlShow ? <LeftControl /> : <></>}
        rightControl={isRightControlShow ? <RightControl /> : <></>}
      >
        {children}
      </Carousel>
    </div>
  );
}

const LeftControl = () => {
  return (
    <div className="p-2 rounded-[50%] bg-[#817c85ba] mb-10">
      <HiOutlineChevronLeft size={24} className="rounded-[50%]" color="white" />
    </div>
  );
};

const RightControl = () => {
  return (
    <div className="p-2 rounded-[50%] bg-[#817c85ba] mb-10">
      <HiOutlineChevronRight
        size={24}
        className="rounded-[50%]"
        color="white"
      />
    </div>
  );
};
