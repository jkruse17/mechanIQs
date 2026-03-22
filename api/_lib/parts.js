export const parsePrice = (value) => {
  if (value == null) return null
  const n = Number(String(value).replace(/[^0-9.]/g, ""))
  return Number.isFinite(n) ? n : null
}

export const normalizePartQuery = (value) => {
  const raw = String(value || "").trim()
  if (!raw) return "Wiper Blade"

  const cleaned = raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  const partAliases = {
    "cabin air filter": "Cabin Air Filter",
    "engine air filter": "Engine Air Filter",
    "spark plugs": "Spark Plug",
    "spark plug": "Spark Plug",
    "wiper blades": "Wiper Blade",
    "wiper blade": "Wiper Blade",
    "rear brake pads": "Rear Brake Pad",
    "rear brake pad": "Rear Brake Pad",
    "battery replacement": "Car Battery",
    "battery": "Car Battery",
    "front brake pads": "Front Brake Pad",
    "front brake pad": "Front Brake Pad",
  }

  if (partAliases[cleaned]) return partAliases[cleaned]
  return cleaned
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

export const normalizePart = (item, index) => {
  const name = item.partName || item.name || item.title || item.description || "Unknown Part"
  const cat = item.category || item.partCategory || item.section || "Other"
  const am = parsePrice(item.price) ?? parsePrice(item.aftermarketPrice) ?? parsePrice(item.amPrice) ?? 40
  const oem = parsePrice(item.oemPrice) ?? parsePrice(item.listPrice) ?? Math.round(am * 1.6)

  return {
    id: item.id || `${Date.now()}-${index}`,
    name,
    cat,
    diff: 1,
    time: "-",
    oem,
    am,
    csat: 90,
    hasGuide: false,
    brand: item.brand || item.manufacturer || "",
    partNumber: item.partNumber || item.sku || "",
    url: item.url || item.link || "",
  }
}

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
