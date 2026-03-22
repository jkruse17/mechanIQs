import { useEffect, useMemo, useState } from "react"
import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

const SOON_THRESHOLD_MILES = 1000

export default function MaintenancePage({ G, goHome, vehicle, maintenanceList, setScreen }) {
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [sortMode, setSortMode] = useState("DUE_FIRST")
    const [serviceOverrides, setServiceOverrides] = useState({})

    const vehicleKey = `${vehicle.year}|${vehicle.make}|${vehicle.model}|${vehicle.trim || ""}`
    const odometer = Number.parseInt(vehicle.odometer, 10) || 0

    useEffect(() => {
        setServiceOverrides({})
    }, [vehicleKey])

    const enrichedItems = useMemo(() => {
        return maintenanceList.map(item => {
            const override = serviceOverrides[item.name]
            const nextDue = override?.nextDue ?? item.nextDue
            const justCompleted = Boolean(override?.justCompleted)
            const milesRemaining = nextDue - odometer
            const isDue = !justCompleted && milesRemaining <= 0
            const isSoon = !justCompleted && !isDue && milesRemaining <= SOON_THRESHOLD_MILES

            let status = "UPCOMING"
            if (justCompleted) status = "COMPLETED"
            else if (isDue) status = "DUE"
            else if (isSoon) status = "SOON"

            return {
                ...item,
                nextDue,
                milesRemaining,
                isDue,
                isSoon,
                justCompleted,
                status,
            }
        })
    }, [maintenanceList, serviceOverrides, odometer])

    const metrics = useMemo(() => {
        const dueNow = enrichedItems.filter(item => item.status === "DUE").length
        const dueSoon = enrichedItems.filter(item => item.status === "SOON").length
        const completed = enrichedItems.filter(item => item.status === "COMPLETED").length
        return { dueNow, dueSoon, completed }
    }, [enrichedItems])

    const visibleItems = useMemo(() => {
        const filtered = enrichedItems.filter(item => {
            if (statusFilter === "ALL") return true
            return item.status === statusFilter
        })

        const sorted = [...filtered]
        if (sortMode === "DUE_FIRST") {
            sorted.sort((a, b) => a.nextDue - b.nextDue)
        } else if (sortMode === "CATEGORY") {
            sorted.sort((a, b) => a.category.localeCompare(b.category) || a.nextDue - b.nextDue)
        } else {
            sorted.sort((a, b) => a.name.localeCompare(b.name))
        }
        return sorted
    }, [enrichedItems, sortMode, statusFilter])

    const markCompleted = (item) => {
        setServiceOverrides(prev => ({
            ...prev,
            [item.name]: {
                nextDue: Math.max(odometer, item.nextDue) + item.interval,
                justCompleted: true,
            },
        }))
    }

    const clearCompletion = (itemName) => {
        setServiceOverrides(prev => {
            const next = { ...prev }
            delete next[itemName]
            return next
        })
    }

    const statusColor = (status) => {
        if (status === "DUE") return "#e8890c"
        if (status === "SOON") return "#e8c04a"
        if (status === "COMPLETED") return "#4a9"
        return "#888"
    }

    const statusText = (item) => {
        if (item.status === "COMPLETED") return `COMPLETED • Next at ${item.nextDue.toLocaleString()} miles`
        if (item.status === "DUE") return "DUE NOW"
        if (item.status === "SOON") return `DUE SOON • ${item.milesRemaining.toLocaleString()} miles left`
        return `Due at ${item.nextDue.toLocaleString()} miles`
    }

    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>Maintenance</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("help")} style={G.ghost}>HELP</button>
                    <button onClick={() => setScreen("about")} style={G.ghost}>ABOUT</button>
                </div>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "24px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>MAINTENANCE SCHEDULE</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700" }}>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Current odometer: {odometer.toLocaleString()} miles</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", background: "#0e0e0e", padding: "12px" }}>
                        <div style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em" }}>DUE NOW</div>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: "#e8890c" }}>{metrics.dueNow}</div>
                    </div>
                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", background: "#0e0e0e", padding: "12px" }}>
                        <div style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em" }}>DUE SOON</div>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: "#e8c04a" }}>{metrics.dueSoon}</div>
                    </div>
                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", background: "#0e0e0e", padding: "12px" }}>
                        <div style={{ fontSize: "10px", color: "#666", letterSpacing: "0.08em" }}>COMPLETED THIS SESSION</div>
                        <div style={{ fontSize: "22px", fontWeight: "700", color: "#4a9" }}>{metrics.completed}</div>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "14px" }}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {[
                            { id: "ALL", label: "All" },
                            { id: "DUE", label: "Due" },
                            { id: "SOON", label: "Soon" },
                            { id: "UPCOMING", label: "Upcoming" },
                            { id: "COMPLETED", label: "Completed" },
                        ].map(filter => (
                            <button key={filter.id} onClick={() => setStatusFilter(filter.id)} style={G.pill(statusFilter === filter.id)}>{filter.label.toUpperCase()}</button>
                        ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#666" }}>Sort</span>
                        <select
                            value={sortMode}
                            onChange={(e) => setSortMode(e.target.value)}
                            style={{ background: "#111", border: "1px solid #2a2a2a", color: "#ddd", fontFamily: "inherit", fontSize: "11px", padding: "6px 8px", borderRadius: "3px" }}
                        >
                            <option value="DUE_FIRST">Due First</option>
                            <option value="CATEGORY">Category</option>
                            <option value="ALPHA">A-Z</option>
                        </select>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {visibleItems.map(item => (
                        <div key={item.name} style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "14px", background: "#0e0e0e" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                <div>
                                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>{item.name}</div>
                                    <div style={{ fontSize: "12px", color: "#555" }}>Every {item.interval.toLocaleString()} miles • {item.category}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "13px", color: statusColor(item.status), fontWeight: "700" }}>{statusText(item)}</div>
                                </div>
                            </div>
                            <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "11px", color: "#666" }}>Next due mileage: {item.nextDue.toLocaleString()}</span>
                                <div style={{ display: "flex", gap: "6px" }}>
                                    {item.justCompleted ? (
                                        <button onClick={() => clearCompletion(item.name)} style={{ ...G.btn("#1e1e1e"), color: "#ddd" }}>UNDO</button>
                                    ) : (
                                        <button onClick={() => markCompleted(item)} style={G.btn("#4a9")}>MARK COMPLETE</button>
                                    )}
                                    <button onClick={() => setScreen("repairs")} style={G.btn("#e8890c")}>FIND PARTS</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {visibleItems.length === 0 && (
                        <div style={{ border: "1px dashed #2a2a2a", borderRadius: "4px", padding: "18px", color: "#666", fontSize: "12px" }}>
                            No maintenance items in this filter.
                        </div>
                    )}
                </div>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <button onClick={() => setScreen("repairs")} style={G.btn()}>BROWSE REPAIR CATALOG →</button>
                </div>
            </div>
        </div>
    )
}
