import React from "react";

const DownloadIcon: React.FC<IProps> = ({ fill = "#010002" }: IProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.827 49.827">
      <path
        d="M44.939 41.327c0 4.687-3.813 8.5-8.5 8.5H13.388c-4.687 0-8.5-3.813-8.5-8.5a3.5 3.5 0 117 0c0 .827.673 1.5 1.5 1.5h23.051c.827 0 1.5-.673 1.5-1.5a3.5 3.5 0 117 0zm-22.5-7.025a3.503 3.503 0 004.95 0l10.333-10.334a3.5 3.5 0 00-4.949-4.95l-4.358 4.358V3.5a3.5 3.5 0 10-7 0v19.877l-4.359-4.359a3.5 3.5 0 10-4.95 4.95l10.333 10.334z"
        fill={fill}
      />
    </svg>
  );
};

interface IProps {
  fill?: string;
}
export default DownloadIcon;
