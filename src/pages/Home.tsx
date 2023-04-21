import { Button } from "flowbite-react";
import FundOverviewCard from "../components/FundOverviewCard";
import "../assets/css/home.css";
import { HiOutlineChevronRight } from "react-icons/hi";
import { useAppSelector } from "../store";
import FundSkeleton from "../components/Skeleton/FundSkeleton";
import { Link, useNavigate } from "react-router-dom";
import CustomCarousel from "../components/Carousel";
import CategoryFundCard from "../components/CategoryFundCard";
import { FundCategoryType } from "../components/CreateVaultBasics/categories";
import { useEffect, useState } from "react";
import { FundOverview } from "../@types";
import AdCard from "../components/AdCard";

export default function Home() {
  const { data: funds, loading } = useAppSelector((state) => state.topDexfunds);
  const { data: allfunds, loading: loadingAllFunds } = useAppSelector(
    (state) => state.allFunds
  );

  const [topIndexFund, setTopIndexFund] = useState<FundOverview>();
  const [topInstitutionFund, setTopInstitutionFund] = useState<FundOverview>();
  const [topIconFund, setTopIconFund] = useState<FundOverview>();

  useEffect(() => {
    if (allfunds && allfunds.length > 0) {
      const indexFund = allfunds.find(
        (item) => item.category === FundCategoryType.INDEX
      );
      const institutionFund = allfunds.find(
        (item) => item.category === FundCategoryType.INSTITUTION
      );
      const iconFund = allfunds.find(
        (item) => item.category === FundCategoryType.ICON
      );

      setTopIconFund(iconFund);
      setTopIndexFund(indexFund);
      setTopInstitutionFund(institutionFund);
    }
  }, [allfunds]);

  const navigate = useNavigate();

  return (
    <div className="w-full">
      <AdCard
        image="/imgs/logo.png"
        title="Dexfunds"
        description="Portfolios of asset management strategies that any other digital wallet can invest in!"
        color={'bg-secondary'}
      />
      {/* Top Dexfunds */}
      <h2 className="text-title mt-[30px] md:mt-[60px] mb-5 font-bold text-[16px] md:text-[20px] dark:text-white">
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

      <div className="flex md:flex-row flex-col gap-[30px] mt-[30px]">
        <div className="flex-1">
          <div className="flex justify-between w-full items-center mb-5">
            <h2 className="text-title font-bold text-[16px] md:text-[20px] dark:text-white">
              Index Funds
            </h2>
            <Link
              to="/index-funds"
              className="font-bold text-[12px] md:text-[14px] text-secondary"
            >
              View All
            </Link>
          </div>
          {loadingAllFunds || !topIndexFund ? (
            <FundSkeleton />
          ) : (
            <CategoryFundCard data={topIndexFund} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between w-full items-center mb-5">
            <h2 className="text-title font-bold text-[16px] md:text-[20px] dark:text-white">
              Institution Funds
            </h2>
            <Link
              to="/institution-funds"
              className="font-bold text-[12px] md:text-[14px] text-secondary"
            >
              View All
            </Link>
          </div>
          {loadingAllFunds || !topInstitutionFund ? (
            <FundSkeleton />
          ) : (
            <CategoryFundCard data={topInstitutionFund} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between w-full items-center mb-5">
            <h2 className="text-title font-bold text-[16px] md:text-[20px] dark:text-white">
              Icon Funds
            </h2>
            <Link
              to="/icon-funds"
              className="font-bold text-[12px] md:text-[14px] text-secondary mr-2"
            >
              View All
            </Link>
          </div>
          {loadingAllFunds || !topIconFund ? (
            <FundSkeleton />
          ) : (
            <CategoryFundCard data={topIconFund} />
          )}
        </div>
      </div>
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
