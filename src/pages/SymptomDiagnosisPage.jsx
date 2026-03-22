import { FONT_IMPORT_STYLE } from "../constants/appData"

export default function SymptomDiagnosisPage({
    G,
    goHome,
    vehicle,
    msgs,
    loading,
    input,
    setInput,
    sendDiagnosis,
    chatEl,
    clearDiagnosis,
    setScreen,
}) {
    const quickPrompts = [
        "Grinding noise when braking at low speed",
        "Engine cranks but won't start after rain",
        "Vibration at 65 mph, smooth below 50",
        "CEL on with rough idle and fuel smell",
    ]

    return (
        <div style={{ ...G.app, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <style>{`${FONT_IMPORT_STYLE} ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }`}</style>

            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => setScreen("hub")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Dashboard</button>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ AI Symptom Diagnosis</span>
                </div>
                <button onClick={clearDiagnosis} style={G.ghost}>CLEAR CHAT</button>
            </div>

            <div style={{ maxWidth: "920px", width: "100%", margin: "0 auto", padding: "22px 20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1, minHeight: 0 }}>
                <div style={{ border: "1px solid #1e1e1e", borderRadius: "4px", padding: "14px", background: "#090909" }}>
                    <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "4px" }}>VEHICLE-AWARE DIAGNOSIS</div>
                    <div style={{ fontSize: "12px", color: "#777", lineHeight: "1.5" }}>
                        Context loaded: {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ""}. Describe symptoms and get ranked likely causes + next checks.
                    </div>
                </div>

                <div ref={chatEl} style={{ flex: 1, minHeight: 0, overflowY: "auto", border: "1px solid #1e1e1e", borderRadius: "4px", background: "#070707", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {msgs.map((m, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                            <div style={{ maxWidth: "88%", padding: "9px 12px", borderRadius: "3px", fontSize: "12px", lineHeight: "1.65", background: m.role === "user" ? "#140e00" : "#101010", border: `1px solid ${m.role === "user" ? "#3a2800" : "#1e1e1e"}`, color: m.role === "user" ? "#f0cc70" : "#c8c4bc", whiteSpace: "pre-wrap" }}>
                                {m.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div style={{ display: "flex" }}>
                            <div style={{ padding: "8px 11px", borderRadius: "3px", background: "#111", border: "1px solid #1e1e1e", fontSize: "12px", color: "#e8890c", fontStyle: "italic" }}>
                                analyzing symptoms...
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {quickPrompts.map(q => (
                        <button
                            key={q}
                            onClick={() => sendDiagnosis(q)}
                            style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666", padding: "5px 9px", borderRadius: "2px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.04em" }}
                        >
                            {q}
                        </button>
                    ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendDiagnosis(input)}
                        placeholder="Describe the symptom, when it happens, and any warning lights..."
                        style={{ flex: 1, background: "#111", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "10px 12px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none", minWidth: 0 }}
                    />
                    <button onClick={() => sendDiagnosis(input)} style={{ ...G.btn("#e8890c"), padding: "10px 14px" }}>
                        DIAGNOSE
                    </button>
                </div>
            </div>
        </div>
    )
}
