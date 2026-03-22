import { useState, useEffect, useRef } from "react"
import RecallPage from "./RecallPage.jsx"
import Sidebar from "./components/Sidebar"
import {
    DEFAULT_VEHICLE,
    DIFF_COLOR,
    DIFF_LABEL,
    FALLBACK_MAKES,
    GARAGE_STORAGE_KEY,
    GUIDE,
    LAST_DIAGNOSIS_CHAT_STORAGE_KEY,
    LAST_CATEGORY_FILTER_STORAGE_KEY,
    LAST_DONE_STEPS_STORAGE_KEY,
    LAST_LIVE_PARTS_STORAGE_KEY,
    LAST_REPAIR_CHAT_STORAGE_KEY,
    LAST_SCREEN_STORAGE_KEY,
    LAST_TUTORIAL_STEP_STORAGE_KEY,
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
import RepairsPage from "./pages/RepairsPage"
import RepairPage from "./pages/RepairPage"
import SymptomDiagnosisPage from "./pages/SymptomDiagnosisPage"
import OBDLookupPage from "./pages/OBDLookupPage"

export default function MechanIqs({ auth = { enabled: false } }) {
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
    const [authEmail, setAuthEmail] = useState("")
    const [authPassword, setAuthPassword] = useState("")
    const [authError, setAuthError] = useState("")
    const [authBusy, setAuthBusy] = useState(false)
    const [hasHydrated, setHasHydrated] = useState(false)
    const chatEl = useRef(null)
    const diagnosisChatEl = useRef(null)

    const submitSignIn = async () => {
        if (!authEmail.trim() || !authPassword) {
            setAuthError("Email and password are required")
            return
        }

        setAuthBusy(true)
        setAuthError("")
        try {
            await auth.onSignIn?.(authEmail.trim(), authPassword)
        } catch (err) {
            setAuthError(err?.message || "Sign in failed")
        } finally {
            setAuthBusy(false)
        }
    }

    const submitSignUp = async () => {
        if (!authEmail.trim() || !authPassword) {
            setAuthError("Email and password are required")
            return
        }

        setAuthBusy(true)
        setAuthError("")
        try {
            await auth.onSignUp?.(authEmail.trim(), authPassword)
            setAuthError("Check your email for verification, then sign in.")
        } catch (err) {
            setAuthError(err?.message || "Sign up failed")
        } finally {
            setAuthBusy(false)
        }
    }

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
        const validScreens = ["hub", "selector", "garage", "maintenance", "recalls", "repairs", "parts", "diagnosis", "obdLookup", "repair"]
        const parsedGarage = readStorage(GARAGE_STORAGE_KEY, [])
        if (Array.isArray(parsedGarage)) setGarage(parsedGarage)
        else if (parsedGarage && typeof parsedGarage === "object") setGarage(Object.values(parsedGarage))

        const parsedLastScreen = readStorage(LAST_SCREEN_STORAGE_KEY, "hub")
        if (typeof parsedLastScreen === "string" && validScreens.includes(parsedLastScreen)) {
            setScreen(parsedLastScreen)
        }

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

        const parsedLiveParts = readStorage(LAST_LIVE_PARTS_STORAGE_KEY, [])
        if (Array.isArray(parsedLiveParts)) {
            setLiveParts(parsedLiveParts)
        }

        const parsedStep = readStorage(LAST_TUTORIAL_STEP_STORAGE_KEY, 0)
        if (Number.isInteger(parsedStep) && parsedStep >= 0) {
            setStep(parsedStep)
        }

        const parsedDone = readStorage(LAST_DONE_STEPS_STORAGE_KEY, [])
        if (Array.isArray(parsedDone)) {
            const sanitized = [...new Set(parsedDone.filter(Number.isInteger).filter(i => i >= 0))]
            setDone(sanitized)
        }

        const parsedRepairChat = readStorage(LAST_REPAIR_CHAT_STORAGE_KEY, [])
        if (Array.isArray(parsedRepairChat)) {
            const sanitized = parsedRepairChat
                .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
                .slice(-40)
            setMsgs(sanitized)
        }

        const parsedDiagnosisChat = readStorage(LAST_DIAGNOSIS_CHAT_STORAGE_KEY, [])
        if (Array.isArray(parsedDiagnosisChat)) {
            const sanitized = parsedDiagnosisChat
                .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
                .slice(-40)
            setDiagnosisMsgs(sanitized)
        }

        setHasHydrated(true)
    }, [])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(GARAGE_STORAGE_KEY, garage)
    }, [garage, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        if (vehicle.year && vehicle.make && vehicle.model) {
            writeStorage(LAST_VEHICLE_STORAGE_KEY, normalizeVehicle(vehicle))
        }
    }, [vehicle, hasHydrated])

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
        if (!hasHydrated) return
        writeStorage(LAST_SELECTED_PART_STORAGE_KEY, selectedPart || null)
    }, [selectedPart, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_CATEGORY_FILTER_STORAGE_KEY, catFilter)
    }, [catFilter, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_SCREEN_STORAGE_KEY, screen)
    }, [screen, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_LIVE_PARTS_STORAGE_KEY, liveParts)
    }, [liveParts, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_TUTORIAL_STEP_STORAGE_KEY, step)
    }, [step, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_DONE_STEPS_STORAGE_KEY, done)
    }, [done, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_REPAIR_CHAT_STORAGE_KEY, msgs.slice(-40))
    }, [msgs, hasHydrated])

    useEffect(() => {
        if (!hasHydrated) return
        writeStorage(LAST_DIAGNOSIS_CHAT_STORAGE_KEY, diagnosisMsgs.slice(-40))
    }, [diagnosisMsgs, hasHydrated])

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

        const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}`.trim() || "unknown vehicle"
        const completedStepTitles = done
            .filter(i => i >= 0 && i < activeGuide.length)
            .map(i => activeGuide[i]?.title)
            .filter(Boolean)

        const systemPrompt = [
            "You are MECHANIQS AI, a focused practical car repair assistant.",
            "Use the user's selected workflow context exactly as provided.",
            `Vehicle: ${vehicleLabel}.`,
            `Selected repair: ${selectedPart?.name || "unknown repair"}.`,
            `Current app page: ${screen}.`,
            `Step progress: ${step + 1}/${activeGuide.length}.`,
            `Current step title: \"${cur?.title || "unknown step"}\".`,
            `Current step detail: \"${cur?.detail || "none"}\".`,
            `Current safety gotcha: \"${cur?.gotcha || "none"}\".`,
            `Completed steps: ${completedStepTitles.length ? completedStepTitles.join(" | ") : "none"}.`,
            `Current category filter: ${catFilter}.`,
            "Respond in plain text with concise, actionable guidance.",
            "Lead with any safety-critical warning before instructions.",
            "If uncertain, say what the user should verify first.",
        ].join(" ")

        try {
            const res = await fetch("/api/ai-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    maxTokens: 700,
                    temperature: 0.5,
                    systemPrompt,
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

    const startRepair = async (part, options = {}) => {
        const { skipFetch = false, guidePart = null } = options
        const tutorialPart = guidePart || part
        if (!skipFetch) {
            await fetchLiveParts(part.name)
        }
        setActiveGuide(buildGuideForPart(tutorialPart, vehicle))
        setSelectedPart(tutorialPart)
        setStep(0)
        setDone([])
        setMsgs([{
            role: "assistant",
            content: `Ready. I've got context on your ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} and the ${tutorialPart.name} job. Ask me anything — torque specs, gotchas, whether something looks right, or if it's safe to skip a step. Let's get it done.`,
        }])
        setScreen("repair")
    }

    const chooseRepairAndShowCompatible = async (part) => {
        setSelectedPart(part)
        setActiveGuide(buildGuideForPart(part, vehicle))
        setCatFilter("All")
        await fetchLiveParts(part.name)
        setScreen("parts")
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
        setDone(d => (d.includes(step) ? d : [...d, step]))
        if (step < activeGuide.length - 1) setStep(s => s + 1)
    }

    const odometer = parseInt(vehicle.odometer) || 0
    const maintenanceList = MAINTENANCE.map(item => {
        const nextDue = Math.ceil(odometer / item.interval) * item.interval
        const isDue = nextDue === odometer
        return { ...item, nextDue, isDue }
    })

    const repairCategories = ["All", ...new Set(PARTS.map(p => p.cat))]
    const visibleRepairParts = catFilter === "All" ? PARTS : PARTS.filter(p => p.cat === catFilter)
    const compatibleCategories = ["All", ...new Set(liveParts.map(p => p.cat))]
    const visibleCompatibleParts = catFilter === "All" ? liveParts : liveParts.filter(p => p.cat === catFilter)

    const renderContent = () => {
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
            return <RecallPage vehicle={vehicle} setScreen={setScreen} />
        }

        if (screen === "repairs") {
            return (
                <RepairsPage
                    G={G}
                    goHome={goHome}
                    vehicle={vehicle}
                    selectedPart={selectedPart}
                    goToTutorial={goToTutorial}
                    categories={repairCategories}
                    catFilter={catFilter}
                    setCatFilter={setCatFilter}
                    visibleParts={visibleRepairParts}
                    diffColor={DIFF_COLOR}
                    diffLabel={DIFF_LABEL}
                    partsLoading={partsLoading}
                    chooseRepairAndShowCompatible={chooseRepairAndShowCompatible}
                />
            )
        }

        if (screen === "parts") {
            return (
                <PartsPage
                    G={G}
                    goHome={goHome}
                    vehicle={vehicle}
                    partsLoading={partsLoading}
                    partsError={partsError}
                    categories={compatibleCategories}
                    catFilter={catFilter}
                    setCatFilter={setCatFilter}
                    visibleParts={visibleCompatibleParts}
                    startRepair={startRepair}
                    selectedPart={selectedPart}
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

    if (auth.enabled && auth.isLoading) {
        return (
            <div style={{ ...G.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
                <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", background: "#0e0e0e", padding: "20px", color: "#888", fontSize: "13px" }}>
                    Checking authentication...
                </div>
            </div>
        )
    }

    if (auth.enabled && !auth.isAuthenticated) {
        return (
            <div style={{ display: "flex", minHeight: "100vh", height: "100vh", background: "#0b0b0b", overflow: "hidden" }}>
                <Sidebar
                    screen={screen}
                    setScreen={setScreen}
                    vehicle={vehicle}
                    selectedPart={selectedPart}
                    G={G}
                    auth={auth}
                />
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "radial-gradient(circle at 20% 20%, rgba(232,137,12,0.08), transparent 45%), #0b0b0b" }}>
                    <div style={{ maxWidth: "560px", width: "100%", border: "1px solid #2a2a2a", borderRadius: "8px", background: "#101010", padding: "28px", boxShadow: "0 12px 40px rgba(0,0,0,0.45)" }}>
                        <div style={{ fontSize: "10px", color: "#e8890c", letterSpacing: "0.14em", marginBottom: "10px", fontWeight: "700" }}>MECHANIQS ACCESS</div>
                        <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "10px", color: "#f5f1ea" }}>Sign In</h2>
                        <p style={{ color: "#b8b3ab", fontSize: "13px", lineHeight: "1.6", marginBottom: "18px" }}>
                            Sign in to access your garage, live parts lookup, tutorials, and diagnostics.
                        </p>

                        <div style={{ height: "1px", width: "100%", background: "linear-gradient(90deg, #e8890c 0%, #2a2a2a 60%, #2a2a2a 100%)", marginBottom: "16px" }} />

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <input
                                type="email"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="Email"
                                style={{ ...G.input, width: "100%", background: "#0b0b0b", border: "1px solid #2f2f2f", color: "#f2efe8" }}
                            />
                            <input
                                type="password"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                placeholder="Password"
                                style={{ ...G.input, width: "100%", background: "#0b0b0b", border: "1px solid #2f2f2f", color: "#f2efe8" }}
                            />
                            {authError ? <div style={{ color: "#ffb6b6", fontSize: "12px", background: "#2a1515", border: "1px solid #5a2828", padding: "8px 10px", borderRadius: "4px" }}>{authError}</div> : null}
                            <div style={{ display: "flex", gap: "10px", marginTop: "2px" }}>
                                <button onClick={submitSignIn} disabled={authBusy} style={{ ...G.btn("#e8890c"), opacity: authBusy ? 0.7 : 1, minWidth: "120px", fontWeight: "700" }}>
                                    {authBusy ? "WORKING..." : "SIGN IN"}
                                </button>
                                <button onClick={submitSignUp} disabled={authBusy} style={{ ...G.btn("#202020"), color: "#f0ece5", border: "1px solid #3a3a3a", opacity: authBusy ? 0.7 : 1, minWidth: "120px" }}>
                                    {authBusy ? "WORKING..." : "SIGN UP"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const content = renderContent()
    if (!content) return null

    return (
        <div style={{ display: "flex", minHeight: "100vh", height: "100vh", background: "#0b0b0b", overflow: "hidden" }}>
            <Sidebar screen={screen} setScreen={setScreen} vehicle={vehicle} selectedPart={selectedPart} G={G} auth={auth} />
            <div style={{ flex: 1, overflow: "auto" }}>
                {content}
            </div>
        </div>
    )
}
