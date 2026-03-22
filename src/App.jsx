import { useState, useEffect, useRef } from "react"
import RecallPage from "./RecallPage.jsx"
import {
    DEFAULT_VEHICLE,
    DIFF_COLOR,
    DIFF_LABEL,
    FALLBACK_MAKES,
    GARAGE_STORAGE_KEY,
    GUIDE,
    LAST_CATEGORY_FILTER_STORAGE_KEY,
    LAST_VEHICLE_STORAGE_KEY,
    LAST_SELECTED_PART_STORAGE_KEY,
    MAINTENANCE,
    NHTSA_BASE,
    PARTS,
    TOP_MAKES,
} from "./constants/appData"
import { readStorage, writeStorage } from "./utils/storage"
import { computeTrimOptions, getVehicleKey, normalizeVehicle } from "./utils/vehicle"
import { buildGuideForPart } from "./utils/guideBuilder"
import { G } from "./styles/theme"
import SelectorPage from "./pages/SelectorPage"
import HubPage from "./pages/HubPage"
import GaragePage from "./pages/GaragePage"
import MaintenancePage from "./pages/MaintenancePage"
import PartsPage from "./pages/PartsPage"
import RepairPage from "./pages/RepairPage"
import SymptomDiagnosisPage from "./pages/SymptomDiagnosisPage"
import OBDLookupPage from "./pages/OBDLookupPage"

