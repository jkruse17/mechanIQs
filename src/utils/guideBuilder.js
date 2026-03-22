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

const FRONT_BRAKE_PADS_GUIDE = [
    {
        title: "Prep front brake service safely",
        detail: "Gather pads, cleaner, lube, and torque tools before lifting the front axle.",
        tools: ["Floor jack", "Jack stands", "Lug wrench", "14mm/17mm socket set", "Torque wrench"],
        gotcha: "⚠ Chock rear wheels before lifting the front of the car.",
    },
    {
        title: "Remove caliper and old front pads",
        detail: "Lift front corner, remove wheel, unbolt caliper, then remove front pad set and hardware.",
        tools: ["Socket set", "Bungee cord"],
        gotcha: "⚠ Hang the caliper; do not let it pull on the brake hose.",
    },
    {
        title: "Compress piston and install new pads",
        detail: "Compress front caliper piston, lubricate contact points, and install new pads and clips.",
        tools: ["C-clamp or piston tool", "Brake grease"],
        gotcha: "⚠ Keep grease off pad friction surfaces and rotor face.",
    },
    {
        title: "Torque and bed-in front brakes",
        detail: "Reassemble, torque caliper and wheel hardware, pump pedal, then perform gentle brake bedding.",
        tools: ["Torque wrench"],
        gotcha: "⚠ Do not drive until pedal feel is firm.",
    },
]

const REAR_BRAKE_PADS_GUIDE = [
    {
        title: "Set parking brake strategy first",
        detail: "Confirm whether your rear setup needs parking brake released or service mode before disassembly.",
        tools: ["Scan tool (if EPB)", "Wheel chocks", "Jack and stands"],
        gotcha: "⚠ Electronic parking brake systems may be damaged if not placed in service mode.",
    },
    {
        title: "Remove rear caliper and pads",
        detail: "Remove rear wheel, unbolt caliper, and take out old rear pads and abutment hardware.",
        tools: ["Socket set", "Bungee cord"],
        gotcha: "⚠ Rear brake dust can contain irritants; avoid blowing it with compressed air.",
    },
    {
        title: "Retract rear piston correctly",
        detail: "Use the correct rear piston tool for your caliper type, then install new pads and clips.",
        tools: ["Rear piston wind-back tool", "Brake grease"],
        gotcha: "⚠ Some rear pistons must be rotated while retracting.",
    },
    {
        title: "Re-enable parking brake and verify",
        detail: "Reassemble, torque hardware, restore parking brake mode, then pump pedal and test at low speed.",
        tools: ["Torque wrench"],
        gotcha: "⚠ Confirm parking brake operation before regular driving.",
    },
]

const ENGINE_AIR_FILTER_GUIDE = [
    {
        title: "Locate and open airbox",
        detail: "Find the engine airbox and release clips or fasteners without forcing tabs.",
        tools: ["Screwdriver (if required)", "Work light"],
        gotcha: "⚠ Brittle clips can crack in cold weather.",
    },
    {
        title: "Remove and inspect old filter",
        detail: "Lift out old element and inspect for debris, oiling issues, or rodent nesting.",
        tools: ["Shop towel"],
        gotcha: "⚠ Do not let debris fall into the intake tract.",
    },
    {
        title: "Install new engine air filter",
        detail: "Seat the new filter fully in the channel and verify perimeter seal contact.",
        tools: ["Replacement filter"],
        gotcha: "⚠ A pinched seal can trigger MAF-related drivability issues.",
    },
    {
        title: "Close housing and confirm fit",
        detail: "Re-latch clips or screws evenly and verify no unmetered air gaps remain.",
        tools: [],
        gotcha: null,
    },
]

const OIL_FILTER_CHANGE_GUIDE = [
    {
        title: "Warm engine and prepare work area",
        detail: "Warm oil slightly, position drain pan, and safely support vehicle if clearance is limited.",
        tools: ["Drain pan", "Jack stands", "Gloves", "New oil and filter"],
        gotcha: "⚠ Hot oil can burn; keep engine warm, not fully hot.",
    },
    {
        title: "Drain old oil fully",
        detail: "Remove drain plug, allow complete drain, and inspect plug/washer condition.",
        tools: ["Socket/box wrench", "New crush washer"],
        gotcha: "⚠ Cross-threading the oil pan can cause expensive repairs.",
    },
    {
        title: "Replace filter and refill",
        detail: "Remove old filter, oil the new gasket, install hand-tight, reinstall plug, then refill to spec.",
        tools: ["Oil filter wrench", "Funnel"],
        gotcha: "⚠ Ensure old filter gasket is not stuck on the engine mating surface.",
    },
    {
        title: "Run, inspect leaks, and reset interval",
        detail: "Start engine, check for leaks, verify dipstick level, then reset maintenance reminder.",
        tools: ["Clean rag"],
        gotcha: "⚠ Recheck level after a short run and top up as needed.",
    },
]

