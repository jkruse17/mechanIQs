import { useState, useEffect } from "react"

const NHTSA_BASE = "https://api.nhtsa.gov/recalls"

export default function RecallPage({ vehicle, onBack }) {
    const [recalls, setRecalls] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [acknowledged, setAcknowledged] = useState({})

    useEffect(() => {
        const fetchRecalls = async () => {
            setLoading(true)
            setError("")
            try {
                const res = await fetch(`${NHTSA_BASE}/recallsByVehicle?make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}&modelYear=${vehicle.year}`)
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                const data = await res.json()
                setRecalls(data.results || [])
            } catch (err) {
                console.error("Recall fetch failed", err)
                setError("Failed to fetch recalls. Check network or try again.")
            } finally {
                setLoading(false)
            }
        }
        fetchRecalls()
    }, [vehicle])

    const toggleAcknowledged = (id) => {
        setAcknowledged(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const G = {
        app: { minHeight: "100vh", background: "#0b0b0b", color: "#ede9e1", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontSize: "14px" },
        topbar: { height: "48px", borderBottom: "1px solid #222", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
        logo: { fontWeight: "700", fontSize: "16px", letterSpacing: "0.06em", color: "#e8890c" },
        ghost: { background: "none", border: "1px solid #2a2a2a", color: "#666", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.04em" },
        btn: (color = "#e8890c") => ({ background: color, border: "none", color: "#0b0b0b", padding: "10px 22px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700", fontSize: "12px", letterSpacing: "0.06em" }),
    }

    return (
        <div style={G.app}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={G.logo}>CARFIXR</span>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ Recalls</span>
                </div>
                <button onClick={onBack} style={G.ghost}>← HUB</button>
            </div>
            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>ACTIVE RECALLS</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700" }}>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Check for open recalls. Acknowledge resolved ones below.</p>
                </div>

                {loading && <p>Loading recalls...</p>}
                {error && <p style={{ color: "#e04444" }}>{error}</p>}

                {!loading && !error && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {recalls.length === 0 ? (
                            <p>No active recalls found for this vehicle.</p>
                        ) : (
                            recalls.map(recall => (
                                <div key={recall.NHTSACampaignNumber} style={{
                                    border: "1px solid #2a2a2a",
                                    borderRadius: "4px",
                                    padding: "18px",
                                    background: acknowledged[recall.NHTSACampaignNumber] ? "rgba(34, 197, 94, 0.15)" : "#1a0a0a",
                                    borderColor: acknowledged[recall.NHTSACampaignNumber] ? "#2a2a2a" : "#e04444"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <div>
                                            <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px", color: acknowledged[recall.NHTSACampaignNumber] ? "#ede9e1" : "#e04444" }}>
                                                {recall.Component || "Unknown Component"}
                                            </div>
                                            <div style={{ fontSize: "12px", color: acknowledged[recall.NHTSACampaignNumber] ? "#333333" : "#555" }}>Recall #: {recall.NHTSACampaignNumber}</div>
                                        </div>
                                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: acknowledged[recall.NHTSACampaignNumber] ? "#333333" : "#888" }}>
                                            <input
                                                type="checkbox"
                                                checked={acknowledged[recall.NHTSACampaignNumber] || false}
                                                onChange={() => toggleAcknowledged(recall.NHTSACampaignNumber)}
                                            />
                                            Acknowledged
                                        </label>
                                    </div>
                                    <div style={{ fontSize: "14px", lineHeight: "1.5", color: acknowledged[recall.NHTSACampaignNumber] ? "#333333" : "#ccc" }}>
                                        {recall.Summary || "No summary available."}
                                    </div>
                                    {recall.Consequence && (
                                        <div style={{ marginTop: "12px", fontSize: "13px", color: acknowledged[recall.NHTSACampaignNumber] ? "#666666" : "#aaa", fontStyle: "italic" }}>
                                            Consequence: {recall.Consequence}
                                        </div>
                                    )}
                                    {recall.Remedy && (
                                        <div style={{ marginTop: "8px", fontSize: "13px", color: acknowledged[recall.NHTSACampaignNumber] ? "#666666" : "#aaa" }}>
                                            Remedy: {recall.Remedy}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}