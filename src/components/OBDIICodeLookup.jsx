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

export default function OBDIICodeLookup() {
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
        <section className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-start gap-3">
                <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-amber-400" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3v18" />
                        <path d="M7 4h9l-2 4 2 4H7" />
                    </svg>
                </span>
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">OBD-II Code Lookup</h2>
                    <p className="mt-1 text-sm text-zinc-400">Paste a fault code for plain English</p>
                </div>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                    type="text"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    placeholder="e.g., P0420"
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none ring-0 transition focus:border-amber-500"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                    Search
                </button>
            </form>

            {error && (
                <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                </p>
            )}

            {result && (
                <article className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900/70 p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-semibold text-zinc-300">{result.code}</span>
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${result.urgency === "High" ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>
                            Urgency: {result.urgency}
                        </span>
                    </div>

                    <p className="text-sm leading-6 text-zinc-200">{result.description}</p>

                    <div className="mt-3 grid gap-2 text-sm text-zinc-300">
                        <p>
                            <span className="font-medium text-zinc-100">Safe to drive:</span>{" "}
                            {result.safeToDrive ? "Yes (short trips only until diagnosed)." : "No (risk of damage or stalling)."}
                        </p>
                        <p>
                            <span className="font-medium text-zinc-100">Repair path:</span>{" "}
                            {result.repairPath}
                        </p>
                    </div>
                </article>
            )}
        </section>
    )
}
