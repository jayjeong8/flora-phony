export function GardenBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="garden-bg-washes absolute inset-0" />
      <div className="garden-bg-ground absolute inset-0" />
      <div className="garden-bg-noise absolute inset-0" />
      <div className="garden-bg-dots absolute inset-0" />
      <div className="garden-bg-particles absolute inset-0" />
    </div>
  );
}
