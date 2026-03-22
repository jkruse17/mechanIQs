import { FONT_IMPORT_STYLE, YEARS } from "../constants/appData"

export default function SelectorPage({
    G,
    goHome,
    editingVehicleKey,
    vehicle,
    setVehicle,
    allMakes,
    modelsBySelection,
    trimOptions,
    useVin,
    setUseVin,
    vehicleError,
    decodeVIN,
    loadVehicle,
}) {
    const ready = vehicle.year && vehicle.make && vehicle.model && vehicle.trim && vehicle.odometer

    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE}</style>
            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={goHome} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Dashboard</button>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                </div>
                <span style={{ fontSize: "11px", color: "#444", letterSpacing: "0.1em" }}>HACKATHON DEMO · 2025</span>
            </div>
            <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 20px" }}>
                <div style={{ marginBottom: "36px" }}>
                    <div style={{ fontSize: "11px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "10px" }}>VEHICLE-SPECIFIC CAR REPAIR</div>
                    <h1 style={{ fontSize: "30px", fontWeight: "700", lineHeight: "1.2", marginBottom: "10px" }}>{editingVehicleKey ? "Edit your vehicle" : "What are you"}<br />{editingVehicleKey ? "and save changes" : "working on today?"}</h1>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Select your vehicle to get guided repairs, part pricing, and an AI assistant that knows your exact car.</p>
                </div>

                <div
                    onClick={() => loadVehicle({ year: "2026", make: "Honda", model: "Civic", trim: "Sport", odometer: "45000" }, "hub")}
                    style={{ border: "1px solid #e8890c", borderRadius: "4px", padding: "14px 18px", marginBottom: "28px", cursor: "pointer", background: "#0f0a00" }}
                >
                    <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "6px" }}>⚡  QUICK START — DEMO VEHICLE</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>2026 Honda Civic Sport</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>Skip selector and explore all features →</div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#888" }}>
                        <input type="checkbox" checked={useVin} onChange={e => setUseVin(e.target.checked)} />
                        Use VIN instead of manual selection
                    </label>
                </div>

                <div style={{ fontSize: "11px", color: "#444", letterSpacing: "0.1em", marginBottom: "14px" }}>— OR SELECT YOUR VEHICLE —</div>

                {useVin ? (
                    <div style={{ marginBottom: "22px" }}>
                        <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>VIN</label>
                        <input
                            value={vehicle.vin}
                            placeholder="17-character VIN"
                            onChange={e => setVehicle(x => ({ ...x, vin: e.target.value.toUpperCase() }))}
                            style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                        />
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "22px" }}>
                        {[
                            { label: "YEAR", key: "year", opts: YEARS },
                            { label: "MAKE", key: "make", opts: allMakes },
                            { label: "MODEL", key: "model", opts: modelsBySelection },
                        ].map(({ label, key, opts }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</label>
                                <select
                                    value={vehicle[key]}
                                    disabled={key !== "year" && !vehicle.year || key === "model" && !vehicle.make}
                                    onChange={e => {
                                        const v = e.target.value
                                        if (key === "year") setVehicle(x => ({ ...x, year: v, make: "", model: "", trim: "" }))
                                        else if (key === "make") setVehicle(x => ({ ...x, make: v, model: "", trim: "" }))
                                        else setVehicle(x => ({ ...x, model: v, trim: "" }))
                                    }}
                                    style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                                >
                                    <option value="">—</option>
                                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                        <div>
                            <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>TRIM</label>
                            {trimOptions.length > 0 ? (
                                <select
                                    value={vehicle.trim}
                                    disabled={!vehicle.model}
                                    onChange={e => setVehicle(x => ({ ...x, trim: e.target.value }))}
                                    style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                                >
                                    <option value="">—</option>
                                    {trimOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input
                                    value={vehicle.trim}
                                    placeholder="e.g. LX, EX, Touring"
                                    disabled={!vehicle.model}
                                    onChange={e => setVehicle(x => ({ ...x, trim: e.target.value }))}
                                    style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                                />
                            )}
                        </div>
                    </div>
                )}

                <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>CURRENT ODOMETER (MILES)</label>
                    <input
                        type="number"
                        value={vehicle.odometer}
                        placeholder="e.g. 45000"
                        onChange={e => setVehicle(x => ({ ...x, odometer: e.target.value }))}
                        style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                    />
                </div>

                {vehicleError && <p style={{ color: "#e04444", fontSize: "12px", marginBottom: "22px" }}>{vehicleError}</p>}

                <button
                    disabled={useVin ? !vehicle.vin : !ready}
                    onClick={useVin ? decodeVIN : () => loadVehicle(vehicle, "hub")}
                    style={{ ...G.btn(useVin ? vehicle.vin : ready ? "#e8890c" : "#1e1e1e"), color: useVin ? (vehicle.vin ? "#0b0b0b" : "#444") : (ready ? "#0b0b0b" : "#444"), cursor: useVin ? (vehicle.vin ? "pointer" : "not-allowed") : (ready ? "pointer" : "not-allowed"), width: "100%", padding: "13px" }}
                >
                    {useVin ? "DECODE VIN →" : "GO TO DASHBOARD →"}
                </button>
            </div>
        </div>
    )
}
