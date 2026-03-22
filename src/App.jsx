import { useState, useEffect, useRef } from "react"

const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles"
const YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => String(2026 - i))
const TOP_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dodge", "Daimler", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Pagani", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Saab", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo"
]
const FALLBACK_MAKES = TOP_MAKES

const MODEL_TRIMS_BY_YEAR = {
    "Lexus|IS": [
        { minYear: 1999, maxYear: 2005, trims: ["IS-200", "IS-300"] },
        { minYear: 2006, maxYear: 2013, trims: ["IS-250", "IS-350", "IS-F"] },
        { minYear: 2014, maxYear: 2020, trims: ["IS-200t", "IS-300", "IS-350", "IS-F"] },
        { minYear: 2021, maxYear: 2026, trims: ["IS 300", "IS 500"] },
    ],
    "Honda|Civic": [
        { minYear: 2006, maxYear: 2011, trims: ["DX", "LX", "EX"] },
        { minYear: 2012, maxYear: 2022, trims: ["LX", "EX", "Sport"] },
        { minYear: 2025, maxYear: 2026, trims: ["LX", "Sport", "Sport Hybrid", "Sport Touring Hybrid"] },
    ],
    "Ford|F-150": [
        { minYear: 2009, maxYear: 2022, trims: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "Limited"] },
    ],
}

/**
 * MODEL_TRIMS IS COCONUT JPG DO NOT DELETE OR ENTIRE WEBSITE WILL SELF DETONATE
 * MODEL_TRIMS IS COCONUT JPG DO NOT DELETE OR ENTIRE WEBSITE WILL SELF DETONATE
 * MODEL_TRIMS IS COCONUT JPG DO NOT DELETE OR ENTIRE WEBSITE WILL SELF DETONATE
 */
