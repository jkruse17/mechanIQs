export const NHTSA_BASE = "https://vpic.nhtsa.dot.gov/api/vehicles"
export const YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => String(2026 - i))

export const TOP_MAKES = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dodge", "Daimler", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Koenigsegg", "Lamborghini", "Land Rover", "Lexus", "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Pagani", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Saab", "Seat", "Skoda", "Smart", "Subaru", "Suzuki", "Tesla", "Toyota", "Vauxhall", "Volkswagen", "Volvo"
]
export const FALLBACK_MAKES = TOP_MAKES

export const MODEL_TRIMS_BY_YEAR = {
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

export const MODEL_TRIMS = {
    "Lexus|IS": ["IS-200", "IS-300", "IS-350", "IS-500", "IS-F"],
    "Toyota|Camry": ["LE", "SE", "XLE", "XSE", "TRD"],
    "Honda|Civic": ["LX", "EX", "Sport", "Si", "Type R"],
    "Ford|F-150": ["XL", "STX", "XLT", "Lariat", "King Ranch", "Limited", "Tremor", "Raptor"],
    "BMW|3 Series": ["320i", "330i", "340i", "M3"],
}

export const PARTS = [
    { id: 1, name: "Front Brake Pads", cat: "Brakes", diff: 2, time: "1.5 hrs", oem: 85, am: 35, csat: 87, hasGuide: true },
    { id: 2, name: "Engine Air Filter", cat: "Engine", diff: 1, time: "15 min", oem: 32, am: 18, csat: 96, hasGuide: false },
    { id: 3, name: "Oil & Filter Change", cat: "Engine", diff: 1, time: "30 min", oem: 55, am: 28, csat: 94, hasGuide: false },
    { id: 4, name: "Cabin Air Filter", cat: "HVAC", diff: 1, time: "10 min", oem: 38, am: 16, csat: 98, hasGuide: false },
    { id: 5, name: "Spark Plugs (4)", cat: "Engine", diff: 2, time: "45 min", oem: 48, am: 22, csat: 82, hasGuide: false },
    { id: 6, name: "Wiper Blades", cat: "Exterior", diff: 1, time: "5 min", oem: 28, am: 14, csat: 99, hasGuide: false },
    { id: 7, name: "Rear Brake Pads", cat: "Brakes", diff: 2, time: "1.5 hrs", oem: 80, am: 32, csat: 85, hasGuide: false },
    { id: 8, name: "Battery Replacement", cat: "Electrical", diff: 1, time: "20 min", oem: 180, am: 95, csat: 91, hasGuide: false },
]

export const GUIDE = [
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

export const MAINTENANCE = [
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

export const DIFF_LABEL = ["", "Easy", "Moderate", "Hard"]
export const DIFF_COLOR = ["", "#4a9", "#e8a020", "#e04444"]

export const DEFAULT_VEHICLE = { year: "", make: "", model: "", trim: "", odometer: "", vin: "" }
export const GARAGE_STORAGE_KEY = "mechaniqs.garage.v1"
export const LAST_VEHICLE_STORAGE_KEY = "mechaniqs.lastVehicle.v1"
export const LAST_SELECTED_PART_STORAGE_KEY = "mechaniqs.lastSelectedPart.v1"
export const LAST_CATEGORY_FILTER_STORAGE_KEY = "mechaniqs.lastCategoryFilter.v1"
export const LAST_SCREEN_STORAGE_KEY = "mechaniqs.lastScreen.v1"
export const LAST_LIVE_PARTS_STORAGE_KEY = "mechaniqs.lastLiveParts.v1"
export const LAST_TUTORIAL_STEP_STORAGE_KEY = "mechaniqs.lastTutorialStep.v1"
export const LAST_DONE_STEPS_STORAGE_KEY = "mechaniqs.lastDoneSteps.v1"
export const LAST_REPAIR_CHAT_STORAGE_KEY = "mechaniqs.lastRepairChat.v1"
export const LAST_DIAGNOSIS_CHAT_STORAGE_KEY = "mechaniqs.lastDiagnosisChat.v1"

export const FONT_IMPORT_STYLE = "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }"
export const FONT_IMPORT_STYLE_NO_ITALIC = "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }"
