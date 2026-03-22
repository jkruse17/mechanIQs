import { FONT_IMPORT_STYLE } from "../constants/appData"

export default function RepairPage({
    G,
    goHome,
    selectedPart,
    vehicle,
    guide,
    step,
    done,
    setStep,
    completeStep,
    setScreen,
    msgs,
    loading,
    sendAI,
    input,
    setInput,
    chatEl,
}) {
    const cur = guide[step]
    const allDone = done.length === guide.length
    const quickPrompts = ["What torque spec?", "Any gotchas here?", "Can I skip this?", "What could go wrong?"]

    return (
        <div style={{ ...G.app, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <style>{`${FONT_IMPORT_STYLE} ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }`}</style>

            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => setScreen("parts")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Parts</button>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ {selectedPart.name}</span>
                </div>
                <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </div>

            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", gap: "3px", padding: "14px 20px 0", flexShrink: 0 }}>
                        {guide.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setStep(i)}
                                style={{ flex: 1, height: "3px", background: done.includes(i) ? "#4a9" : i === step ? "#e8890c" : "#2a2a2a", borderRadius: "2px", cursor: "pointer", transition: "background 0.2s" }}
                            />
                        ))}
                    </div>

                    <div style={{ padding: "20px", flex: 1 }}>
                        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "4px" }}>
                            STEP {step + 1} OF {guide.length} — {done.includes(step) ? <span style={{ color: "#4a9" }}>DONE</span> : "IN PROGRESS"}
                        </div>
                        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "14px", lineHeight: "1.2" }}>{cur.title}</h2>
                        <p style={{ color: "#aaa", lineHeight: "1.75", fontSize: "13px", marginBottom: "18px" }}>{cur.detail}</p>

                        {cur.gotcha && (
                            <div style={{ border: "1px solid #5a2a00", background: "#120a00", borderRadius: "3px", padding: "12px 14px", marginBottom: "18px", fontSize: "12px", color: "#e8a040", lineHeight: "1.6" }}>
                                {cur.gotcha}
                            </div>
                        )}

                        {cur.tools.length > 0 && (
                            <div style={{ border: "1px solid #1e1e1e", borderRadius: "3px", padding: "14px", marginBottom: "20px" }}>
                                <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "10px" }}>TOOLS NEEDED</div>
                                {cur.tools.map(t => (
                                    <div key={t} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", borderBottom: "1px solid #141414", fontSize: "12px", color: "#aaa" }}>
                                        <span style={{ color: "#333", fontWeight: "700" }}>▸</span> {t}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                            {step > 0 && (
                                <button onClick={() => setStep(s => s - 1)} style={{ ...G.ghost, padding: "10px 18px", fontSize: "12px" }}>← PREV</button>
                            )}
                            {!allDone ? (
                                <button
                                    onClick={completeStep}
                                    style={G.btn(done.includes(step) ? "#1e1e1e" : "#e8890c")}
                                >
                                    {done.includes(step) ? "✓ DONE — NEXT STEP →" : step === guide.length - 1 ? "COMPLETE FINAL STEP ✓" : "COMPLETE STEP →"}
                                </button>
                            ) : (
                                <button onClick={() => setScreen("hub")} style={G.btn("#4a9")}>
                                    ✓ JOB COMPLETE — BACK TO HUB
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px 20px", flexShrink: 0 }}>
                        <div style={{ fontSize: "10px", color: "#444", letterSpacing: "0.1em", marginBottom: "10px" }}>ALL STEPS</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {guide.map((s, i) => (
                                <div
                                    key={i}
                                    onClick={() => setStep(i)}
                                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", cursor: "pointer" }}
                                >
                                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: done.includes(i) ? "#4a9" : i === step ? "#e8890c" : "#1e1e1e", border: `1px solid ${done.includes(i) ? "#4a9" : i === step ? "#e8890c" : "#2a2a2a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: (done.includes(i) || i === step) ? "#0b0b0b" : "#444", fontWeight: "700", flexShrink: 0 }}>
                                        {done.includes(i) ? "✓" : i + 1}
                                    </div>
                                    <span style={{ fontSize: "12px", color: i === step ? "#ede9e1" : done.includes(i) ? "#4a9" : "#555", lineHeight: "1.4" }}>{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: "300px", borderLeft: "1px solid #1e1e1e", display: "flex", flexDirection: "column", background: "#080808", flexShrink: 0 }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
                        <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "3px" }}>AI REPAIR ASSISTANT</div>
                        <div style={{ fontSize: "11px", color: "#444", lineHeight: "1.4" }}>Stays in context. Ask anything about this step.</div>
                    </div>

                    <div ref={chatEl} style={{ flex: 1, overflowY: "auto", padding: "14px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {msgs.map((m, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{ maxWidth: "88%", padding: "8px 11px", borderRadius: "3px", fontSize: "12px", lineHeight: "1.65", background: m.role === "user" ? "#140e00" : "#111111", border: `1px solid ${m.role === "user" ? "#3a2800" : "#1e1e1e"}`, color: m.role === "user" ? "#f0cc70" : "#c8c4bc" }}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: "flex" }}>
                                <div style={{ padding: "8px 11px", borderRadius: "3px", background: "#111", border: "1px solid #1e1e1e", fontSize: "12px", color: "#e8890c", fontStyle: "italic" }}>
                                    thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: "8px 10px", display: "flex", flexWrap: "wrap", gap: "5px", borderTop: "1px solid #141414", flexShrink: 0 }}>
                        {quickPrompts.map(q => (
                            <button key={q} onClick={() => sendAI(q)} style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666", padding: "4px 8px", borderRadius: "2px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.04em" }}>{q}</button>
                        ))}
                    </div>

                    <div style={{ padding: "10px 12px", borderTop: "1px solid #1e1e1e", display: "flex", gap: "6px", flexShrink: 0 }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendAI(input)}
                            placeholder="Ask about this step..."
                            style={{ flex: 1, background: "#111", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none", minWidth: 0 }}
                        />
                        <button onClick={() => sendAI(input)} style={{ background: "#e8890c", border: "none", color: "#0b0b0b", padding: "8px 12px", borderRadius: "3px", cursor: "pointer", fontWeight: "700", fontFamily: "inherit", fontSize: "12px", flexShrink: 0 }}>→</button>
                    </div>
                </div>

            </div>
        </div>
    )
}
