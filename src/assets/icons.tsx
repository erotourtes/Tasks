export const CloseIcon = ({ className }: { className: string }) => {
  return (
    <svg
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const ArrowIcon = ({ className }: { className: string }) => {
    return (
      <svg
        className={`${className}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        />{" "}
      </svg>
    );
};
