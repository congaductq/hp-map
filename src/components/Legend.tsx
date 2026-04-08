export function Legend() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        left: 12,
        background: "white",
        padding: "10px 14px",
        borderRadius: 6,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        fontSize: 12,
        zIndex: 1,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: "#333" }}>
        Ring Roads
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div style={{ width: 24, height: 3, background: "#22c55e" }} />
        <span style={{ color: "#555" }}>Completed</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <div
          style={{
            width: 24,
            height: 3,
            backgroundImage:
              "repeating-linear-gradient(90deg, #f59e0b 0, #f59e0b 6px, transparent 6px, transparent 10px)",
          }}
        />
        <span style={{ color: "#555" }}>In Progress</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 24,
            height: 3,
            backgroundImage:
              "repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 3px, transparent 3px, transparent 7px)",
          }}
        />
        <span style={{ color: "#555" }}>Planned</span>
      </div>
    </div>
  );
}
