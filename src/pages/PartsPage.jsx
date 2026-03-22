import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function PartsPage({ G, goHome, vehicle, partsLoading, partsError, categories, catFilter, setCatFilter, visibleParts, diffColor, diffLabel, startRepair, selectedPart, choosePartOnly, goToTutorial }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ Parts</span>
                </div>
                <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </div>
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "4px" }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700" }}>COMPATIBLE PARTS</h2>
                    {selectedPart && (
                        <div style={{ marginTop: "10px", padding: "10px 12px", border: "1px solid #2a2a2a", borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", background: "#111" }}>
                            <span style={{ color: "#888", fontSize: "12px" }}>Selected: <span style={{ color: "#ede9e1" }}>{selectedPart.name}</span></span>
                            <button onClick={goToTutorial} style={G.btn("#4a9")}>GO TO TUTORIAL →</button>
                        </div>
                    )}
                    {partsLoading && (
                        <p style={{ color: "#888", fontSize: "12px", marginTop: "10px" }}>Loading selected part options from RockAuto...</p>
                    )}
                    {partsError && (
                        <p style={{ color: "#e04444", fontSize: "12px", marginTop: "10px" }}>{partsError}. Showing fallback catalog.</p>
                    )}
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                    {categories.map(c => (
                        <button key={c} onClick={() => setCatFilter(c)} style={G.pill(catFilter === c)}>{c.toUpperCase()}</button>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px 120px", gap: "8px", padding: "6px 14px", fontSize: "10px", color: "#444", letterSpacing: "0.1em", borderBottom: "1px solid #1e1e1e", marginBottom: "8px" }}>
                    <span>PART</span><span style={{ textAlign: "center" }}>DIFF</span><span style={{ textAlign: "center" }}>TIME</span><span style={{ textAlign: "right" }}>FROM</span><span style={{ textAlign: "right" }}>CSAT</span><span />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {visibleParts.map(p => (
                        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 90px 120px", gap: "8px", alignItems: "center", padding: "12px 14px", border: "1px solid #1e1e1e", borderRadius: "3px", background: "#0e0e0e" }}>
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
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "13px", color: p.csat >= 90 ? "#4a9" : "#888", fontWeight: "700" }}>{p.csat}%</div>
                                <div style={{ fontSize: "10px", color: "#444" }}>success</div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                {p.hasGuide ? (
                                    <button disabled={partsLoading} onClick={() => startRepair(p)} style={{ ...G.btn(partsLoading ? "#1e1e1e" : "#e8890c"), color: partsLoading ? "#444" : "#0b0b0b", cursor: partsLoading ? "not-allowed" : "pointer" }}>
                                        {partsLoading ? "LOADING..." : "START REPAIR"}
                                    </button>
                                ) : (
                                    <button onClick={() => choosePartOnly(p)} style={selectedPart?.id === p.id ? G.btn("#4a9") : G.btn("#303030")}>
                                        {selectedPart?.id === p.id ? "SELECTED" : "SELECT PART"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