const MODEL_TRIMS = {
    "Lexus|IS": ["IS-200", "IS-300", "IS-350", "IS-500", "IS-F"],
    "Toyota|Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
    "Honda|Civic": ["LX", "EX", "Sport", "Si", "Type R"],
    "Ford|F-150": ["XL", "STX", "XLT", "Lariat", "King Ranch", "Limited", "Tremor", "Raptor"],
    "BMW|3 Series": ["320i", "330i", "340i", "M3"],
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
const DIAGNOSIS_QUICK_SYMPTOMS = [
    "Grinding noise while braking at low speed",
    "Engine cranks but does not start when warm",
    "Steering wheel shakes above 60 mph",
    "Sweet smell and temperature gauge rising",
    "Clicking noise when turning at full lock",
]

const cleanJsonBlock = (text = "") => {
    const trimmed = String(text).trim()
    if (!trimmed) return ""
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
    return fencedMatch ? fencedMatch[1].trim() : trimmed
}

const parseDiagnosisResponse = (raw = "") => {
    const cleaned = cleanJsonBlock(raw)
    let parsed = null

    try {
        parsed = JSON.parse(cleaned)
    } catch {
        parsed = null
    }

    if (!parsed || typeof parsed !== "object") {
        return {
            urgency: "medium",
            summary: cleaned || "No diagnosis was returned. Please try again with more detail.",
            redFlags: [],
            likelyCauses: [],
            nextSteps: [],
            recommendedParts: [],
            disclaimer: "AI output could not be structured. Treat this as a starting point only.",
            raw,
        }
    }

    const urgency = ["low", "medium", "high", "critical"].includes(String(parsed.urgency || "").toLowerCase())
        ? String(parsed.urgency).toLowerCase()
        : "medium"

    const normalizeArray = (value) => Array.isArray(value)
        ? value.map(v => String(v || "").trim()).filter(Boolean)
        : []

    const likelyCauses = Array.isArray(parsed.likelyCauses)
        ? parsed.likelyCauses
            .map((item, idx) => ({
                rank: Number(item?.rank) || idx + 1,
                cause: String(item?.cause || item?.name || "Possible cause").trim(),
                confidence: Math.min(99, Math.max(1, Number(item?.confidence) || 50)),
                why: String(item?.why || item?.reason || "").trim(),
                checks: normalizeArray(item?.checks),
            }))
            .sort((a, b) => a.rank - b.rank)
        : []

    return {
        urgency,
        summary: String(parsed.summary || "No summary returned.").trim(),
        redFlags: normalizeArray(parsed.redFlags),
        likelyCauses,
        nextSteps: normalizeArray(parsed.nextSteps),
        recommendedParts: normalizeArray(parsed.recommendedParts),
        disclaimer: String(parsed.disclaimer || "This is not a substitute for an in-person inspection.").trim(),
        raw,
    }
}

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
    const [trimOptions, setTrimOptions] = useState([])
    const [fetchingVehicles, setFetchingVehicles] = useState(false)
    const [vehicleError, setVehicleError] = useState("")
    const [useVin, setUseVin] = useState(false)
    const [liveParts, setLiveParts] = useState([])
    const [partsLoading, setPartsLoading] = useState(false)
    const [partsError, setPartsError] = useState("")
    const [garage, setGarage] = useState([])
    const [editingVehicleKey, setEditingVehicleKey] = useState("")
    const [diagnosisInput, setDiagnosisInput] = useState("")
    const [diagnosisContext, setDiagnosisContext] = useState("")
    const [diagnosisLoading, setDiagnosisLoading] = useState(false)
    const [diagnosisError, setDiagnosisError] = useState("")
    const [diagnosisResult, setDiagnosisResult] = useState(null)
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
        const nextKey = getVehicleKey(normalized)

        if (editingVehicleKey && editingVehicleKey !== nextKey) {
            setGarage(prev => {
                const next = prev.filter(item => item.key !== editingVehicleKey)
                writeStorage(GARAGE_STORAGE_KEY, next)
                return next
            })
        }

        setVehicle(normalized)
        writeStorage(LAST_VEHICLE_STORAGE_KEY, normalized)
        addVehicleToGarage(normalized)
        setEditingVehicleKey("")
        setScreen(nextScreen)
    }

    const removeVehicleFromGarage = (key) => {
        setGarage(prev => {
            const next = prev.filter(item => item.key !== key)
            writeStorage(GARAGE_STORAGE_KEY, next)
            return next
        })

        if (getVehicleKey(vehicle) === key) {
            setVehicle(DEFAULT_VEHICLE)
            try {
                localStorage.removeItem(LAST_VEHICLE_STORAGE_KEY)
            } catch (err) {
                console.error("Failed to clear last vehicle from storage", err)
            }
        }

        if (editingVehicleKey === key) {
            setEditingVehicleKey("")
        }
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
        setEditingVehicleKey("")
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
        // Use strict curated automaker list only (manual top OEMs), do not allow third-party vendor names from API.
        setAllMakes(TOP_MAKES)
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

    const fetchLiveParts = async (partQuery = "") => {
        if (!vehicle.year || !vehicle.make || !vehicle.model) return []

        setPartsLoading(true)
        setPartsError("")
        try {
            const qs = new URLSearchParams({
                year: vehicle.year,
                make: vehicle.make,
                model: vehicle.model,
                trim: vehicle.trim || "",
                partQuery,
            })
            const res = await fetch(`/api/rockauto?${qs.toString()}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || "Failed to fetch RockAuto parts")
            const parts = Array.isArray(data.parts) ? data.parts : []
            setLiveParts(parts)
            return parts
        } catch (err) {
            console.error("RockAuto fetch failed", err)
            setLiveParts([])
            setPartsError(err?.message || "Could not load RockAuto parts")
            return []
        } finally {
            setPartsLoading(false)
        }
    }

    const year = Number(vehicle.year)

    const computeTrimOptions = (make, model, year) => {
        const key = `${make}|${model}`
        const yearBuckets = MODEL_TRIMS_BY_YEAR[key] || []
        const bucket = yearBuckets.find(b => year >= b.minYear && year <= b.maxYear)
        if (bucket) return bucket.trims
        // fallback to generic trim list for the same model if year-specific missing
        return MODEL_TRIMS[key] || []
    }

    useEffect(() => {
        const options = computeTrimOptions(vehicle.make, vehicle.model, year)
        setTrimOptions(options)
        if (options.length && !options.includes(vehicle.trim)) {
            setVehicle(x => ({ ...x, trim: "" }))
        }
    }, [vehicle.make, vehicle.model, vehicle.year])

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
            let year = results.find(r => r.Variable === "Model Year")?.Value
            let make = results.find(r => r.Variable === "Make")?.Value
            const model = results.find(r => r.Variable === "Model")?.Value
            const trim = results.find(r => r.Variable === "Trim")?.Value || ""
            
            // Normalize make to match TOP_MAKES (case-insensitive)
            if (make) {
                const matchedMake = TOP_MAKES.find(m => m.toLowerCase() === make.toLowerCase())
                make = matchedMake || make
            }
            
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

    const runSymptomDiagnosis = async () => {
        if (!diagnosisInput.trim() || diagnosisLoading) return

        setDiagnosisLoading(true)
        setDiagnosisError("")
        setDiagnosisResult(null)

        const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`.trim()

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
                    max_tokens: 1200,
                    system: "You are MECHANIQS AI symptom triage. Always return strict JSON and no markdown. Prioritize safety and practical driveway checks. If symptoms indicate dangerous operation, elevate urgency and include immediate stop-driving guidance.",
                    messages: [{
                        role: "user",
                        content: `Vehicle: ${vehicleLabel}\nOdometer: ${vehicle.odometer || "unknown"} miles\nSymptom report: ${diagnosisInput.trim()}\nAdditional context: ${diagnosisContext.trim() || "none"}\n\nReturn ONLY valid JSON with this schema:\n{\n  "urgency": "low|medium|high|critical",\n  "summary": "one short paragraph",\n  "redFlags": ["string"],\n  "likelyCauses": [\n    { "rank": 1, "cause": "string", "confidence": 0-100, "why": "string", "checks": ["string"] }\n  ],\n  "nextSteps": ["string"],\n  "recommendedParts": ["string"],\n  "disclaimer": "string"\n}\nKeep likelyCauses to 3 items and checks to quick, safe, non-invasive tests.`
                    }],
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data?.error?.message || data?.error || "Diagnosis request failed")
            const text = data?.content?.[0]?.text || ""
            setDiagnosisResult(parseDiagnosisResponse(text))
        } catch (err) {
            console.error("Symptom diagnosis failed", err)
            setDiagnosisError(err?.message || "Connection error. Check your API key and network.")
        } finally {
            setDiagnosisLoading(false)
        }
    }

    const startRepair = async (part) => {
        await fetchLiveParts(part.name)
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

    const catalogParts = liveParts.length ? liveParts : PARTS
    const categories = ["All", ...new Set(catalogParts.map(p => p.cat))]
    const visibleParts = catFilter === "All" ? catalogParts : catalogParts.filter(p => p.cat === catFilter)

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
                        <h1 style={{ fontSize: "30px", fontWeight: "700", lineHeight: "1.2", marginBottom: "10px" }}>{editingVehicleKey ? "Edit your vehicle" : "What are you"}<br />{editingVehicleKey ? "and save changes" : "working on today?"}</h1>
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

    // ─── HUB ───────────────────────────────────────────────────────
    if (screen === "hub") {
        const hasVehicle = Boolean(vehicle.year && vehicle.make && vehicle.model)
        const tiles = [
            { icon: "＋", label: "Add Vehicle", sub: "Load by VIN or manual selection", action: () => setScreen("selector"), live: true },
            { icon: "▣", label: "Garage", sub: `${garage.length} saved vehicle${garage.length === 1 ? "" : "s"}`, action: () => setScreen("garage"), live: true },
            { icon: "⬡", label: "Parts Catalog", sub: "OEM vs aftermarket with fitment", action: () => setScreen("parts"), live: hasVehicle },
            { icon: "◈", label: "AI Symptom Diagnosis", sub: "Describe it — get ranked causes", action: () => setScreen("diagnosis"), live: hasVehicle },
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

    // ─── AI SYMPTOM DIAGNOSIS ───────────────────────────────────────
    if (screen === "diagnosis") {
        const urgencyColor = {
            low: "#4a9",
            medium: "#d6a542",
            high: "#e8890c",
            critical: "#e04444",
        }

        const hasResult = Boolean(diagnosisResult)

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
                    <span style={{ fontSize: "11px", color: "#555" }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
                </div>

                <div style={{ maxWidth: "920px", margin: "0 auto", padding: "30px 20px 44px" }}>
                    <div style={{ marginBottom: "18px" }}>
                        <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "6px" }}>AI SYMPTOM DIAGNOSIS</div>
                        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }}>Describe what your car is doing</h2>
                        <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.7" }}>Get likely causes ranked by probability, quick checks you can do safely, and parts you may need before opening the hood.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px", marginBottom: "14px" }}>
                        <label style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em" }}>SYMPTOMS</label>
                        <textarea
                            value={diagnosisInput}
                            onChange={e => setDiagnosisInput(e.target.value)}
                            placeholder="Example: Loud squeal only during first 5 minutes of driving; slight pull to the right when braking..."
                            style={{ minHeight: "110px", background: "#111", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "10px 12px", borderRadius: "4px", fontFamily: "inherit", fontSize: "12px", lineHeight: "1.6", resize: "vertical", outline: "none" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                        {DIAGNOSIS_QUICK_SYMPTOMS.map(symptom => (
                            <button
                                key={symptom}
                                onClick={() => setDiagnosisInput(symptom)}
                                style={{ background: "#0f0f0f", border: "1px solid #2a2a2a", color: "#777", padding: "6px 10px", borderRadius: "20px", fontFamily: "inherit", fontSize: "11px", cursor: "pointer" }}
                            >
                                {symptom}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", alignItems: "end", marginBottom: "18px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>OPTIONAL CONTEXT</label>
                            <input
                                value={diagnosisContext}
                                onChange={e => setDiagnosisContext(e.target.value)}
                                placeholder="Recent work, weather, warning lights, when issue started"
                                style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", color: "#ede9e1", padding: "10px 12px", borderRadius: "4px", fontFamily: "inherit", fontSize: "12px", outline: "none" }}
                            />
                        </div>
                        <button
                            onClick={runSymptomDiagnosis}
                            disabled={!diagnosisInput.trim() || diagnosisLoading}
                            style={{ ...G.btn(diagnosisInput.trim() && !diagnosisLoading ? "#e8890c" : "#1e1e1e"), color: diagnosisInput.trim() && !diagnosisLoading ? "#0b0b0b" : "#444", cursor: diagnosisInput.trim() && !diagnosisLoading ? "pointer" : "not-allowed", padding: "11px 18px" }}
                        >
                            {diagnosisLoading ? "ANALYZING..." : "RUN DIAGNOSIS"}
                        </button>
                    </div>

                    {diagnosisError && (
                        <div style={{ border: "1px solid #552222", background: "#170d0d", borderRadius: "4px", padding: "12px", color: "#ee8f8f", fontSize: "12px", marginBottom: "16px" }}>
                            {diagnosisError}
                        </div>
                    )}

                    {!hasResult && !diagnosisLoading && (
                        <div style={{ border: "1px solid #1f1f1f", borderRadius: "4px", background: "#0e0e0e", padding: "16px", color: "#666", fontSize: "12px", lineHeight: "1.7" }}>
                            Tip: include when the symptom happens (cold start, under braking, uphill), noises/smells, and any warning lights to improve ranking accuracy.
                        </div>
                    )}

                    {hasResult && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ border: "1px solid #252525", borderRadius: "4px", background: "#0e0e0e", padding: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "10px", flexWrap: "wrap" }}>
                                    <div style={{ fontSize: "16px", fontWeight: "700" }}>Triage Summary</div>
                                    <div style={{ border: `1px solid ${urgencyColor[diagnosisResult.urgency] || "#666"}`, color: urgencyColor[diagnosisResult.urgency] || "#666", padding: "4px 8px", borderRadius: "3px", fontSize: "11px", letterSpacing: "0.08em" }}>
                                        {String(diagnosisResult.urgency || "medium").toUpperCase()} URGENCY
                                    </div>
                                </div>
                                <p style={{ color: "#c7c2b8", fontSize: "13px", lineHeight: "1.7" }}>{diagnosisResult.summary}</p>
                            </div>

                            {diagnosisResult.redFlags?.length > 0 && (
                                <div style={{ border: "1px solid #5a2a00", borderRadius: "4px", background: "#120a00", padding: "14px" }}>
                                    <div style={{ color: "#e8a040", fontSize: "10px", letterSpacing: "0.12em", marginBottom: "8px" }}>STOP-DRIVING RED FLAGS</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        {diagnosisResult.redFlags.map((flag, idx) => (
                                            <div key={`${flag}-${idx}`} style={{ color: "#d9b17b", fontSize: "12px", lineHeight: "1.6" }}>• {flag}</div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                                {diagnosisResult.likelyCauses?.map(cause => (
                                    <div key={`${cause.rank}-${cause.cause}`} style={{ border: "1px solid #222", borderRadius: "4px", background: "#0d0d0d", padding: "14px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", gap: "8px", flexWrap: "wrap" }}>
                                            <div style={{ fontSize: "14px", fontWeight: "700", color: "#ede9e1" }}>#{cause.rank} {cause.cause}</div>
                                            <div style={{ color: "#e8890c", fontSize: "11px", fontWeight: "700" }}>{cause.confidence}% match</div>
                                        </div>
                                        {cause.why && <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.6", marginBottom: "8px" }}>{cause.why}</p>}
                                        {cause.checks?.length > 0 && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                {cause.checks.map((check, idx) => (
                                                    <div key={`${check}-${idx}`} style={{ color: "#bbb", fontSize: "12px" }}>▸ {check}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ border: "1px solid #1f1f1f", borderRadius: "4px", background: "#0e0e0e", padding: "14px" }}>
                                <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "8px" }}>NEXT STEPS</div>
                                {diagnosisResult.nextSteps?.length > 0 ? diagnosisResult.nextSteps.map((stepText, idx) => (
                                    <div key={`${stepText}-${idx}`} style={{ color: "#bdb8af", fontSize: "12px", lineHeight: "1.6", marginBottom: "4px" }}>• {stepText}</div>
                                )) : <div style={{ color: "#666", fontSize: "12px" }}>No next steps returned.</div>}
                            </div>

                            <div style={{ border: "1px solid #1f1f1f", borderRadius: "4px", background: "#0e0e0e", padding: "14px" }}>
                                <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.12em", marginBottom: "8px" }}>POSSIBLE PARTS TO PRICE</div>
                                {diagnosisResult.recommendedParts?.length > 0 ? diagnosisResult.recommendedParts.map((partText, idx) => (
                                    <div key={`${partText}-${idx}`} style={{ color: "#bdb8af", fontSize: "12px", lineHeight: "1.6", marginBottom: "4px" }}>• {partText}</div>
                                )) : <div style={{ color: "#666", fontSize: "12px" }}>No parts suggested yet.</div>}
                                <div style={{ marginTop: "10px" }}>
                                    <button onClick={() => setScreen("parts")} style={G.btn()}>OPEN PARTS CATALOG →</button>
                                </div>
                            </div>

                            <div style={{ color: "#666", fontSize: "11px", lineHeight: "1.6" }}>
                                {diagnosisResult.disclaimer}
                            </div>
                        </div>
                    )}
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
                        {partsLoading && (
                            <p style={{ color: "#888", fontSize: "12px", marginTop: "10px" }}>Loading selected part options from RockAuto...</p>
                        )}
                        {partsError && (
                            <p style={{ color: "#e04444", fontSize: "12px", marginTop: "10px" }}>{partsError}. Showing fallback catalog.</p>
                        )}
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
                                        <button disabled={partsLoading} onClick={() => startRepair(p)} style={{ ...G.btn(partsLoading ? "#1e1e1e" : "#e8890c"), color: partsLoading ? "#444" : "#0b0b0b", cursor: partsLoading ? "not-allowed" : "pointer" }}>
                                            {partsLoading ? "LOADING..." : "START REPAIR"}
                                        </button>
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
