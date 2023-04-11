import { Avatar, Pagination, Table } from "flowbite-react";
import { FundOverviewWithHistoryResponse } from "../../@types";
import FundSkeleton from "../Skeleton/FundSkeleton";
import { fund_portfolio_table_fields } from "../../constants/fund_portfolio_table_fields";
import { useCallback, useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import TableRowSkeleton from "../Skeleton/TableRowSkeleton";
import { useAppSelector } from "../../store";
import { formatCurrency, formatNumber, getTokenInfo } from "../../helpers";
import { HOLDING_PAGE_SIZE } from "../../constants";
import PortfolioChart from "./PortfolioChart";

export type TableAsset = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  allocation: number;
  changes: number;
};

export default function FundPortfolio({
  fundDetail,
  loading,
}: {
  fundDetail: FundOverviewWithHistoryResponse | undefined;
  loading: boolean;
}) {
  const allAssets = useAppSelector((state) => state.assets.data);
  const ethPrices = useAppSelector((state) => state.currency.data);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortData, setSortData] = useState<{
    field: string;
    direction: "desc" | "asc";
  }>({
    field: "aum",
    direction: "desc",
  });
  const [assets, setAssets] = useState<TableAsset[]>([]);
  const [displayAssets, setDisplayAssets] = useState<TableAsset[]>([]);

  useEffect(() => {
    let _assets: TableAsset[] = [];
    if (fundDetail && allAssets && ethPrices) {
      const currentEthPrice = Number(ethPrices.price?.price);
      fundDetail.assets?.map((asset) => {
        let _asset: TableAsset = {
          id: asset.id,
          name: asset.name,
          symbol: asset.symbol,
          amount: asset.aum * currentEthPrice,
          price: Number(asset.price?.price) * currentEthPrice,
          allocation: fundDetail.aum
            ? (asset.aum * currentEthPrice) / fundDetail.aum
            : 0,
          changes: 0,
        };

        const assetRawData = allAssets.find((a) => a.id === asset.id);
        if (assetRawData) {
          const price1dAgo =
            Number(assetRawData.daily?.open) * Number(ethPrices.daily?.open);
          _asset.changes =
            price1dAgo > 0
              ? ((_asset.price - price1dAgo) * 100) / price1dAgo
              : 100;
        }
        _assets.push(_asset);
      });

      setAssets(_assets);
    }
  }, [fundDetail, allAssets, ethPrices]);

  const sortFunction = useCallback(
    (a: TableAsset, b: TableAsset) => {
      switch (sortData.field) {
        case "assets":
          if (b.name > a.name) {
            return sortData.direction === "desc" ? 1 : -1;
          } else {
            return sortData.direction === "desc" ? -1 : 1;
          }
        case "balance":
          return sortData.direction === "desc"
            ? b.amount - a.amount
            : a.amount - b.amount;
        case "price":
          return sortData.direction === "desc"
            ? b.price - a.price
            : a.price - b.price;
        case "allocation":
          return sortData.direction === "desc"
            ? b.allocation - a.allocation
            : a.allocation - b.allocation;
        case "changes":
          return sortData.direction === "desc"
            ? b.changes - a.changes
            : a.changes - b.changes;
        default:
          return sortData.direction === "desc"
            ? b.amount - a.amount
            : a.amount - b.amount;
      }
    },
    [sortData]
  );

  useEffect(() => {
    if (assets && assets.length > 0 && sortFunction && setDisplayAssets) {
      const _assets = [...assets];
      _assets.sort(sortFunction);
      setDisplayAssets(
        _assets.slice(
          (pageNumber - 1) * HOLDING_PAGE_SIZE,
          pageNumber * HOLDING_PAGE_SIZE
        )
      );
    }
  }, [pageNumber, assets, setDisplayAssets, sortFunction]);

  const onPageChange = useCallback(
    (page: number) => {
      setPageNumber(page);
    },
    [setPageNumber]
  );

  const handleCellHeaderClicked = (field: {
    title: string;
    key: string;
    sortable: boolean;
  }) => {
    if (!field.sortable) return;
    if (sortData.field === field.key) {
      setSortData({
        ...sortData,
        direction: sortData.direction === "desc" ? "asc" : "desc",
      });
    } else {
      setSortData({
        field: field.key,
        direction: "desc",
      });
    }
  };

  return loading ? (
    <FundSkeleton />
  ) : (
    <div className="flex gap-2 w-full flex-col md:flex-row">
      <div className="flex-1 order-2 md:order-1">
        <div className="relative overflow-x-auto w-full">
          <Table hoverable={true} className="whitespace-nowrap">
            <Table.Head>
              {fund_portfolio_table_fields.map((field) => (
                <Table.HeadCell
                  key={`all-funds-table-header-${field.key}`}
                  className={field.sortable ? "cursor-pointer" : ""}
                  onClick={() => handleCellHeaderClicked(field)}
                >
                  <div className="flex">
                    {field.title}
                    {field.key === sortData.field && (
                      <>
                        {sortData.direction === "desc" ? (
                          <HiChevronUp className="ml-2" />
                        ) : (
                          <HiChevronDown className="ml-2" />
                        )}
                      </>
                    )}
                  </div>
                </Table.HeadCell>
              ))}
            </Table.Head>

            <Table.Body className="divide-y">
              {loading ? (
                <Table.Row>
                  <TableRowSkeleton />
                </Table.Row>
              ) : (
                displayAssets.map((asset) => (
                  <Table.Row
                    className="bg-white border-none dark:bg-gray-800 hover:bg-hoverColor cursor-pointer text-title"
                    key={`funds-holding-table-row-${asset.id}`}
                  >
                    <Table.Cell className="flex items-center gap-3">
                      <Avatar
                        img={
                          getTokenInfo(asset.id)?.logoURI || "/imgs/logo.png"
                        }
                        rounded={true}
                        className="min-w-fit"
                      />
                      <span className="font-bold text-title text-[12px] md:text-[14px] dark:text-white">
                        {asset.symbol}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="font-bold">
                        {formatCurrency(asset.amount)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={"font-bold"}>
                        {formatCurrency(asset.price)}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={"font-bold"}>
                        {formatNumber(asset.allocation * 100)}%
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        className={
                          "font-bold" +
                          (asset.changes >= 0
                            ? " text-success"
                            : " text-danger")
                        }
                      >
                        {formatNumber(asset.changes)}%
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>

          <Pagination
            className="all-funds-pagination flex items-center text-[12px] md:text-[14px] mx-auto mt-5 justify-center"
            currentPage={pageNumber}
            totalPages={Math.ceil(
              (fundDetail?.assets?.length || 0) / HOLDING_PAGE_SIZE
            )}
            onPageChange={onPageChange}
            showIcons={true}
            previousLabel=""
            nextLabel=""
          />
        </div>
      </div>
      <div className="md:w-[400px] w-full h-[300px] order-1 md:order-2">
        <h4 className="text-title text-[18px] md:text-[24px] font-bold">
          Portfolio
        </h4>
        <div className="rounded-[12px] bg-white w-full h-full">
          <PortfolioChart
            data={assets.map((asset) => ({
              value: Number(asset.amount.toFixed(2)),
              name: asset.symbol,
              id: asset.id,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
