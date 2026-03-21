import { useState, useEffect, useRef } from "react"

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles"
const YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => String(2026 - i))
const FALLBACK_MAKES = ["Honda","Toyota","Ford","Chevrolet","BMW","Subaru","Mazda","Nissan","Hyundai","Kia","Mercedes-Benz","Audi","Volkswagen","Jeep","GMC","Lexus","Dodge","Chrysler","Ram","Volvo","Porsche","Jaguar","Land Rover","Mitsubishi","Tesla","Buick","Cadillac","Infiniti","Acura","Mini","Alfa Romeo","Maserati","Ferrari","Lamborghini","Genesis","Lincoln","Daihatsu","Saab","Peugeot","Renault","Citroën","Fiat","Suzuki","Isuzu","Scion","Pontiac","Saturn","Oldsmobile","Mercury","AMC","Packard","Studebaker","DeLorean"]

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

const MAINTENANCE = [
    { name: "Oil Change", interval: 5000, category: "Engine" },
    { name: "Tire Rotation", interval: 5000, category: "Tires" },
    { name: "Brake Inspection", interval: 10000, category: "Brakes" },
    { name: "Spark Plugs Replacement", interval: 30000, category: "Engine" },
    { name: "Air Filter Replacement", interval: 15000, category: "Engine" },
    { name: "Cabin Air Filter Replacement", interval: 15000, category: "HVAC" },
    { name: "Transmission Fluid Change", interval: 30000, category: "Transmission" },
    { name: "Coolant Flush", interval: 30000, category: "Cooling" },
    { name: "Battery Check", interval: 5000, category: "Electrical" },
]

const DIFF_LABEL = ["", "Easy", "Moderate", "Hard"]
const DIFF_COLOR = ["", "#4a9", "#e8a020", "#e04444"]
const DEFAULT_VEHICLE = { year: "", make: "", model: "", trim: "", odometer: "", vin: "" }
const GARAGE_STORAGE_KEY = "mechaniqs.garage.v1"
const LAST_VEHICLE_STORAGE_KEY = "mechaniqs.lastVehicle.v1"

const normalizeVehicle = (v = {}) => ({
    year: String(v.year || "").trim(),
    make: String(v.make || "").trim(),
    model: String(v.model || "").trim(),
    trim: String(v.trim || "").trim(),
    odometer: String(v.odometer || "").trim(),
    vin: String(v.vin || "").trim().toUpperCase(),
})

const getVehicleKey = (v = {}) => {
    const n = normalizeVehicle(v)
    if (n.vin && n.vin.length === 17) return `VIN:${n.vin}`
    return `YMMT:${n.year}|${n.make}|${n.model}|${n.trim}`.toUpperCase()
}

const readStorage = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch (err) {
        console.error(`Storage read failed for ${key}`, err)
        return fallback
    }
}

const writeStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value))
        return true
    } catch (err) {
        console.error(`Storage write failed for ${key}`, err)
        return false
    }
}

