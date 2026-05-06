function PageShell({ title, description, children }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      {description && (
        <p className="text-muted text-base mb-10">{description}</p>
      )}
      {children}
    </section>
  );
}

export default PageShell;
