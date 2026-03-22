import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function HubPage({ G, goHome, vehicle, garage, setScreen, selectedPart }) {
    const hasVehicle = Boolean(vehicle.year && vehicle.make && vehicle.model)
    const hasTutorial = Boolean(selectedPart)
    const tiles = [
        { icon: "＋", label: "Add Vehicle", sub: "Load by VIN or manual selection", action: () => setScreen("selector"), live: true },
        { icon: "▣", label: "Garage", sub: `${garage.length} saved vehicle${garage.length === 1 ? "" : "s"}`, action: () => setScreen("garage"), live: true },
        { icon: "⬢", label: "Repairs", sub: "Pick a job and start tutorial", action: () => setScreen("repairs"), live: hasVehicle },
        { icon: "⬡", label: "Compatible Parts", sub: "RockAuto results for selected repair", action: () => setScreen("parts"), live: hasVehicle },
        { icon: "◈", label: "AI Symptom Diagnosis", sub: hasVehicle ? "Describe it - get ranked causes" : "Load a vehicle to unlock diagnosis", action: () => setScreen("diagnosis"), live: hasVehicle },
        { icon: "▸", label: "Tutorial", sub: hasTutorial ? `Resume ${selectedPart.name}` : "Pick a part first to start tutorial", action: () => setScreen("repair"), live: hasTutorial, badge: hasTutorial ? null : "LOCKED" },
        { icon: "◷", label: "Maintenance Schedule", sub: "Upcoming services by mileage", action: () => setScreen("maintenance"), live: hasVehicle },
        { icon: "⚠", label: "Recalls", sub: "Check active recalls for your vehicle", action: () => setScreen("recalls"), live: hasVehicle },
        { icon: "⚑", label: "OBD-II Code Lookup", sub: "Paste a fault code for plain English", action: () => setScreen("obdLookup"), live: true },
    ]

    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>Dashboard</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("help")} style={G.ghost}>HELP</button>
                    <button onClick={() => setScreen("about")} style={G.ghost}>ABOUT</button>
                </div>
            </div>
            <div style={{ maxWidth: "960px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>{hasVehicle ? "VEHICLE LOADED" : "DASHBOARD"}</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700" }}>
                        {hasVehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}` : "Load a vehicle to unlock maintenance and parts"}
                    </h2>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                    {tiles.map(t => (
                        <div
                            key={t.label}
                            onClick={t.live ? t.action : undefined}
                            style={{ border: `1px solid ${t.live ? "#2a2a2a" : "#181818"}`, borderRadius: "4px", padding: "22px 18px", cursor: t.live ? "pointer" : "default", background: "#0e0e0e", position: "relative", transition: "border-color 0.15s" }}
                            onMouseEnter={e => t.live && (e.currentTarget.style.borderColor = "#e8890c")}
                            onMouseLeave={e => e.currentTarget.style.borderColor = t.live ? "#2a2a2a" : "#181818"}
                        >
                            {!t.live && <span style={{ position: "absolute", top: "10px", right: "12px", fontSize: "9px", color: "#444", letterSpacing: "0.1em" }}>{t.badge || "COMING SOON"}</span>}
                            <div style={{ fontSize: "22px", marginBottom: "12px", color: t.live ? "#e8890c" : "#333" }}>{t.icon}</div>
                            <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "5px", color: t.live ? "#ede9e1" : "#444" }}>{t.label}</div>
                            <div style={{ color: t.live ? "#666" : "#333", fontSize: "12px", lineHeight: "1.5" }}>{t.sub}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
