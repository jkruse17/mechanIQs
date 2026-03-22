import { GUIDE } from "../constants/appData"

const BRAKE_PAD_GUIDE = [
    {
        title: "Gather tools & supplies",
        detail: "Collect all tools before lifting the vehicle. Prep now prevents unsafe shortcuts later.",
        tools: ["12mm socket & ratchet", "C-clamp or brake piston tool", "Brake cleaner", "Torque wrench", "Gloves"],
        gotcha: null,
    },
    {
        title: "Loosen lugs, lift, and remove wheel",
        detail: "Crack lug nuts with the wheel on the ground, then safely jack and support the vehicle before wheel removal.",
        tools: ["Lug wrench", "Floor jack", "Jack stands"],
        gotcha: "⚠ Never work under a vehicle supported only by a jack.",
    },
    {
        title: "Remove caliper and old pads",
        detail: "Unbolt caliper guide pins, support the caliper, and remove the inner/outer pads from the bracket.",
        tools: ["12mm socket", "Bungee cord or wire"],
        gotcha: "⚠ Do not let the caliper hang by the brake hose.",
    },
    {
        title: "Compress piston and install new pads",
        detail: "Compress the caliper piston fully, apply brake grease to pad contact points, and install new pads.",
        tools: ["C-clamp", "Brake grease"],
        gotcha: "⚠ Keep grease off the friction material and rotor surface.",
    },
    {
        title: "Reassemble and verify brakes",
        detail: "Reinstall caliper and wheel, torque hardware to spec, then pump the brake pedal until firm before driving.",
        tools: ["Torque wrench"],
        gotcha: "⚠ First pedal press can go to the floor if you skip pedal pumping.",
    },
]

const FILTER_GUIDE = [
    {
        title: "Identify filter housing",
        detail: "Locate the target housing and verify you have the correct replacement filter before disassembly.",
        tools: ["Replacement filter", "Work light"],
        gotcha: null,
    },
    {
        title: "Open housing carefully",
        detail: "Release clips or fasteners and open the cover without forcing brittle plastic tabs.",
        tools: ["Screwdriver or trim tool (if needed)"],
        gotcha: "⚠ Housing tabs are easy to crack when cold.",
    },
    {
        title: "Replace filter and clean debris",
        detail: "Remove old filter, vacuum leaves/debris, and install new filter in the correct airflow orientation.",
        tools: ["Vacuum", "Shop towel"],
        gotcha: "⚠ Airflow arrow direction must match the housing marking.",
    },
    {
        title: "Close housing and validate",
        detail: "Re-seat cover evenly, fasten clips/screws, and confirm there are no gaps or rattles.",
        tools: [],
        gotcha: null,
    },
]

const BATTERY_GUIDE = [
    {
        title: "Prepare and protect memory settings",
        detail: "Turn vehicle off and gather tools. Save radio/clock settings if your model requires it.",
        tools: ["10mm wrench", "Battery terminal brush", "Gloves", "Safety glasses"],
        gotcha: null,
    },
    {
        title: "Disconnect old battery safely",
        detail: "Disconnect negative terminal first, then positive. Remove hold-down bracket and lift out battery.",
        tools: ["10mm socket", "Battery strap (optional)"],
        gotcha: "⚠ Always remove the negative terminal first to reduce short risk.",
    },
    {
        title: "Clean terminals and tray",
        detail: "Clean corrosion from terminals and inspect tray/hold-down for damage before installing new unit.",
        tools: ["Terminal cleaner", "Baking soda solution"],
        gotcha: "⚠ Prevent corrosion residue from contacting painted surfaces.",
    },
    {
        title: "Install new battery and reconnect",
        detail: "Place new battery correctly, secure hold-down, connect positive terminal first, then negative terminal.",
        tools: ["10mm wrench"],
        gotcha: "⚠ Reversing terminal order can create dangerous sparks.",
    },
]

const includesAny = (text, patterns) => patterns.some(p => text.includes(p))

export const buildGuideForPart = (part, vehicle) => {
    const name = (part?.name || "").toLowerCase()

    let baseGuide = GUIDE
    if (includesAny(name, ["brake pad", "brakes"])) {
        baseGuide = BRAKE_PAD_GUIDE
    } else if (includesAny(name, ["air filter", "cabin filter", "filter"])) {
        baseGuide = FILTER_GUIDE
    } else if (includesAny(name, ["battery"])) {
        baseGuide = BATTERY_GUIDE
    }

    const vehicleLabel = [vehicle?.year, vehicle?.make, vehicle?.model, vehicle?.trim].filter(Boolean).join(" ")

    return baseGuide.map(step => ({
        ...step,
        detail: vehicleLabel ? `${step.detail} (${vehicleLabel})` : step.detail,
    }))
}