export default function MechanIqs() {
    const [screen, setScreen] = useState("hub")
    const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE)
    const [selectedPart, setSelectedPart] = useState(null)
    const [step, setStep] = useState(0)
    const [done, setDone] = useState([])
    const [msgs, setMsgs] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [catFilter, setCatFilter] = useState("All")
    const [allMakes, setAllMakes] = useState(FALLBACK_MAKES)
    const [modelsBySelection, setModelsBySelection] = useState([])
    const [fetchingVehicles, setFetchingVehicles] = useState(false)
    const [vehicleError, setVehicleError] = useState("")
    const [useVin, setUseVin] = useState(false)
    const [garage, setGarage] = useState([])
    const chatEl = useRef(null)

    const addVehicleToGarage = (v) => {
        const normalized = normalizeVehicle(v)
        if (!normalized.year || !normalized.make || !normalized.model) return
        const key = getVehicleKey(normalized)
        setGarage(prev => {
            const next = [...prev]
            const idx = next.findIndex(item => item.key === key)
            const entry = { ...normalized, key, updatedAt: new Date().toISOString() }
            if (idx >= 0) next[idx] = { ...next[idx], ...entry }
            else next.unshift(entry)
            writeStorage(GARAGE_STORAGE_KEY, next)
            return next
        })
    }

    const loadVehicle = (v, nextScreen = "hub") => {
        const normalized = normalizeVehicle(v)
        setVehicle(normalized)
        writeStorage(LAST_VEHICLE_STORAGE_KEY, normalized)
        addVehicleToGarage(normalized)
        setScreen(nextScreen)
    }

    const goHome = () => {
        setScreen("hub")
        setVehicle(DEFAULT_VEHICLE)
        setSelectedPart(null)
        setStep(0)
        setDone([])
        setMsgs([])
        setInput("")
        setCatFilter("All")
        setModelsBySelection([])
        setVehicleError("")
        setUseVin(false)
    }

    useEffect(() => {
        const parsedGarage = readStorage(GARAGE_STORAGE_KEY, [])
        if (Array.isArray(parsedGarage)) {
            setGarage(parsedGarage)
        } else if (parsedGarage && typeof parsedGarage === "object") {
            setGarage(Object.values(parsedGarage))
        }

        const parsedLastVehicle = readStorage(LAST_VEHICLE_STORAGE_KEY, null)
        if (parsedLastVehicle) {
            const normalized = normalizeVehicle(parsedLastVehicle)
            if (normalized.year && normalized.make && normalized.model) setVehicle(normalized)
        }
    }, [])

    useEffect(() => {
        writeStorage(GARAGE_STORAGE_KEY, garage)
    }, [garage])

    useEffect(() => {
        if (vehicle.year && vehicle.make && vehicle.model) {
            writeStorage(LAST_VEHICLE_STORAGE_KEY, normalizeVehicle(vehicle))
        }
    }, [vehicle])

    useEffect(() => {
        if (chatEl.current) chatEl.current.scrollTop = chatEl.current.scrollHeight
    }, [msgs])

    useEffect(() => {
        const init = async () => {
            setFetchingVehicles(true)
            setVehicleError("")
            try {
                const res = await fetch(`${NHTSA_BASE}/GetAllMakes?format=json`)
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                const sorted = (data.Results || [])
                    .map(item => item.Make_Name?.trim())
                    .filter(Boolean)
                    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                setAllMakes(sorted.length ? sorted : FALLBACK_MAKES)
            } catch (err) {
                console.error("NHTSA make fetch failed", err)
                setVehicleError("Cannot fetch makes; using fallback list. Check network or CORS.")
                setAllMakes(FALLBACK_MAKES)
            } finally {
                setFetchingVehicles(false)
            }
        }
        init()
    }, [])

    useEffect(() => {
        if (!vehicle.year || !vehicle.make) {
            setModelsBySelection([])
            return
        }

        const loadModels = async () => {
            setFetchingVehicles(true)
            try {
                const res = await fetch(`${NHTSA_BASE}/GetModelsForMakeYear/make/${encodeURIComponent(vehicle.make)}/modelyear/${encodeURIComponent(vehicle.year)}?format=json`)
                const data = await res.json()
                const models = (data.Results || [])
                    .map(item => item.Model_Name?.trim())
                    .filter(Boolean)
                    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
                setModelsBySelection([...new Set(models)])
            } catch (err) {
                console.error("NHTSA model fetch failed", err)
                setModelsBySelection([])
            } finally {
                setFetchingVehicles(false)
            }
        }

        loadModels()
    }, [vehicle.year, vehicle.make])

    const decodeVIN = async () => {
        if (!vehicle.vin || vehicle.vin.length !== 17) {
            setVehicleError("VIN must be 17 characters")
            return
        }
        setFetchingVehicles(true)
        setVehicleError("")
        try {
            const res = await fetch(`${NHTSA_BASE}/DecodeVin/${vehicle.vin}?format=json`)
            const data = await res.json()
            const results = data.Results || []
            const year = results.find(r => r.Variable === "Model Year")?.Value
            const make = results.find(r => r.Variable === "Make")?.Value
            const model = results.find(r => r.Variable === "Model")?.Value
            const trim = results.find(r => r.Variable === "Trim")?.Value || ""
            if (year && make && model) {
                loadVehicle({ ...vehicle, year, make, model, trim }, "hub")
                setUseVin(false) // switch to manual to show fields
            } else {
                setVehicleError("Could not decode VIN")
            }
        } catch (err) {
            console.error("VIN decode failed", err)
            setVehicleError("VIN decode failed")
        } finally {
            setFetchingVehicles(false)
        }
    }

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
            content: `Ready. I've got context on your ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} and the ${part.name} job. Ask me anything — torque specs, gotchas, whether something looks right, or if it's safe to skip a step. Let's get it done.`,
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
        logoBtn: { background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" },
        ghost: { background: "none", border: "1px solid #2a2a2a", color: "#666", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.04em" },
        pill: (active) => ({ background: active ? "#e8890c" : "#161616", border: `1px solid ${active ? "#e8890c" : "#2a2a2a"}`, color: active ? "#0b0b0b" : "#888", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: active ? "700" : "400", letterSpacing: "0.05em" }),
        btn: (color = "#e8890c") => ({ background: color, border: "none", color: "#0b0b0b", padding: "10px 22px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700", fontSize: "12px", letterSpacing: "0.06em" }),
    }

    // ─── SELECTOR ──────────────────────────────────────────────────
    if (screen === "selector") {
        const years = YEARS
        const makes = allMakes
        const models = modelsBySelection
        const ready = vehicle.year && vehicle.make && vehicle.model && vehicle.trim && vehicle.odometer
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
                <div style={G.topbar}>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
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
                        onClick={() => loadVehicle({ year: "2026", make: "Honda", model: "Civic", trim: "Sport Hybrid", odometer: "45000" }, "hub")}
                        style={{ border: "1px solid #e8890c", borderRadius: "4px", padding: "14px 18px", marginBottom: "28px", cursor: "pointer", background: "#0f0a00" }}
                    >
                        <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "6px" }}>⚡  QUICK START — DEMO VEHICLE</div>
                        <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>2026 Honda Civic Sport Hybrid</div>
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
                                            if (key === "year") setVehicle({ year: v, make: "", model: "", trim: "" })
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
                                <input
                                    value={vehicle.trim}
                                    placeholder="e.g. LX, EX, Touring"
                                    disabled={!vehicle.model}
                                    onChange={e => setVehicle(x => ({ ...x, trim: e.target.value }))}
                                    style={{ width: "100%", background: "#141414", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "8px 10px", borderRadius: "3px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                                />
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

    // ─── HUB ───────────────────────────────────────────────────────
    if (screen === "hub") {
        const hasVehicle = Boolean(vehicle.year && vehicle.make && vehicle.model)
        const tiles = [
            { icon: "＋", label: "Add Vehicle", sub: "Load by VIN or manual selection", action: () => setScreen("selector"), live: true },
            { icon: "▣", label: "Garage", sub: `${garage.length} saved vehicle${garage.length === 1 ? "" : "s"}`, action: () => setScreen("garage"), live: true },
            { icon: "⬡", label: "Parts Catalog", sub: "OEM vs aftermarket with fitment", action: () => setScreen("parts"), live: hasVehicle },
            { icon: "◈", label: "AI Symptom Diagnosis", sub: "Describe it — get ranked causes", action: null, live: false },
            { icon: "◷", label: "Maintenance Schedule", sub: "Upcoming services by mileage", action: () => setScreen("maintenance"), live: hasVehicle },
            { icon: "⚑", label: "OBD-II Code Lookup", sub: "Paste a fault code for plain English", action: null, live: false },
        ]
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
                <div style={G.topbar}>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    {hasVehicle ? (
                        <button onClick={() => setScreen("selector")} style={G.ghost}>CHANGE VEHICLE</button>
                    ) : (
                        <span style={{ fontSize: "11px", color: "#555", letterSpacing: "0.08em" }}>NO VEHICLE LOADED</span>
                    )}
                </div>
                <div style={{ maxWidth: "640px", margin: "0 auto", padding: "36px 20px" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>{hasVehicle ? "VEHICLE LOADED" : "DASHBOARD"}</div>
                        <h2 style={{ fontSize: "26px", fontWeight: "700" }}>
                            {hasVehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}` : "Load a vehicle to unlock maintenance and parts"}
                        </h2>
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

    // ─── GARAGE ──────────────────────────────────────────────────────
    if (screen === "garage") {
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
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

                    {garage.length === 0 ? (
                        <div style={{ border: "1px solid #1e1e1e", borderRadius: "4px", background: "#0e0e0e", padding: "22px" }}>
                            <div style={{ fontSize: "14px", marginBottom: "8px" }}>No saved vehicles yet.</div>
                            <button onClick={() => setScreen("selector")} style={G.btn()}>ADD YOUR FIRST VEHICLE →</button>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // ─── MAINTENANCE ──────────────────────────────────────────────────
    if (screen === "maintenance") {
        const odometer = parseInt(vehicle.odometer) || 0
        const maintenanceList = MAINTENANCE.map(item => {
            const nextDue = Math.ceil(odometer / item.interval) * item.interval
            const isDue = nextDue === odometer
            return { ...item, nextDue, isDue }
        })
        return (
            <div style={G.app}>
                <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
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
                        <button onClick={() => setScreen("parts")} style={G.btn()}>BROWSE PARTS CATALOG →</button>
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
                        <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                            <span style={G.logo}>MECHANIQS</span>
                        </button>
                        <span style={{ color: "#444", fontSize: "12px" }}>/ {selectedPart.name}</span>
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

const decodeVin = async (vin) => {
    const res = await fetch(`/api/nhtsa?type=decodeVin&vin=${vin}`)
    const data = await res.json()

    // Flatten the key-value array into a usable object
    const decoded = {}
    data.Results.forEach(item => {
        decoded[item.Variable] = item.Value
    })

    // Auto-populate vehicle state
    setVehicle({
        year: decoded['Model Year'] || '',
        make: decoded['Make'] || '',
        model: decoded['Model'] || '',
        trim: decoded['Trim'] || '',
    })
}