const CABIN_AIR_FILTER_GUIDE = [
    {
        title: "Access cabin filter door",
        detail: "Open glove box or cowl panel area based on vehicle layout and expose filter housing.",
        tools: ["Trim tool", "Screwdriver (if needed)"],
        gotcha: "⚠ Do not force glove box dampers or side stops.",
    },
    {
        title: "Remove old filter and clean housing",
        detail: "Slide out filter, remove leaves/dust, and wipe housing before install.",
        tools: ["Vacuum", "Shop towel"],
        gotcha: "⚠ Debris can fall into blower fan if housing is overfilled.",
    },
    {
        title: "Install new filter in airflow direction",
        detail: "Insert new filter with airflow arrow aligned to housing marking.",
        tools: ["Replacement cabin filter"],
        gotcha: "⚠ Wrong airflow orientation reduces HVAC performance.",
    },
    {
        title: "Reassemble trim and test blower",
        detail: "Close filter door, reinstall trim, and run fan at all speeds to confirm no noise.",
        tools: [],
        gotcha: null,
    },
]

const SPARK_PLUGS_GUIDE = [
    {
        title: "Remove ignition coil covers",
        detail: "Remove engine cover if equipped, disconnect coil connectors, and unbolt coils.",
        tools: ["Socket set", "Pick tool"],
        gotcha: "⚠ Label coil positions if harness routing is tight.",
    },
    {
        title: "Extract old spark plugs",
        detail: "Use a spark plug socket and extension to remove plugs from all cylinders.",
        tools: ["Spark plug socket", "Extension", "Ratchet"],
        gotcha: "⚠ Remove plugs on a cool engine to reduce thread damage risk.",
    },
    {
        title: "Gap-check and install new plugs",
        detail: "Verify plug gap per spec (if applicable), thread by hand first, then torque to spec.",
        tools: ["Feeler gauge", "Torque wrench"],
        gotcha: "⚠ Cross-threaded aluminum heads are a major repair.",
    },
    {
        title: "Reinstall coils and verify idle",
        detail: "Reinstall coils/connectors, start engine, and confirm smooth idle with no misfire codes.",
        tools: ["OBD scanner (optional)"],
        gotcha: "⚠ Loose coil connectors can mimic bad plug symptoms.",
    },
]

const WIPER_BLADES_GUIDE = [
    {
        title: "Protect windshield and raise arms",
        detail: "Lift wiper arms carefully and place a towel on glass in case an arm snaps down.",
        tools: ["Soft towel"],
        gotcha: "⚠ A bare wiper arm can crack windshield glass.",
    },
    {
        title: "Remove old blade assembly",
        detail: "Press tab or release clip and slide blade off arm hook or pin mount.",
        tools: [],
        gotcha: "⚠ Confirm connector style before forcing removal.",
    },
    {
        title: "Install new blades and lock tabs",
        detail: "Attach new blade until it clicks securely and verify adapter fitment.",
        tools: ["Replacement blades"],
        gotcha: "⚠ Mismatched adapter causes blade release while driving.",
    },
    {
        title: "Test wipe pattern",
        detail: "Lower arms gently and test with washer fluid for full, streak-free contact.",
        tools: ["Washer fluid"],
        gotcha: null,
    },
]

const BATTERY_REPLACEMENT_GUIDE = [
    {
        title: "Prepare battery replacement area",
        detail: "Power off vehicle, gather memory saver if desired, and confirm replacement battery spec.",
        tools: ["10mm wrench", "Safety glasses", "Gloves"],
        gotcha: "⚠ Verify battery group size and terminal orientation before install.",
    },
    {
        title: "Disconnect and remove old battery",
        detail: "Remove negative terminal first, then positive, then hold-down bracket and battery.",
        tools: ["Socket set", "Battery strap"],
        gotcha: "⚠ Negative must come off first to reduce short risk.",
    },
    {
        title: "Clean tray and terminals",
        detail: "Neutralize corrosion and clean clamps for low-resistance electrical contact.",
        tools: ["Terminal brush", "Baking soda solution"],
        gotcha: "⚠ Keep corrosion residue off paint and belt-driven components.",
    },
    {
        title: "Install new battery and confirm charging",
        detail: "Install and secure battery, connect positive then negative, and verify charging voltage.",
        tools: ["Multimeter"],
        gotcha: "⚠ Loose terminals can cause intermittent no-start conditions.",
    },
]

const CURATED_GUIDES_BY_PART_NAME = {
    "front brake pads": FRONT_BRAKE_PADS_GUIDE,
    "rear brake pads": REAR_BRAKE_PADS_GUIDE,
    "engine air filter": ENGINE_AIR_FILTER_GUIDE,
    "oil & filter change": OIL_FILTER_CHANGE_GUIDE,
    "cabin air filter": CABIN_AIR_FILTER_GUIDE,
    "spark plugs (4)": SPARK_PLUGS_GUIDE,
    "wiper blades": WIPER_BLADES_GUIDE,
    "battery replacement": BATTERY_REPLACEMENT_GUIDE,
}

const includesAny = (text, patterns) => patterns.some(p => text.includes(p))

export const buildGuideForPart = (part, vehicle) => {
    const name = (part?.name || "").toLowerCase()

    let baseGuide = GUIDE
    if (CURATED_GUIDES_BY_PART_NAME[name]) {
        baseGuide = CURATED_GUIDES_BY_PART_NAME[name]
    } else if (includesAny(name, ["brake pad", "brakes"])) {
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
