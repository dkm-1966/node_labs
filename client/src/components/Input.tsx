import { FC } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  changeHandler?: <T>(value: T) => void;
}

const Input: FC<InputProps> = ({ changeHandler, ...rest }) => {
  return (
    <input
      className="border-2 border-lime-200 w-full rounded-md p-2 focus:outline-none"
      onChange={(e) => {
        changeHandler?.(e.target.value);
      }}
      {...rest}
    />
  );
};

export default Input;
