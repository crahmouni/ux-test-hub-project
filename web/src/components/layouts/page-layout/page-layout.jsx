function PageLayout({ children, className = "", style = {} }) {
  return (
    <div className={`container py-4 ${className}`} style={style}>
      {children}
    </div>
  );
}

export default PageLayout;