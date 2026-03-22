import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function RepairsPage({
    G,
    goHome,
    vehicle,
    selectedPart,
    goToTutorial,
    categories,
    catFilter,
    setCatFilter,
    visibleParts,
    diffColor,
    diffLabel,
    partsLoading,
    chooseRepairAndShowCompatible,
}) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>Repairs</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("help")} style={G.ghost}>HELP</button>
                    <button onClick={() => setScreen("about")} style={G.ghost}>ABOUT</button>
                </div>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "4px" }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700" }}>REPAIR CATALOG</h2>
                    {selectedPart && !partsLoading && visibleParts.length > 0 && (
                        <div style={{ marginTop: "10px", padding: "10px 12px", border: "1px solid #2a2a2a", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", background: "#111" }}>
                            <span style={{ color: "#888", fontSize: "12px" }}>Selected repair: <span style={{ color: "#ede9e1" }}>{selectedPart.name}</span></span>
                            <button onClick={goToTutorial} style={G.btn("#4a9")}>GO TO TUTORIAL →</button>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setCatFilter(c)} style={G.pill(catFilter === c)}>{c.toUpperCase()}</button>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 120px", gap: "8px", padding: "6px 14px", fontSize: "10px", color: "#444", letterSpacing: "0.1em", borderBottom: "1px solid #1e1e1e", marginBottom: "8px" }}>
                    <span>REPAIR</span><span style={{ textAlign: "center" }}>DIFF</span><span style={{ textAlign: "center" }}>TIME</span><span style={{ textAlign: "right" }}>FROM</span><span />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {visibleParts.map(p => (
                        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 120px", gap: "8px", alignItems: "center", padding: "12px 14px", border: "1px solid #1e1e1e", borderRadius: "3px", background: "#0e0e0e" }}>
                            <div>
                                <div style={{ fontWeight: "700", fontSize: "13px", marginBottom: "3px" }}>{p.name}</div>
                                <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.08em" }}>{p.cat.toUpperCase()}</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <span style={{ fontSize: "11px", color: diffColor[p.diff], fontWeight: "700" }}>{diffLabel[p.diff]}</span>
                            </div>
                            <div style={{ textAlign: "center", fontSize: "12px", color: "#888" }}>{p.time}</div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "13px", fontWeight: "700" }}>${p.am}</div>
                                <div style={{ fontSize: "10px", color: "#444" }}>OEM ${p.oem}</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginLeft: "150px" }}>
                                <button disabled={partsLoading} onClick={() => chooseRepairAndShowCompatible(p)} style={{ ...G.btn(partsLoading ? "#1e1e1e" : "#e8890c"), color: partsLoading ? "#444" : "#0b0b0b", cursor: partsLoading ? "not-allowed" : "pointer" }}>
                                    {partsLoading ? "LOADING..." : "SEE COMPATIBLE PARTS"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
