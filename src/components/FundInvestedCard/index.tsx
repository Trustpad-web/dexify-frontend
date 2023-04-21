import { formatCurrency, formatNumber } from "../../helpers/number";
import { useNavigate } from "react-router-dom";
import { FundCategoryType } from "../CreateVaultBasics/categories";

export type InvestedFund = {
  holdingAmount: number;
  returns: number;
  name: string,
  id: string,
  image?: string,
  category: FundCategoryType
}
const FundInvestedCard = ({ data }: { data: InvestedFund }) => {
  const num = Math.ceil(Math.random() * 1000) % 3;
  const defaultImg = `/imgs/fund/${num}.png`;
  const navigate = useNavigate();
  
  return (
    <div
      className="flex flex-col items-center w-[calc(100vw_-_30px)] md:w-[380px]"
      onClick={() => navigate(`/fund/${data.id}`)}
    >
      <img
        src={data.image || defaultImg}
        alt="fund-img"
        className="fund-img w-full rounded-[12px] h-[220px]"
      />
      <div className="fund-info flex flex-col w-[80%] mt-[-60px] rounded-[12px] bg-white  p-[8px]  min-h-[130px]">
        <h4 className="text-title font-bold text-[16px] mb-0">{data.name}</h4>
        <span className="text-description font-medium text-[12px]">
          {"The top 10 projects in crypto"}
        </span>
        <div className="fund-detail mt-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-description text-[12px] font-bold">AUM</span>
            <span className="text-title text-[12px] font-bold">
              {formatCurrency(data.holdingAmount || 0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-description text-[12px] font-bold">Return</span>
            <span
              className={`text-[12px] font-bold ${
                data.returns > 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatNumber(data.returns * 100 || 0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundInvestedCard;
