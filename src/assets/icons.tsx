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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const ArrowIcon = ({ className }: { className: string }) => {
  return (
    <svg className={`${className}`} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />{" "}
    </svg>
  );
};

const LinkIcon = ({ isLinked, className }: { isLinked?: boolean, className: string }) => {
  const linkIcon = (
    <svg className={`${className}`} fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.921 2.081c2.771 2.772 2.771 7.269 0 10.042l-3.84 3.839-2.121-2.122 3.839-3.84c1.599-1.598 1.599-4.199-.001-5.797-1.598-1.599-4.199-1.599-5.797-.001l-3.84 3.839-2.121-2.121 3.84-3.839c2.771-2.773 7.267-2.773 10.041 0zm-8.082 13.879l-3.84 3.839c-1.598 1.6-4.199 1.599-5.799 0-1.598-1.598-1.598-4.2 0-5.797l3.84-3.84-2.121-2.121-3.84 3.84c-2.771 2.772-2.772 7.268 0 10.041 2.773 2.772 7.27 2.773 10.041 0l3.84-3.84-2.121-2.122z"/></svg>
  )

  const unlinkIcon = (
    <svg className={`${className}`} fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.008 21.092l-3.392 1.959c-3.384 1.954-7.713.794-9.668-2.592-1.953-3.385-.793-7.713 2.591-9.667l3.393-1.959 1.495 2.589-3.393 1.96c-1.95 1.125-2.622 3.631-1.495 5.581 1.126 1.953 3.631 2.625 5.582 1.495l3.392-1.956 1.495 2.59zm-3.214-17.553l-1.959 3.392 2.589 1.497 1.959-3.393c1.126-1.95 3.631-2.622 5.581-1.495 1.952 1.127 2.624 3.629 1.499 5.582l-1.96 3.392 2.589 1.494 1.96-3.391c1.952-3.387.792-7.714-2.59-9.667-3.387-1.955-7.716-.795-9.668 2.589zm7.398 20.217l-1.724.244-.523-3.688 1.722-.243.525 3.687zm5.808-7.284l-.249 1.724-3.688-.527.247-1.722 3.69.525zm-5.733 3.013l1.229-1.23 2.638 2.636-1.231 1.23-2.636-2.636z"/></svg>
  )
  return (
    <>
      {isLinked ? linkIcon : unlinkIcon}
    </>
  );
};

export default LinkIcon;
