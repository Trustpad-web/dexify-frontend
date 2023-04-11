import { AssetDto } from './asset';
import { ComptrollerDto } from './comptroller';
import { FundUserDto } from './fundUser';
import { PortfolioDto } from './portfolio';
import { ShareStateDto } from './share';

export interface FundDto {
  id: string;
  name: string;
  accessor: ComptrollerDto;
  creator: FundUserDto;
  manager: FundUserDto;
  portfolio: PortfolioDto;
  inception: string;

  portfolioHistory?: PortfolioDto[];
  lastPortfolio?: PortfolioDto[];
  sharesHistory?: ShareStateDto[];
  lastShare?: ShareStateDto[];

  //
  sharePriceChanges?: number;
  aumChanges?: number;
}

type Monthly = {
  year: number,
  month: number,
  aumChangeBips: number,
  sharePriceChangeBips: number
}

export class FundOverviewWithHistoryResponse {
  id: string;
  name?: string;
  inception: string;
  accessor?: ComptrollerDto;
  creator?: FundUserDto;
  manager?: FundUserDto;
  assets?: (AssetDto & {aum: number})[];
  aum?: number;
  totalShares?: number;

  sparkline?: string;
  sparkline_shares?: string;

  sharePriceChanges?: number;
  aumChanges?: number;

  aumHistory?: number[];
  sharePriceHistory?: number[];
  timeHistory?: number[];

  monthlyStates?: Monthly[];
}


export class FundOverview {
  id: string;
  name: string;
  accessor: ComptrollerDto;
  creator: FundUserDto;
  manager: FundUserDto;
  portfolio: PortfolioDto;
  inception: string;
  aum: number;
  aum1WAgo: number;
  totalShareSupply: number;
  totalShareSupply1WAgo: number;
  sharePrice: number;
  sharePrice1WAgo: number;
  assets: (AssetDto & {aum: number})[];
}