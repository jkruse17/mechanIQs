import { useState, useEffect, useRef } from "react"

const MODELS_BY_MAKE = {
    Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot"],
    Toyota: ["Camry", "Corolla", "RAV4", "Prius", "Tacoma"],
    Ford: ["F-150", "Mustang", "Explorer", "Bronco", "Escape"],
    Chevrolet: ["Silverado", "Equinox", "Malibu", "Tahoe", "Traverse"],
    BMW: ["3 Series", "5 Series", "X3", "X5", "M3"],
    Subaru: ["Outback", "Forester", "Crosstrek", "Impreza", "WRX"],
    Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-30", "MX-5 Miata"],
}

const PARTS = [
    { id: 1, name: "Front Brake Pads", cat: "Brakes", diff: 2, time: "1.5 hrs", oem: 85, am: 35, csat: 87, hasGuide: true },
    { id: 2, name: "Engine Air Filter", cat: "Engine", diff: 1, time: "15 min", oem: 32, am: 18, csat: 96, hasGuide: false },
    { id: 3, name: "Oil & Filter Change", cat: "Engine", diff: 1, time: "30 min", oem: 55, am: 28, csat: 94, hasGuide: false },
    { id: 4, name: "Cabin Air Filter", cat: "HVAC", diff: 1, time: "10 min", oem: 38, am: 16, csat: 98, hasGuide: false },
    { id: 5, name: "Spark Plugs (4)", cat: "Engine", diff: 2, time: "45 min", oem: 48, am: 22, csat: 82, hasGuide: false },
    { id: 6, name: "Wiper Blades", cat: "Exterior", diff: 1, time: "5 min", oem: 28, am: 14, csat: 99, hasGuide: false },
    { id: 7, name: "Rear Brake Pads", cat: "Brakes", diff: 2, time: "1.5 hrs", oem: 80, am: 32, csat: 85, hasGuide: false },
    { id: 8, name: "Battery Replacement", cat: "Electrical", diff: 1, time: "20 min", oem: 180, am: 95, csat: 91, hasGuide: false },
]

const GUIDE = [
    {
        title: "Gather tools & supplies",
        detail: "Everything you need before you start. Missing a tool mid-job is the #1 cause of frustration. 5 minutes now saves 30 later.",
        tools: ["12mm socket & ratchet", "C-clamp or brake piston tool", "Brake cleaner spray", "Nitrile gloves", "Torque wrench (80–100 ft-lb)", "Wire or bungee cord (to hang caliper)"],
        gotcha: null,
    },
    {
        title: "Loosen lug nuts (car still on ground)",
        detail: "Break loose all lug nuts on the target wheel before jacking the car up. With the wheel on the ground it won't spin. Just crack them — don't remove yet.",
        tools: ["Lug wrench or 19mm socket"],
        gotcha: null,
    },
    {
        title: "Jack up and secure on stands",
        detail: "Use the manufacturer's jack point — usually a reinforced pinch weld or subframe pad marked in your owner's manual. Place a jack stand before doing any work near the wheel. Never work under a car held only by a floor jack.",
        tools: ["Floor jack", "Jack stands (2 minimum)"],
        gotcha: "⚠ Jack point varies by trim. On the Civic, avoid jacking directly on the sill — use the reinforced triangular notch.",
    },
    {
        title: "Remove wheel",
        detail: "Finish spinning off the lug nuts and pull the wheel straight off the hub. Set it flat nearby — do not lean it against the car where it could fall.",
        tools: [],
        gotcha: null,
    },
    {
        title: "Remove caliper bolts & hang caliper",
        detail: "The caliper slides on two guide pin bolts (usually 12mm hex). Remove them and pivot the caliper up and away from the rotor. IMPORTANT: hang it with a wire or bungee from the spring — never let it dangle from the rubber brake hose, which can crack and cause brake failure.",
        tools: ["12mm socket", "Wire or bungee cord"],
        gotcha: "⚠ On some Civics the lower pin bolt has a rubber dust cover. Remove it carefully before applying the socket — stripping it costs ~$40 at the dealer.",
    },
    {
        title: "Slide out old brake pads",
        detail: "The pads clip into the caliper bracket. Note their orientation before removing — both inner and outer pads are slightly different. Inspect the rotor surface: light rust is normal, but deep grooves or scoring > 2mm means you need new rotors too.",
        tools: [],
        gotcha: null,
    },
    {
        title: "Compress the brake piston",
        detail: "New pads are thicker, so the caliper piston must be pushed back in. Use a C-clamp with an old pad as a spacer, or a dedicated piston tool for twin-piston calipers. Before you start, remove about 20ml of fluid from the brake reservoir with a turkey baster — it will overflow when you push the piston back.",
        tools: ["C-clamp + old pad", "Turkey baster or fluid extractor"],
        gotcha: "⚠ Do NOT crack the bleeder screw to compress the piston unless you plan to bleed the brakes fully. Pushing fluid backward into the ABS module can damage it.",
    },
    {
        title: "Install new pads & reassemble",
        detail: "Apply brake lubricant to the pad contact points on the bracket (not the friction surface). Clip new pads in, seat the caliper over them, reinstall guide pin bolts. Torque caliper bolts to 25 ft-lb. Reinstall wheel and torque lug nuts to 80 ft-lb in a star pattern. Before driving: pump the brake pedal 10–15 times until it feels firm.",
        tools: ["Torque wrench"],
        gotcha: "⚠ Before moving the car: pump the brake pedal until firm resistance returns. Forgetting this step means no brakes on the first press.",
    },
]

