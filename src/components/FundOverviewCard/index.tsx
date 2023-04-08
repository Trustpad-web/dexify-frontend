import { Avatar } from "flowbite-react";
import { FundOverview } from "../../@types";
import { getTokenInfo } from "../../helpers";
import { formatNumber } from "../../helpers/number";
import { useNavigate } from "react-router-dom";

const FundOverviewCard = ({ data }: { data: FundOverview }) => {
  const num = Math.ceil(Math.random() * 1000) % 3;
  const defaultImg = `/imgs/fund/${num}.png`;
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center w-[calc(100vw_-_20px)] md:w-[320px]"
      onClick={() => navigate(`/fund/${data.id}`)}
    >
      <img
        src={defaultImg}
        alt="fund-img"
        className="fund-img w-full rounded-[12px] h-[200px]"
      />
      <div className="fund-info flex flex-col w-[80%] mt-[-30px] rounded-[12px] bg-white  p-[8px]  min-h-[130px]">
        <h4 className="text-title font-bold text-[16px] mb-0">{data.name}</h4>
        <span className="text-description font-medium text-[12px]">
          {"The top 10 projects in crypto"}
        </span>
        <div className="fund-detail mt-auto flex justify-between items-center">
          <Avatar.Group className="-space-x-2">
            {data.assets.slice(0, 4).map((asset, index) => (
              <Avatar
                img={getTokenInfo(asset.id)?.logoURI || "/imgs/logo.png"}
                rounded={true}
                stacked={true}
                key={`asset-avatar-${index}`}
                size={"sm"}
              />
            ))}
            {data.assets.length > 4 && (
              <Avatar.Counter
                total={data.assets.length - 4}
                href="#"
                className="w-[32px] h-[32px]"
              />
            )}
          </Avatar.Group>
          <div className="profit-percent text-[12px]">
            <span
              className={
                "font-extrabold " +
                (data.aum > data.aum1WAgo ? "text-success" : "text-danger")
              }
            >
              {formatNumber(((data.aum - data.aum1WAgo) * 100) / data.aum1WAgo)}
              %
            </span>
            <span className="text-description">(1W)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundOverviewCard;
