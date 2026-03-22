export default function Sidebar({ screen, setScreen, vehicle, selectedPart, G }) {
    const hasVehicle = Boolean(vehicle.year && vehicle.make && vehicle.model)
    const hasPart = Boolean(selectedPart)

    const navItems = [
        { key: "hub", icon: "⌂", label: "Dashboard", locked: false },
        { key: "selector", icon: "＋", label: "Add Vehicle", locked: false },
        { key: "garage", icon: "▣", label: "Garage", locked: false },
        { key: "repairs", icon: "⬢", label: "Repairs", locked: !hasVehicle },
        { key: "parts", icon: "⬡", label: "Parts", locked: !hasVehicle },
        { key: "maintenance", icon: "◷", label: "Maintenance", locked: !hasVehicle },
        { key: "recalls", icon: "⚠", label: "Recalls", locked: !hasVehicle },
        { key: "diagnosis", icon: "◈", label: "Diagnosis", locked: !hasVehicle },
        { key: "obdLookup", icon: "⚑", label: "OBD-II", locked: false },
        { key: "repair", icon: "▸", label: "Tutorial", locked: !hasPart },
    ]

    return (
        <div style={{
            width: "180px",
            background: "#0e0e0e",
            borderRight: "1px solid #2a2a2a",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
            justifyContent: "center",
            fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
            position: "sticky",
            top: 0,
            height: "100vh",
        }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap');`}</style>
            {navItems.map(item => (
                <button
                    key={item.key}
                    onClick={() => !item.locked && setScreen(item.key)}
                    style={{
                        textAlign: "left",
                        background: screen === item.key ? "#e8890c" : "transparent",
                        border: `1px solid ${screen === item.key ? "#e8890c" : item.locked ? "#1a1a1a" : "#2a2a2a"}`,
                        color: screen === item.key ? "#0b0b0b" : item.locked ? "#333" : "#ede9e1",
                        padding: "10px 12px",
                        borderRadius: "3px",
                        cursor: item.locked ? "default" : "pointer",
                        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
                        fontSize: "12px",
                        fontWeight: screen === item.key ? "700" : "400",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.15s",
                        opacity: item.locked ? 0.5 : 1,
                    }}
                    disabled={item.locked}
                    onMouseEnter={e => !item.locked && (e.currentTarget.style.borderColor = "#e8890c")}
                    onMouseLeave={e => e.currentTarget.style.borderColor = screen === item.key ? "#e8890c" : "#2a2a2a"}
                >
                    <span style={{ fontSize: "14px" }}>{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    )
}