const DIFF_LABEL = ["", "Easy", "Moderate", "Hard"]
const DIFF_COLOR = ["", "#4a9", "#e8a020", "#e04444"]

export default function MechanIqs() {
    const [screen, setScreen] = useState("selector")
    const [vehicle, setVehicle] = useState({ year: "", make: "", model: "" })
    const [selectedPart, setSelectedPart] = useState(null)
    const [step, setStep] = useState(0)
    const [done, setDone] = useState([])
    const [msgs, setMsgs] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [catFilter, setCatFilter] = useState("All")
    const chatEl = useRef(null)

    useEffect(() => {
        if (chatEl.current) chatEl.current.scrollTop = chatEl.current.scrollHeight
    }, [msgs])

    const sendAI = async (text) => {
        if (!text.trim() || loading) return
        const cur = GUIDE[step]
        const newMsgs = [...msgs, { role: "user", content: text }]
        setMsgs(newMsgs)
        setInput("")
        setLoading(true)
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: `You are MECHANIQS AI — a focused, practical car repair assistant. The user is working on a ${vehicle.year} ${vehicle.make} ${vehicle.model}. Current job: ${selectedPart?.name}. Current step (${step + 1}/${GUIDE.length}): "${cur?.title}". Step notes: "${cur?.detail}". Known gotcha: "${cur?.gotcha || 'none'}". Be direct and concise — under 120 words unless a safety point demands more. No markdown bullets unless listing tools. Address safety first when relevant.`,
                    messages: newMsgs,
                }),
            })
            const data = await res.json()
            setMsgs([...newMsgs, { role: "assistant", content: data.content?.[0]?.text || "No response — try again." }])
        } catch {
            setMsgs([...newMsgs, { role: "assistant", content: "Connection error. Check your network." }])
        }
        setLoading(false)
    }

    const startRepair = (part) => {
        setSelectedPart(part)
        setStep(0)
        setDone([])
        setMsgs([{
            role: "assistant",
            content: `Ready. I've got context on your ${vehicle.year} ${vehicle.make} ${vehicle.model} and the ${part.name} job. Ask me anything — torque specs, gotchas, whether something looks right, or if it's safe to skip a step. Let's get it done.`,
        }])
        setScreen("repair")
    }

    const completeStep = () => {
        setDone(d => [...d, step])
        if (step < GUIDE.length - 1) setStep(s => s + 1)
    }

    const categories = ["All", ...new Set(PARTS.map(p => p.cat))]
    const visibleParts = catFilter === "All" ? PARTS : PARTS.filter(p => p.cat === catFilter)

    const G = {
        app: { minHeight: "100vh", background: "#0b0b0b", color: "#ede9e1", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontSize: "14px" },
        topbar: { height: "48px", borderBottom: "1px solid #222", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
        logo: { fontWeight: "700", fontSize: "16px", letterSpacing: "0.06em", color: "#e8890c" },
        ghost: { background: "none", border: "1px solid #2a2a2a", color: "#666", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.04em" },
        pill: (active) => ({ background: active ? "#e8890c" : "#161616", border: `1px solid ${active ? "#e8890c" : "#2a2a2a"}`, color: active ? "#0b0b0b" : "#888", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: active ? "700" : "400", letterSpacing: "0.05em" }),
        btn: (color = "#e8890c") => ({ background: color, border: "none", color: "#0b0b0b", padding: "10px 22px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700", fontSize: "12px", letterSpacing: "0.06em" }),
    }

    // ─── SELECTOR ──────────────────────────────────────────────────
    if (screen === "selector") {
        const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"]
        const makes = Object.keys(MODELS_BY_MAKE)
        const models = vehicle.make ? MODELS_BY_MAKE[vehicle.make] : []
        const ready = vehicle.year && vehicle.make && vehicle.model
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
                <div style={G.topbar}>
                    <span style={G.logo}>MECHANIQS</span>
                    <span style={{ fontSize: "11px", color: "#444", letterSpacing: "0.1em" }}>HACKATHON DEMO · 2025</span>
                </div>
                <div style={{ maxWidth: "520px", margin: "0 auto", padding: "48px 20px" }}>
                    <div style={{ marginBottom: "36px" }}>
                        <div style={{ fontSize: "11px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "10px" }}>VEHICLE-SPECIFIC CAR REPAIR</div>
                        <h1 style={{ fontSize: "30px", fontWeight: "700", lineHeight: "1.2", marginBottom: "10px" }}>What are you<br />working on today?</h1>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Select your vehicle to get guided repairs, part pricing, and an AI assistant that knows your exact car.</p>
                    </div>

                    {/* Quick demo tile */}
                    <div
                        onClick={() => { setVehicle({ year: "2026", make: "Honda", model: "Civic" }); setScreen("hub") }}
                        style={{ border: "1px solid #e8890c", borderRadius: "4px", padding: "14px 18px", marginBottom: "28px", cursor: "pointer", background: "#0f0a00" }}
                    >
                        <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "6px" }}>⚡  QUICK START — DEMO VEHICLE</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>2026 Honda Civic Sport Hybrid</div>
                        <div style={{ fontSize: "12px", color: "#555" }}>Skip selector and explore all features →</div>
                    </div>

                    <div style={{ fontSize: "11px", color: "#444", letterSpacing: "0.1em", marginBottom: "14px" }}>— OR SELECT YOUR VEHICLE —</div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "22px" }}>
                        {[
                            { label: "YEAR", key: "year", opts: years },
                            { label: "MAKE", key: "make", opts: makes },
                            { label: "MODEL", key: "model", opts: models },
                        ].map(({ label, key, opts }) => (
                            <div key={key}>
                                <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</label>
                                <select
                                    value={vehicle[key]}
                                    disabled={key !== "year" && !vehicle.year || key === "model" && !vehicle.make}
                                    onChange={e => {
                                        const v = e.target.value
                                        if (key === "year") setVehicle({ year: v, make: "", model: "" })
                                        else if (key === "make") setVehicle(x => ({ ...x, make: v, model: "" }))
                                        else setVehicle(x => ({ ...x, model: v }))
                                    }}
                                    style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                                >
                                    <option value="">—</option>
                                    {opts.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={!ready}
                        onClick={() => setScreen("hub")}
                        style={{ ...G.btn(ready ? "#e8890c" : "#1e1e1e"), color: ready ? "#0b0b0b" : "#444", cursor: ready ? "pointer" : "not-allowed", width: "100%", padding: "13px" }}
                    >
                        LOAD VEHICLE →
                    </button>
                </div>
            </div>
        )
    }

    // ─── HUB ───────────────────────────────────────────────────────
    if (screen === "hub") {
        const tiles = [
            { icon: "⬡", label: "Parts Catalog", sub: "OEM vs aftermarket with fitment", action: () => setScreen("parts"), live: true },
            { icon: "◈", label: "AI Symptom Diagnosis", sub: "Describe it — get ranked causes", action: null, live: false },
            { icon: "◷", label: "Maintenance Schedule", sub: "Upcoming services by mileage", action: null, live: false },
            { icon: "⚑", label: "OBD-II Code Lookup", sub: "Paste a fault code for plain English", action: null, live: false },
        ]
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
                <div style={G.topbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button onClick={() => setScreen("selector")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Back</button>
                        <span style={G.logo}>MECHANIQS</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
                <div style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 20px" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>VEHICLE LOADED</div>
                        <h2 style={{ fontSize: "26px", fontWeight: "700" }}>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {tiles.map(t => (
                            <div
                                key={t.label}
                                onClick={t.live ? t.action : undefined}
                                style={{ border: `1px solid ${t.live ? "#2a2a2a" : "#181818"}`, borderRadius: "4px", padding: "22px 18px", cursor: t.live ? "pointer" : "default", background: "#0e0e0e", position: "relative", transition: "border-color 0.15s" }}
                                onMouseEnter={e => t.live && (e.currentTarget.style.borderColor = "#e8890c")}
                                onMouseLeave={e => e.currentTarget.style.borderColor = t.live ? "#2a2a2a" : "#181818"}
                            >
                                {!t.live && <span style={{ position: "absolute", top: "10px", right: "12px", fontSize: "9px", color: "#444", letterSpacing: "0.1em" }}>COMING SOON</span>}
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

    // ─── PARTS CATALOG ─────────────────────────────────────────────
    if (screen === "parts") {
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
                <div style={G.topbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button onClick={() => setScreen("hub")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Back</button>
                        <span style={G.logo}>MECHANIQS</span>
                        <span style={{ color: "#333", fontSize: "12px" }}>›</span>
                        <span style={{ color: "#888", fontSize: "12px" }}>Parts</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>
                <div style={{ maxWidth: "760px", margin: "0 auto", padding: "28px 20px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "4px" }}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
                        <h2 style={{ fontSize: "20px", fontWeight: "700" }}>COMPATIBLE PARTS</h2>
                    </div>

                    {/* Category filters */}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "18px" }}>
                        {categories.map(c => (
                            <button key={c} onClick={() => setCatFilter(c)} style={G.pill(catFilter === c)}>{c.toUpperCase()}</button>
                        ))}
                    </div>

                    {/* Column headers */}
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
                                    <span style={{ fontSize: "11px", color: DIFF_COLOR[p.diff], fontWeight: "700" }}>{DIFF_LABEL[p.diff]}</span>
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
                                        <button onClick={() => startRepair(p)} style={G.btn()}>START REPAIR</button>
                                    ) : (
                                        <button disabled style={{ ...G.btn("#1e1e1e"), color: "#444", cursor: "not-allowed" }}>GUIDE SOON</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // ─── GUIDED REPAIR + AI CHAT ────────────────────────────────────
    if (screen === "repair" && selectedPart) {
        const cur = GUIDE[step]
        const allDone = done.length === GUIDE.length
        const quickPrompts = ["What torque spec?", "Any gotchas here?", "Can I skip this?", "What could go wrong?"]

        return (
            <div style={{ ...G.app, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }`}</style>

                {/* Topbar */}
                <div style={G.topbar}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button onClick={() => setScreen("parts")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Back</button>
                        <span style={G.logo}>MECHANIQS</span>
                        <span style={{ color: "#333", fontSize: "12px" }}>›</span>
                        <span style={{ color: "#666", fontSize: "11px", cursor: "pointer" }} onClick={() => setScreen("parts")}>Parts</span>
                        <span style={{ color: "#333", fontSize: "12px" }}>›</span>
                        <span style={{ color: "#888", fontSize: "11px" }}>{selectedPart.name}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>

                {/* Main split */}
                <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

                    {/* LEFT — Repair guide */}
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                        {/* Progress bar */}
                        <div style={{ display: "flex", gap: "3px", padding: "14px 20px 0", flexShrink: 0 }}>
                            {GUIDE.map((_, i) => (
                                <div
                                    key={i}
                                    onClick={() => setStep(i)}
                                    style={{ flex: 1, height: "3px", background: done.includes(i) ? "#4a9" : i === step ? "#e8890c" : "#2a2a2a", borderRadius: "2px", cursor: "pointer", transition: "background 0.2s" }}
                                />
                            ))}
                        </div>

                        <div style={{ padding: "20px", flex: 1 }}>
                            <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "4px" }}>
                                STEP {step + 1} OF {GUIDE.length} — {done.includes(step) ? <span style={{ color: "#4a9" }}>DONE</span> : "IN PROGRESS"}
                            </div>
                            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "14px", lineHeight: "1.2" }}>{cur.title}</h2>
                            <p style={{ color: "#aaa", lineHeight: "1.75", fontSize: "13px", marginBottom: "18px" }}>{cur.detail}</p>

                            {/* Gotcha warning */}
                            {cur.gotcha && (
                                <div style={{ border: "1px solid #5a2a00", background: "#120a00", borderRadius: "3px", padding: "12px 14px", marginBottom: "18px", fontSize: "12px", color: "#e8a040", lineHeight: "1.6" }}>
                                    {cur.gotcha}
                                </div>
                            )}

                            {/* Tools */}
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

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                {step > 0 && (
                                    <button onClick={() => setStep(s => s - 1)} style={{ ...G.ghost, padding: "10px 18px", fontSize: "12px" }}>← PREV</button>
                                )}
                                {!allDone ? (
                                    <button
                                        onClick={completeStep}
                                        style={G.btn(done.includes(step) ? "#1e1e1e" : "#e8890c")}
                                    >
                                        {done.includes(step) ? "✓ DONE — NEXT STEP →" : step === GUIDE.length - 1 ? "COMPLETE FINAL STEP ✓" : "COMPLETE STEP →"}
                                    </button>
                                ) : (
                                    <button onClick={() => setScreen("hub")} style={G.btn("#4a9")}>
                                        ✓ JOB COMPLETE — BACK TO HUB
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Step list */}
                        <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px 20px", flexShrink: 0 }}>
                            <div style={{ fontSize: "10px", color: "#444", letterSpacing: "0.1em", marginBottom: "10px" }}>ALL STEPS</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                {GUIDE.map((s, i) => (
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

                    {/* RIGHT — AI Chat */}
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

                        {/* Quick prompts */}
                        <div style={{ padding: "8px 10px", display: "flex", flexWrap: "wrap", gap: "5px", borderTop: "1px solid #141414", flexShrink: 0 }}>
                            {quickPrompts.map(q => (
                                <button key={q} onClick={() => sendAI(q)} style={{ background: "#111", border: "1px solid #1e1e1e", color: "#666", padding: "4px 8px", borderRadius: "2px", cursor: "pointer", fontFamily: "inherit", fontSize: "10px", letterSpacing: "0.04em" }}>{q}</button>
                            ))}
                        </div>

                        {/* Input */}
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

    return null
}
