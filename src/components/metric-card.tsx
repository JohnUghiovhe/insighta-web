type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  accent?: string;
};

export function MetricCard({ label, value, note, accent = "cyan" }: MetricCardProps) {
  return (
    <article className={`metric-card accent-${accent}`}>
      <p className="metric-label">{label}</p>
      <strong className="metric-value">{value}</strong>
      <p className="metric-note">{note}</p>
    </article>
  );
}