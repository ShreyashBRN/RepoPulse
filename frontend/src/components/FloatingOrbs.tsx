export default function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />
      <div className="orb orb-cyan orb-small" />
    </div>
  );
}

