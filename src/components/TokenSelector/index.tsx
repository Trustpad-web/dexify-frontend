import { Dropdown } from "flowbite-react";
import { Token } from "../../@types/token";

export default function TokenSelector({
  data,
  selectedToken,
  onSelectToken,
}: {
  data: Token[];
  selectedToken?: Token;
  onSelectToken: (token: Token) => void;
}) {
  return (
    <div className="rounded-[12px] w-fit">
      <Dropdown inline={true} label={<TokenRow item={selectedToken} />}>
        {data.map((item) => (
          <Dropdown.Item
            onClick={() => onSelectToken(item)}
            key={`token-list-${item.address}`}
          >
            <TokenRow item={item}/>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
}

const TokenRow = ({ item }: { item?: Token }) => {

  return (
    <div className="flex gap-2 items-center justify-between min-w-[80px] w-full">
      {item ? (
        <>
          <img src={item?.logoURI} alt="logo" className="w-[28x] h-[28px]" />
          <label htmlFor="" className="text-title text-[12px] md:text-[14px]">
            {item?.symbol}
          </label>
        </>
      ) : (
        <label htmlFor="" className="text-title text-[12px] md:text-[14px]">
          {"Select token"}
        </label>
      )}
    </div>
  );
};
