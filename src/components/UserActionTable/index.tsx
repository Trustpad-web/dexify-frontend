import { useState, useCallback, useEffect } from "react";
import { Avatar, Pagination, Table } from "flowbite-react";
import { formatCurrency, getTokenInfo } from "../../helpers";
import { USER_ACTION_PAGE_SIZE } from "../../constants";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import TableRowSkeleton from "../Skeleton/TableRowSkeleton";
import { formatTime } from "../../helpers/time";
import useMediaQuery from "../../hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { EXPLORER_URL } from "../../constants/web3";
import { user_action_table_fields } from "../../constants/user_action_table_fields";
import { UserActivity } from "../../hooks/useUserActivities";

export default function UserActionTable({
  activities,
  loading,
}: {
  activities: UserActivity[];
  loading: boolean;
}) {
  const matches = useMediaQuery("(max-width: 768px)");
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [sortData, setSortData] = useState<{
    field: string;
    direction: "desc" | "asc";
  }>({
    field: "timestamp",
    direction: "desc",
  });
  const [displayData, setDisplayData] = useState<UserActivity[]>(activities);

  const sortFunction = useCallback(
    (a: UserActivity, b: UserActivity) => {
      switch (sortData.field) {
        case "assets":
          if (b.timestamp > a.timestamp) {
            return sortData.direction === "desc" ? -1 : 1;
          } else {
            return sortData.direction === "desc" ? 1 : -1;
          }
        case "fund":
          return sortData.direction === "desc"
            ? b.fundName > a.fundName
              ? 1
              : -1
            : a.fundName > b.fundName
            ? 1
            : -1;
        case "amount":
          return sortData.direction === "desc"
            ? b.amount - a.amount
            : a.amount - b.amount;
        default:
          return sortData.direction === "desc"
            ? b.timestamp - a.timestamp
            : a.timestamp - b.timestamp;
      }
    },
    [sortData]
  );

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

  useEffect(() => {
    if (activities && activities.length > 0 && sortFunction && setDisplayData) {
      const _activities = [...activities];
      _activities.sort(sortFunction);
      setDisplayData(
        _activities.slice(
          (pageNumber - 1) * USER_ACTION_PAGE_SIZE,
          pageNumber * USER_ACTION_PAGE_SIZE
        )
      );
    }
  }, [pageNumber, activities, setDisplayData, sortFunction]);

  return (
    <div className="relative overflow-x-auto w-full">
      <Table hoverable={true} className="whitespace-nowrap">
        <Table.Head>
          {user_action_table_fields.map((field) => (
            <Table.HeadCell
              key={`fund-feed-table-header-${field.key}`}
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
            displayData.map((item) => (
              <Table.Row
                className="items-center bg-white border-none dark:bg-gray-800 hover:bg-hoverColor cursor-pointer text-title"
                key={`funds-holding-table-row-${item.timestamp}`}
              >
                <Table.Cell>
                  {/* <Avatar
                    img={item.fundImage || "/imgs/logo.png"}
                    rounded={true}
                    stacked={true}
                    size={matches ? "xs" : "sm"}
                  /> */}
                  <a
                    className="font-bold text-[12px] md:text-[14px]"
                    href={`${EXPLORER_URL}/address/${item.fundAddress}`}
                    target="_blank"
                  >
                    {item.fundName}
                  </a>
                </Table.Cell>
                <Table.Cell className="">
                  <span className="font-bold text-title text-[12px] md:text-[14px] dark:text-white">
                    {formatTime(item.timestamp)}
                  </span>
                </Table.Cell>

                <Table.Cell>
                  <Avatar.Group className="-space-x-2 min-w-[150px] md:min-w-fit">
                    {item.assets.slice(0, 4).map((asset, index) => (
                      <Avatar
                        img={
                          getTokenInfo(asset?.id || "0x")?.logoURI ||
                          "/imgs/logo.png"
                        }
                        rounded={true}
                        stacked={true}
                        key={`asset-avatar-${index}`}
                        size={"sm"}
                      />
                    ))}
                    {item.assets.length > 4 && (
                      <Avatar.Counter
                        total={item.assets.length - 4}
                        href="#"
                        className="w-[32px] h-[32px]"
                      />
                    )}
                  </Avatar.Group>
                </Table.Cell>
                <Table.Cell>
                  <span className={"font-bold text-[12px] md:text-[14px]"}>
                    {formatCurrency(item.amount)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <a
                    className={
                      "flex font-bold rounded-[16px] p-2 border-2 w-full justify-center items-center text-[12px] md:text-[14px]" +
                      (item.type === "Invest"
                        ? " text-secondary border-secondary"
                        : " text-primary border-primary")
                    }
                    href={`${EXPLORER_URL}/tx/${item.transaction.id}`}
                    target="_blank"
                  >
                    {item.type}
                  </a>
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
          (activities?.length || 0) / USER_ACTION_PAGE_SIZE
        )}
        onPageChange={onPageChange}
        showIcons={true}
        previousLabel=""
        nextLabel=""
      />
    </div>
  );
}
