import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function GaragePage({ G, goHome, garage, setScreen, setVehicle, normalizeVehicle, removeVehicleFromGarage, setUseVin, setEditingVehicleKey }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => setScreen("hub")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Dashboard</button>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                </div>
                <button onClick={() => setScreen("selector")} style={G.ghost}>ADD VEHICLE</button>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>GARAGE</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "8px" }}>Saved Vehicles</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Vehicles loaded through VIN, manual selection, or demo are saved locally on this device.</p>
                </div>

                <div style={{ marginBottom: "16px", display: "flex", justifyContent: "flex-start" }}>
                    <button onClick={() => { setEditingVehicleKey(""); setScreen("selector") }} style={G.btn()}>ADD VEHICLE →</button>
                </div>

                {garage.length === 0 ? (
                    <div style={{ border: "1px solid #1e1e1e", borderRadius: "4px", background: "#0e0e0e", padding: "22px" }}>
                        <div style={{ fontSize: "14px", marginBottom: "8px" }}>No saved vehicles yet.</div>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {garage.map(item => (
                            <div key={item.key} style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "16px", background: "#0e0e0e" }}>
                                <div style={{ fontSize: "17px", fontWeight: "700", marginBottom: "5px" }}>{item.year} {item.make} {item.model}{item.trim ? ` ${item.trim}` : ""}</div>
                                <div style={{ color: "#666", fontSize: "12px", marginBottom: "10px" }}>
                                    {item.odometer ? `${item.odometer} miles` : "Odometer not set"}
                                    {item.vin ? ` • VIN ${item.vin}` : ""}
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <button onClick={() => { setVehicle(normalizeVehicle(item)); setScreen("hub") }} style={G.btn()}>LOAD VEHICLE</button>
                                    <button onClick={() => { setVehicle(normalizeVehicle(item)); setUseVin(false); setEditingVehicleKey(item.key); setScreen("selector") }} style={G.ghost}>EDIT</button>
                                    <button onClick={() => removeVehicleFromGarage(item.key)} style={{ ...G.ghost, color: "#a55", borderColor: "#3a2020" }}>REMOVE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
