import { HeartWrapper } from "@features/Stock/styledComponent";

interface IHeartFill {
  cancleFavoriteStock?: () => void;
}

export const HeartFill = ({cancleFavoriteStock}:IHeartFill) => {
  return (
    <HeartWrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.5rem"
        height="1.5rem"
        viewBox="0 0 30 30"
        fill="none"
        // style={{ cursor: cancleFavoriteStock ? 'pointer' : 'default' }}
        onClick={cancleFavoriteStock}
        style={{ cursor: 'pointer' }}
      >
        <path
          d="M15 26.6875L13.1875 25.0375C6.75 19.2 2.5 15.3375 2.5 10.625C2.5 6.7625 5.525 3.75 9.375 3.75C11.55 3.75 13.6375 4.7625 15 6.35C16.3625 4.7625 18.45 3.75 20.625 3.75C24.475 3.75 27.5 6.7625 27.5 10.625C27.5 15.3375 23.25 19.2 16.8125 25.0375L15 26.6875Z"
          fill="#F63C3C"
        />
      </svg>
    </HeartWrapper>
  );
};