export default function MechanIqs() {
    const [screen, setScreen] = useState("hub")
    const [vehicle, setVehicle] = useState(DEFAULT_VEHICLE)
    const [selectedPart, setSelectedPart] = useState(null)
    const [activeGuide, setActiveGuide] = useState(GUIDE)
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
    const [diagnosisMsgs, setDiagnosisMsgs] = useState([])
    const [diagnosisInput, setDiagnosisInput] = useState("")
    const [diagnosisLoading, setDiagnosisLoading] = useState(false)
    const chatEl = useRef(null)
    const diagnosisChatEl = useRef(null)

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

        if (editingVehicleKey === key) setEditingVehicleKey("")
    }

    const goHome = () => {
        setScreen("hub")
        setStep(0)
        setDone([])
        setMsgs([])
        setInput("")
        setModelsBySelection([])
        setVehicleError("")
        setUseVin(false)
        setEditingVehicleKey("")
    }

    useEffect(() => {
        const parsedGarage = readStorage(GARAGE_STORAGE_KEY, [])
        if (Array.isArray(parsedGarage)) setGarage(parsedGarage)
        else if (parsedGarage && typeof parsedGarage === "object") setGarage(Object.values(parsedGarage))

        const parsedLastVehicle = readStorage(LAST_VEHICLE_STORAGE_KEY, null)
        if (parsedLastVehicle) {
            const normalized = normalizeVehicle(parsedLastVehicle)
            if (normalized.year && normalized.make && normalized.model) setVehicle(normalized)
        }

        const parsedSelectedPart = readStorage(LAST_SELECTED_PART_STORAGE_KEY, null)
        if (parsedSelectedPart && typeof parsedSelectedPart === "object" && parsedSelectedPart.name) {
            setSelectedPart(parsedSelectedPart)
        }

        const parsedCategory = readStorage(LAST_CATEGORY_FILTER_STORAGE_KEY, "All")
        if (typeof parsedCategory === "string" && parsedCategory) {
            setCatFilter(parsedCategory)
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
        if (selectedPart) {
            setActiveGuide(buildGuideForPart(selectedPart, vehicle))
        } else {
            setActiveGuide(GUIDE)
        }
    }, [selectedPart, vehicle.year, vehicle.make, vehicle.model, vehicle.trim])

    useEffect(() => {
        setStep(s => Math.min(s, Math.max(activeGuide.length - 1, 0)))
        setDone(d => d.filter(i => i < activeGuide.length))
    }, [activeGuide.length])

    useEffect(() => {
        writeStorage(LAST_SELECTED_PART_STORAGE_KEY, selectedPart || null)
    }, [selectedPart])

    useEffect(() => {
        writeStorage(LAST_CATEGORY_FILTER_STORAGE_KEY, catFilter)
    }, [catFilter])

    useEffect(() => {
        if (chatEl.current) chatEl.current.scrollTop = chatEl.current.scrollHeight
    }, [msgs])

    useEffect(() => {
        if (diagnosisChatEl.current) diagnosisChatEl.current.scrollTop = diagnosisChatEl.current.scrollHeight
    }, [diagnosisMsgs])

    useEffect(() => {
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
                    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
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

    useEffect(() => {
        const options = computeTrimOptions(vehicle.make, vehicle.model, Number(vehicle.year))
        setTrimOptions(options)
        if (options.length && !options.includes(vehicle.trim)) {
            setVehicle(x => ({ ...x, trim: "" }))
        }
    }, [vehicle.make, vehicle.model, vehicle.year, vehicle.trim])

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

            if (make) {
                const matchedMake = TOP_MAKES.find(m => m.toLowerCase() === make.toLowerCase())
                make = matchedMake || make
            }

            if (year && make && model) {
                loadVehicle({ ...vehicle, year, make, model, trim }, "hub")
                setUseVin(false)
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
        const cur = activeGuide[step]
        const newMsgs = [...msgs, { role: "user", content: text }]
        setMsgs(newMsgs)
        setInput("")
        setLoading(true)
        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    maxTokens: 450,
                    temperature: 0.5,
                    systemPrompt: `You are MECHANIQS AI, a focused practical repair assistant. Vehicle context: ${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}. Job: ${selectedPart?.name || "unknown"}. Current step (${step + 1}/${GUIDE.length}): "${cur?.title}". Step notes: "${cur?.detail}". Gotcha: "${cur?.gotcha || "none"}". Give concise and safe guidance in plain text. Highlight safety-critical mistakes first. If uncertain, say what to verify before proceeding.`,
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: `You are MECHANIQS AI — a focused, practical car repair assistant. The user is working on a ${vehicle.year} ${vehicle.make} ${vehicle.model}. Current job: ${selectedPart?.name}. Current step (${step + 1}/${activeGuide.length}): "${cur?.title}". Step notes: "${cur?.detail}". Known gotcha: "${cur?.gotcha || "none"}". Be direct and concise — under 120 words unless a safety point demands more. No markdown bullets unless listing tools. Address safety first when relevant.`,
                    messages: newMsgs,
                }),
            })
            const data = await res.json()
            const reply = res.ok ? (data.text || "No response — try again.") : (data.error || "AI request failed")
            setMsgs([...newMsgs, { role: "assistant", content: reply }])
        } catch {
            setMsgs([...newMsgs, { role: "assistant", content: "Connection error. Check your network and OPENROUTER_API_KEY." }])
        }
        setLoading(false)
    }

    const sendDiagnosis = async (text) => {
        if (!text.trim() || diagnosisLoading) return

        const newMsgs = [...diagnosisMsgs, { role: "user", content: text }]
        setDiagnosisMsgs(newMsgs)
        setDiagnosisInput("")
        setDiagnosisLoading(true)

        const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    maxTokens: 500,
                    temperature: 0.4,
                    systemPrompt: `You are a vehicle diagnosis assistant for MECHANIQS. Vehicle: ${vehicleLabel}. Prioritize causes known for this platform and mileage (${vehicle.odometer || "unknown"} miles). Output plain text in this exact structure: 1) Most likely causes (top 3, ranked). 2) Why these fit these symptoms. 3) Next checks in safest order (start with no-tools checks). 4) Risk level if user keeps driving (Low/Medium/High). 5) What info you still need. Keep it practical and concise.`,
                    messages: newMsgs,
                }),
            })

            const data = await res.json()
            const reply = res.ok ? (data.text || "No response.") : (data.error || "OpenRouter request failed")
            setDiagnosisMsgs([...newMsgs, { role: "assistant", content: reply }])
        } catch {
            setDiagnosisMsgs([...newMsgs, { role: "assistant", content: "Connection error. Check your network and OPENROUTER_API_KEY." }])
        }

        setDiagnosisLoading(false)
    }

    const startRepair = async (part) => {
        await fetchLiveParts(part.name)
        setActiveGuide(buildGuideForPart(part, vehicle))
        setSelectedPart(part)
        setStep(0)
        setDone([])
        setMsgs([{
            role: "assistant",
            content: `Ready. I've got context on your ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} and the ${part.name} job. Ask me anything — torque specs, gotchas, whether something looks right, or if it's safe to skip a step. Let's get it done.`,
        }])
        setScreen("repair")
    }

    const choosePartOnly = (part) => {
        setActiveGuide(buildGuideForPart(part, vehicle))
        setSelectedPart(part)
        setStep(0)
        setDone([])
        setMsgs([{
            role: "assistant",
            content: `Part selected: ${part.name}. Open Tutorial when ready and I will guide you step by step for your ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
        }])
    }

    const goToTutorial = () => {
        if (selectedPart) setScreen("repair")
    }

    const completeStep = () => {
        setDone(d => [...d, step])
        if (step < activeGuide.length - 1) setStep(s => s + 1)
    }

    const odometer = parseInt(vehicle.odometer) || 0
    const maintenanceList = MAINTENANCE.map(item => {
        const nextDue = Math.ceil(odometer / item.interval) * item.interval
        const isDue = nextDue === odometer
        return { ...item, nextDue, isDue }
    })

    const catalogParts = liveParts.length ? liveParts : PARTS
    const categories = ["All", ...new Set(catalogParts.map(p => p.cat))]
    const visibleParts = catFilter === "All" ? catalogParts : catalogParts.filter(p => p.cat === catFilter)

    if (screen === "selector") {
        return (
            <SelectorPage
                G={G}
                goHome={goHome}
                editingVehicleKey={editingVehicleKey}
                vehicle={vehicle}
                setVehicle={setVehicle}
                allMakes={allMakes}
                modelsBySelection={modelsBySelection}
                trimOptions={trimOptions}
                useVin={useVin}
                setUseVin={setUseVin}
                vehicleError={vehicleError}
                decodeVIN={decodeVIN}
                loadVehicle={loadVehicle}
                fetchingVehicles={fetchingVehicles}
            />
        )
    }

    if (screen === "hub") {
        return <HubPage G={G} goHome={goHome} vehicle={vehicle} garage={garage} setScreen={setScreen} selectedPart={selectedPart} />
    }

    if (screen === "garage") {
        return (
            <GaragePage
                G={G}
                goHome={goHome}
                garage={garage}
                setScreen={setScreen}
                setVehicle={setVehicle}
                normalizeVehicle={normalizeVehicle}
                removeVehicleFromGarage={removeVehicleFromGarage}
                setUseVin={setUseVin}
                setEditingVehicleKey={setEditingVehicleKey}
            />
        )
    }

    if (screen === "maintenance") {
        return <MaintenancePage G={G} goHome={goHome} vehicle={vehicle} maintenanceList={maintenanceList} setScreen={setScreen} />
    }

    if (screen === "recalls") {
        return <RecallPage vehicle={vehicle} onBack={() => setScreen("hub")} />
    }

    if (screen === "parts") {
        return (
            <PartsPage
                G={G}
                goHome={goHome}
                vehicle={vehicle}
                partsLoading={partsLoading}
                partsError={partsError}
                categories={categories}
                catFilter={catFilter}
                setCatFilter={setCatFilter}
                visibleParts={visibleParts}
                diffColor={DIFF_COLOR}
                diffLabel={DIFF_LABEL}
                startRepair={startRepair}
                selectedPart={selectedPart}
                choosePartOnly={choosePartOnly}
                goToTutorial={goToTutorial}
                setScreen={setScreen}
            />
        )
    }

    if (screen === "diagnosis") {
        return (
            <SymptomDiagnosisPage
                G={G}
                goHome={goHome}
                vehicle={vehicle}
                msgs={diagnosisMsgs}
                loading={diagnosisLoading}
                input={diagnosisInput}
                setInput={setDiagnosisInput}
                sendDiagnosis={sendDiagnosis}
                chatEl={diagnosisChatEl}
                clearDiagnosis={() => {
                    setDiagnosisMsgs([])
                    setDiagnosisInput("")
                }}
                setScreen={setScreen}
            />
        )
    }

    if (screen === "obdLookup") {
        return <OBDLookupPage G={G} goHome={goHome} setScreen={setScreen} />
    }

    if (screen === "repair" && selectedPart) {
        return (
            <RepairPage
                G={G}
                goHome={goHome}
                selectedPart={selectedPart}
                vehicle={vehicle}
                guide={activeGuide}
                step={step}
                done={done}
                setStep={setStep}
                completeStep={completeStep}
                setScreen={setScreen}
                msgs={msgs}
                loading={loading}
                sendAI={sendAI}
                input={input}
                setInput={setInput}
                chatEl={chatEl}
            />
        )
    }

    return null
}
