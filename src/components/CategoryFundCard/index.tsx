import { Avatar } from "flowbite-react";
import { FundOverview } from "../../@types";
import { getTokenInfo } from "../../helpers";
import { formatNumber } from "../../helpers/number";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "../../hooks/useMediaQuery";

const CategoryFundCard = ({ data }: { data: FundOverview }) => {
  const num = Math.ceil(Math.random() * 1000) % 3;
  const defaultImg = `/imgs/fund/${num}.png`;
  const navigate = useNavigate();

  const matches = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className="flex flex-row md:flex-col items-center w-[calc(100vw_-_30px)] md:w-[380px]"
      onClick={() => navigate(`/fund/${data.id}`)}
    >
      <img
        src={data.image || defaultImg}
        alt="fund-img"
        className="fund-img md:w-full rounded-[12px] md:h-[220px] w-[120px] h-[100px] z-[1] md:z-0"
      />
      <div className="fund-info flex flex-col w-[80%] md:mt-[-60px] md:ml-0 ml-[-10px] pl-[20px] md:pl-[8px] rounded-[12px] bg-white  p-[8px] md:h-fit  md:min-h-[130px] z-[0] md:z-[1]">
        <h4 className="text-title font-bold text-[12px] md:text-[16px] mb-0">
          {data.name}
        </h4>
        <span className="text-description font-medium md:text-[12px] text-[10px]">
          {data.description}
        </span>
        <div className="fund-detail md:mt-auto mt-5 flex justify-between items-center">
          <Avatar.Group className="-space-x-2">
            {data.assets?.slice(0, 4).map((asset, index) => (
              <Avatar
                img={getTokenInfo(asset.id)?.logoURI || "/imgs/logo.png"}
                rounded={true}
                stacked={true}
                key={`asset-avatar-${index}`}
                size={matches ? "xs" : "sm"}
              />
            ))}
            {(data.assets?.length || 0) > 4 && (
              <Avatar.Counter
                total={(data.assets?.length || 0) - 4}
                href="#"
                className="w-[24px] md:w-[32px] h-[24px] md:h-[32px]"
              />
            )}
          </Avatar.Group>
          <div className="profit-percent text-[12px]">
            <span
              className={
                "font-extrabold " +
                ((data?.sharePrice || 0) >= (data?.sharePrice1WAgo || 0)
                  ? "text-success"
                  : "text-danger")
              }
            >
              {formatNumber(
                (data.sharePrice1WAgo || 0) > 0
                  ? (((data.sharePrice || 0) - (data.sharePrice1WAgo || 0)) *
                      100) /
                      (data.sharePrice1WAgo || 0)
                  : 100
              )}
              %
            </span>
            <span className="text-description">(1W)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryFundCard;
