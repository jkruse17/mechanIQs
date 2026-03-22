import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function MaintenancePage({ G, goHome, vehicle, maintenanceList, setScreen }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ Maintenance</span>
                </div>
                <button onClick={() => setScreen("selector")} style={G.ghost}>CHANGE VEHICLE</button>
            </div>
            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>MAINTENANCE SCHEDULE</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700" }}>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Current odometer: {vehicle.odometer} miles</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {maintenanceList.map(item => (
                        <div key={item.name} style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "18px", background: "#0e0e0e" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{item.name}</div>
                                    <div style={{ fontSize: "12px", color: "#555" }}>Every {item.interval.toLocaleString()} miles • {item.category}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "14px", color: item.isDue ? "#e8890c" : "#888", fontWeight: "700" }}>{item.isDue ? "DUE NOW" : `Due at ${item.nextDue.toLocaleString()} miles`}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: "32px", textAlign: "center" }}>
                    <button onClick={() => setScreen("repairs")} style={G.btn()}>BROWSE REPAIR CATALOG →</button>
                </div>
            </div>
        </div>
    )
}
