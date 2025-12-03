const LoadingIcon = ({ py, text }: { py?: string; text?: string }) => {
  return (
    <div className={`flex items-center justify-center ${py ? py : "py-12"}`}>
      <p className="animate-spin">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-loader-circle-icon lucide-loader-circle"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </p>
      <span className="ml-2">{text && `${text}`}</span>
    </div>
  );
};

export default LoadingIcon;
