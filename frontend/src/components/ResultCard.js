function ResultCard({ title, data }) {
  if (!data) return null;

  return (
    <div className="result-card">
      {title && <h3>{title}</h3>}
      {typeof data === "string" ? (
        <p>{data}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default ResultCard;
