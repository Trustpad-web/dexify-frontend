import { TimeRange } from "../../@types/timeRange";
import { ItemType } from "../Select";
export const chartTimeRange: ItemType[] = Object.entries(TimeRange).map(item => ({
    label: item[1],
    value: item[1],
}))