import { authRequest } from '@api/axiosInstance';
import {
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from '@tanstack/react-query';
import {
  HrTag,
  HoldingStockCardRow,
  HoldingStockGridRow,
  StockImage,
  HoldingStockPrev,
  StockTitle,
  Text,
  TextLeft,
} from '@features/Stock/styledComponent';
import { formatNumber } from '@utils/formatNumber';
import { formatChange } from '@utils/formatChange';
import blueLogo from '@assets/Stock/blueLogo.png';

interface IStockHolding {
  stockId: number;
  stockCode: string;
  stockName: string;
  stockHoldingBuyAmount: number;
  stockHoldingBuyPrice: number;
  stockHoldingChange: number;
  stockHoldingChangeRate: number;
}

interface IApiStockHolding {
  success: boolean;
  data?: IStockHolding;
  errorMsg?: string;
}

const fetchStockHolding = async (
  stockCode: string
): Promise<IApiStockHolding> => {
  const response = await authRequest.get<IApiStockHolding>(
    `/stock/my-holding/${stockCode}`
  );

  if (!response.data.success || !response.data.data) {
    throw new Error('데이터가 존재하지 않습니다.');
  }

  return response.data;
};

const useStockHoldingQuery = (
  stockCode: string,
  options: {
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
): UseSuspenseQueryResult<IApiStockHolding, Error> => {
  return useSuspenseQuery<IApiStockHolding, Error>({
    queryKey: ['my-Holding', stockCode],
    queryFn: () => fetchStockHolding(stockCode),
    ...options,
  });
};

const StockHolding = ({ stockCode }: { stockCode: string }) => {
  const { data } = useStockHoldingQuery(stockCode);
  const stock = data.data;

  const getStockImageUrl = () => {
    if (!stock) return '';
    return `https://thumb.tossinvest.com/image/resized/96x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${stock.stockCode}.png`;
  };

  return (
    <>
      <HrTag />
      <HoldingStockGridRow>
        <HoldingStockCardRow>
          <TextLeft>종목명</TextLeft>
          <Text>보유 수량</Text>
          <Text>1주 평균 금액</Text>
          <Text>투자 원금</Text>
          <Text>평가 금액</Text>
        </HoldingStockCardRow>

        {stock && (
          <HoldingStockCardRow>
            <StockTitle>
              <StockImage
                src={getStockImageUrl()}
                onError={(e) => (e.currentTarget.src = blueLogo)}
                alt=""
              />
              {stock?.stockName}
            </StockTitle>
            <Text>{formatNumber(stock.stockHoldingBuyAmount)}주</Text>
            <Text>{formatNumber(stock.stockHoldingBuyPrice)}원</Text>
            <Text>
              {formatNumber(
                stock.stockHoldingBuyPrice * stock.stockHoldingBuyAmount
              )}
              원
            </Text>
            <HoldingStockPrev
              $isPositive={stock.stockHoldingChange.toString().startsWith('-')}
            >
              {formatChange(formatNumber(stock.stockHoldingChange))}원 (
              {stock.stockHoldingChangeRate.toFixed(2)}%)
            </HoldingStockPrev>
          </HoldingStockCardRow>
        )}
      </HoldingStockGridRow>
    </>
  );
};

export default StockHolding;