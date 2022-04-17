import React from "react";

const Info: React.FC<IProps> = ({ fill = "#CCCCCC" }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 310.277 310.277"
      fill={fill}
    >
      <path d="M155.139 0C69.592 0 0 69.598 0 155.139c0 85.547 69.598 155.139 155.139 155.139s155.139-69.592 155.139-155.139S240.686 0 155.139 0zm12.315 248.502h-24.363V114.48h24.363v134.022zM154.721 91.77c-8.58 0-14.678-6.647-14.678-14.953 0-8.58 6.373-15.227 15.227-15.227 9.141 0 14.965 6.647 14.965 15.227.262 8.306-5.824 14.953-15.514 14.953z" />
    </svg>
  );
};
interface IProps {
  fill?: string;
}
export default Info;
