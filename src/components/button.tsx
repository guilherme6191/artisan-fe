//<button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-purple-700 text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2">

import classNames from "classnames";

const primaryButtonClasses = "bg-purple-700 text-white hover:bg-purple-500";

const secondaryButtonClasses =
  "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 border border-[#DBDADD]";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, className, variant = "primary", ...props }: Props) {
  const variantCss =
    variant === "primary"
      ? primaryButtonClasses
      : variant === "secondary"
      ? secondaryButtonClasses
      : "";
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-purple-400",
        className,
        variantCss
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button };
