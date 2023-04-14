import { FundDto, FundOverview } from "./fund";
import { FundStateDto } from "./fundState";
import { ShareStateDto } from "./share";

export class ManagementDto extends FundOverview {
    stateHistory: FundStateDto[];
}