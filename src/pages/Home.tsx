import { Button } from "flowbite-react";
import FundOverviewCard from "../components/FundOverviewCard";
import "../assets/css/home.css";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useAppSelector } from "../store";
import FundSkeleton from "../components/Skeleton/FundSkeleton";
import { useNavigate } from "react-router-dom";
import CustomCarousel from "../components/Carousel";

export default function Home() {
  const { data: funds, loading } = useAppSelector((state) => state.topDexfunds);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="ad flex items-center gap-2 md:gap-5 px-2 md:px-[48px] rounded-[12px] bg-secondary py-3 md:py-0 h-fit md:h-[160px] overflow-hidden">
        <img
          src="/imgs/logo.png"
          alt="logo"
          className="w-[48px] md:w-[160px] rounded-[50%] border-[5px] md:border-[15px] border-[#fff] box-content"
        />
        <div className="flex flex-col gap-1 md:gap-3">
          <h3 className="title text-[#fff] text-[18px] md:text-[24px] font-bold">
            Dexfunds
          </h3>

          <p className="text-[#fff] text-[12px] md:text-[16px] font-medium">
            Portfolios of asset management strategies that any other digital
            wallet can invest in!
          </p>
        </div>
      </div>
      {/* Top Dexfunds */}
      <h2 className="text-title mt-[60px] mb-5 font-bold text-[24px] dark:text-white">
        Top Dexfunds
      </h2>
      <CustomCarousel
        isLeftControlShow={funds.length > 0}
        isRightControlShow={funds.length > 0}
      >
        {loading
          ? [1, 2, 3].map((item) => <FundSkeleton key={item} />)
          : funds.map((fund, index) => (
              <FundOverviewCard data={fund} key={`fund-overview-${index}`} />
            ))}
      </CustomCarousel>
      <Button
        color={"white"}
        className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:bg-gradient-to-l text-white mx-auto mt-10 rounded-[32px]"
        onClick={() => navigate("/all-funds")}
      >
        View All Dexfunds {` `} <HiOutlineChevronRight color="white" />
      </Button>
    </div>
  );
}
