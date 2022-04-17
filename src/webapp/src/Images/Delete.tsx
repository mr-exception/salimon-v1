import React from "react";

const Delete: React.FC<IProps> = ({ fill = "#CCCCCC" }: IProps) => {
  return (
    <svg
      viewBox="0 0 515.556 515.556"
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
    >
      <path d="M64.444 451.111c0 35.526 28.902 64.444 64.444 64.444h257.778c35.542 0 64.444-28.918 64.444-64.444V128.889H64.444zM322.222 32.222V0H193.333v32.222H32.222v64.444h451.111V32.222z" />
    </svg>
  );
};
interface IProps {
  fill?: string;
}
export default Delete;
