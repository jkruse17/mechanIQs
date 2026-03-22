import { DEFAULT_VEHICLE, MODEL_TRIMS, MODEL_TRIMS_BY_YEAR } from "../constants/appData"

export const normalizeVehicle = (v = {}) => ({
    year: String(v.year || "").trim(),
    make: String(v.make || "").trim(),
    model: String(v.model || "").trim(),
    trim: String(v.trim || "").trim(),
    odometer: String(v.odometer || "").trim(),
    vin: String(v.vin || "").trim().toUpperCase(),
})

export const getVehicleKey = (v = {}) => {
    const n = normalizeVehicle(v)
    if (n.vin && n.vin.length === 17) return `VIN:${n.vin}`
    return `YMMT:${n.year}|${n.make}|${n.model}|${n.trim}`.toUpperCase()
}

export const computeTrimOptions = (make, model, year) => {
    const key = `${make}|${model}`
    const yearBuckets = MODEL_TRIMS_BY_YEAR[key] || []
    const bucket = yearBuckets.find(b => year >= b.minYear && year <= b.maxYear)
    if (bucket) return bucket.trims
    return MODEL_TRIMS[key] || []
}

export { DEFAULT_VEHICLE }
