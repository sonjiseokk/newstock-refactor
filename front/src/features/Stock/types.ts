export interface IApiStock {
  success: boolean;
  data: IStock[];
}

export interface IStock {
  stockCode: string;
  stockName: string;
  stockIndustry: string;
  stckPrpr: number;
  prdyVrss: number;
  prdyCtrt: number;
  acmlTrPbmn: number;
  acmlVol: number;
}

export interface IApiCategory {
  success: boolean;
  data: ICategoryStock[];
}

export interface ICategoryStock {
  industryCode: string;
  industryName: string;
  bstpNmixPrpr: string;
  bstpNmixPrdyVrss: string;
  bstpNmixPrdyCtrt: string;
  acmlTrPbmn: string;
}

export interface ICategory {
  category: {
    industryCode: string;
    industryName: string;
    bstpNmixPrpr: string;
    bstpNmixPrdyVrss: string;
    bstpNmixPrdyCtrt: string;
    acmlTrPbmn: string;
  };
  imageUrl: string;
  imageBgColor: string;
  onClick?: () => void;
}

interface IcategoryDetails {
  url: string;
  bgColor: string;
}
export interface IcategoryImage {
  [key: string]: IcategoryDetails;
}

export interface ICategoryImgWrapper {
  bgColor?: string;
}

export interface IApiFavorite {
  success: boolean;
  data: IFavoriteStock[];
}

export interface IFavoriteStock {
  stockFavoriteId: number;
  stockId: number;
  stockCode: string;
  stockName: string;
}

export interface IMutationContext {
  previousFavoriteList: IFavoriteStock[] | undefined;
}

export interface IApiDaily {
  success: boolean;
  data: IDaily[];
}
export interface IDaily {
  stockId: number;
  stockCode: string;
  stockCandleId: number;
  stockCandleDay: string; // 날짜 형식이 문자열이므로 string으로 처리
  stockCandleOpen: number;
  stockCandleClose: number;
  stockCandleHigh: number;
  stockCandleLow: number;
}

export interface IApiLive {
  success: boolean;
  data: ILive[];
}

export interface ILive {
  id: string;
  stockCode: string;
  stockName: string;
  stockIndustry: string;
  stckPrpr: string;
  time: string; // 시간 형식이 문자열로 제공됨
}

// export interface IChartData {
//   stockCandleDtoList: IDaily[];
//   stocksPriceLiveDailyChartRedisDtoList: ILive[];
// }

// export interface OutletContext {
//   chartData: IChartData; // IChartData는 stockCandleDtoList를 포함하는 데이터 구조
// }

export interface FormValues {
  price: number;
  amount: number;
}

export interface TradeFormProps {
  price: number;
  stockCode: string;
}

export interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buySuccess?: boolean;
  sellSuccess?: boolean;
  price?: number;
  amount?: number;
}

export interface CategoryModalProps {
  onClose: () => void;
  category: ICategoryStock;
}

export interface ChartLinkProps {
  stock: IStock;
}

// 차트 유사도 부분
export interface ICandleData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

export interface ISimilarityStockData {
  stockCode: string;
  similarityScore: number;
  startDate: string;
  endDate: string;
  candleData: ICandleData[];
}

export interface SimilaritySearchResponse {
  baseStock: ISimilarityStockData;
  otherStock: ISimilarityStockData[];
}

export interface SimilaritySearchParams {
  stockCode: string;
  start_date?: string;
  end_date?: string;
}

export interface SimilarityFormValues {
  start_date: string;
  end_date: string;
}
// chart Query 부분
export interface ChartDateParams {
  startDate: string | undefined;
  endDate: string | undefined;
}