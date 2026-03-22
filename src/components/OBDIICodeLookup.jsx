"use client"

import { useState } from "react"

const OBD_SPREADSHEET = [
    {
        code: "P0420",
        description: "Catalyst system efficiency is below threshold on bank 1.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect exhaust leaks, verify O2 sensor readings, then test catalytic converter performance.",
    },
    {
        code: "P0301",
        description: "Cylinder 1 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check spark plug and coil on cylinder 1, test injector pulse, then run compression test.",
    },
    {
        code: "P0171",
        description: "System too lean on bank 1.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Look for intake vacuum leaks, inspect MAF sensor, and verify fuel pressure under load.",
    },
    {
        code: "P0128",
        description: "Coolant temperature is below thermostat regulating temperature.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Confirm engine warm-up time, inspect thermostat operation, and replace thermostat if stuck open.",
    },
    {
        code: "P0455",
        description: "EVAP system leak detected (gross leak).",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Tighten or replace fuel cap, inspect EVAP hoses and purge/vent valves, then run smoke test.",
    },
]

export default function OBDIICodeLookup({ G }) {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState(null)
    const [error, setError] = useState("")

    const onSubmit = (event) => {
        event.preventDefault()

        const normalizedQuery = query.trim().toUpperCase()
        if (!normalizedQuery) {
            setResult(null)
            setError("Enter a code to search.")
            return
        }

        const match = OBD_SPREADSHEET.find(item => item.code.toUpperCase() === normalizedQuery)
        if (!match) {
            setResult(null)
            setError(`No match found for ${normalizedQuery}.`)
            return
        }

        setResult(match)
        setError("")
    }

    return (
        <section style={{ border: "1px solid #1e1e1e", borderRadius: "4px", background: "#090909", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div
                    aria-hidden="true"
                    style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "3px",
                        border: "1px solid #2a2a2a",
                        display: "grid",
                        placeItems: "center",
                        color: "#e8890c",
                        fontSize: "13px",
                        lineHeight: 1,
                    }}
                >
                    ⚑
                </div>
                <div>
                    <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "2px" }}>OBD-II Code Lookup</h2>
                    <p style={{ fontSize: "12px", color: "#777" }}>Paste a fault code for plain English</p>
                </div>
            </div>

            <form onSubmit={onSubmit} style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    value={query}
                    onChange={event => setQuery(event.target.value.toUpperCase())}
                    placeholder="e.g., P0420"
                    style={{
                        flex: 1,
                        minWidth: "220px",
                        background: "#111",
                        border: "1px solid #2a2a2a",
                        color: "#ede9e1",
                        padding: "10px 12px",
                        borderRadius: "3px",
                        fontFamily: "inherit",
                        fontSize: "12px",
                        outline: "none",
                    }}
                />
                <button type="submit" style={{ ...G.btn("#e8890c"), padding: "10px 14px" }}>
                    SEARCH
                </button>
            </form>

            {error && (
                <p style={{ border: "1px solid #4a1f1f", background: "#1a0d0d", color: "#d59d9d", borderRadius: "3px", padding: "9px 10px", fontSize: "12px" }}>
                    {error}
                </p>
            )}

            {result && (
                <article style={{ border: "1px solid #2a2a2a", borderRadius: "4px", background: "#0e0e0e", padding: "12px", display: "grid", gap: "9px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ background: "#161616", border: "1px solid #2a2a2a", padding: "4px 8px", borderRadius: "3px", fontSize: "11px", color: "#c8c4bc", letterSpacing: "0.04em" }}>
                            CODE: {result.code}
                        </span>
                        <span
                            style={{
                                background: result.urgency === "High" ? "#2a1111" : "#2a210e",
                                border: `1px solid ${result.urgency === "High" ? "#5d2424" : "#5a4516"}`,
                                color: result.urgency === "High" ? "#ef9a9a" : "#f0cc70",
                                padding: "4px 8px",
                                borderRadius: "3px",
                                fontSize: "11px",
                                letterSpacing: "0.04em",
                            }}
                        >
                            URGENCY: {result.urgency}
                        </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "#c8c4bc", lineHeight: "1.6" }}>{result.description}</p>

                    <p style={{ fontSize: "12px", color: "#c8c4bc", lineHeight: "1.6" }}>
                        <span style={{ color: "#ede9e1", fontWeight: "700" }}>Safe to drive:</span>{" "}
                        {result.safeToDrive ? "Yes (short trips only until diagnosed)." : "No (risk of damage or stalling)."}
                    </p>

                    <p style={{ fontSize: "12px", color: "#c8c4bc", lineHeight: "1.6" }}>
                        <span style={{ color: "#ede9e1", fontWeight: "700" }}>Repair path:</span>{" "}
                        {result.repairPath}
                    </p>
                </article>
            )}
        </section>
    )
}
