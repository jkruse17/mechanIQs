// src/constants/obdCodes.js
// Comprehensive OBD-II Diagnostic Trouble Codes Database
// Sources: SAE J2012, ISO 15031-6, NHTSA, automotive industry standards

export const OBD_CODES = [
    // ==================== P CODES (POWERTRAIN) ====================
    // System Too Lean
    {
        code: "P0171",
        description: "System too lean on bank 1.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Look for intake vacuum leaks, inspect MAF sensor, and verify fuel pressure under load.",
        category: "Fuel System",
    },
    {
        code: "P0174",
        description: "System too lean on bank 2.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check for vacuum leaks on bank 2 side, inspect fuel pressure, and test O2 sensors.",
        category: "Fuel System",
    },
    // System Too Rich
    {
        code: "P0172",
        description: "System too rich on bank 1.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check for stuck fuel injector, inspect fuel regulator, verify MAF sensor signal.",
        category: "Fuel System",
    },
    {
        code: "P0175",
        description: "System too rich on bank 2.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect fuel injectors on bank 2, test fuel pressure regulator, check O2 sensors.",
        category: "Fuel System",
    },
    // Ignition/Misfire
    {
        code: "P0300",
        description: "Random/multiple cylinder misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check all spark plugs and coils, verify fuel pressure, test compression on all cylinders.",
        category: "Ignition System",
    },
    {
        code: "P0301",
        description: "Cylinder 1 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check spark plug and coil on cylinder 1, test injector pulse, then run compression test.",
        category: "Ignition System",
    },
    {
        code: "P0302",
        description: "Cylinder 2 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Inspect cylinder 2 spark plug and coil, check fuel injector operation.",
        category: "Ignition System",
    },
    {
        code: "P0303",
        description: "Cylinder 3 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check cylinder 3 spark plug, coil, and injector function.",
        category: "Ignition System",
    },
    {
        code: "P0304",
        description: "Cylinder 4 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Inspect cylinder 4 ignition and fuel system components.",
        category: "Ignition System",
    },
    {
        code: "P0305",
        description: "Cylinder 5 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check cylinder 5 spark plug and coil assembly.",
        category: "Ignition System",
    },
    {
        code: "P0306",
        description: "Cylinder 6 misfire detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Test cylinder 6 spark plug and ignition coil.",
        category: "Ignition System",
    },
    // Oxygen Sensors
    {
        code: "P0101",
        description: "Mass airflow (MAF) sensor range/performance.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Clean MAF sensor with specialized cleaner, check for air leaks, verify sensor voltage.",
        category: "Air Intake",
    },
    {
        code: "P0102",
        description: "Mass airflow (MAF) sensor low input.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check MAF sensor connector, clean sensor element, verify wiring.",
        category: "Air Intake",
    },
    {
        code: "P0103",
        description: "Mass airflow (MAF) sensor high input.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect air intake for leaks, replace MAF sensor if contaminated.",
        category: "Air Intake",
    },
    {
        code: "P0110",
        description: "Intake air temperature (IAT) sensor malfunction.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check IAT sensor connector and wiring, test sensor resistance, replace if faulty.",
        category: "Sensors",
    },
    {
        code: "P0130",
        description: "O2 sensor circuit malfunction (bank 1 or single sensor).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check O2 sensor wiring and connector, test sensor response, replace if slow.",
        category: "Emissions",
    },
    {
        code: "P0131",
        description: "O2 sensor circuit low voltage (bank 1, sensor 1).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect O2 sensor connector, check wiring for breaks, test sensor functionality.",
        category: "Emissions",
    },
    {
        code: "P0132",
        description: "O2 sensor circuit high voltage (bank 1, sensor 1).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check O2 sensor wiring for shorts, verify connector seating, replace sensor if needed.",
        category: "Emissions",
    },
    {
        code: "P0133",
        description: "O2 sensor response too slow (bank 1, sensor 1).",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Replace aging O2 sensor, check exhaust for leaks that may cool sensor.",
        category: "Emissions",
    },
    // Catalytic Converter
    {
        code: "P0420",
        description: "Catalyst system efficiency is below threshold on bank 1.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect exhaust leaks, verify O2 sensor readings, then test catalytic converter performance.",
        category: "Emissions",
    },
    {
        code: "P0430",
        description: "Catalyst system efficiency is below threshold on bank 2.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check bank 2 O2 sensors, inspect for exhaust leaks, test catalytic converter efficiency.",
        category: "Emissions",
    },
    // Coolant Temperature
    {
        code: "P0115",
        description: "Engine coolant temperature sensor (CTS) circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Test CTS resistance, verify connector condition, check wiring for corrosion.",
        category: "Cooling",
    },
    {
        code: "P0128",
        description: "Coolant temperature is below thermostat regulating temperature.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Confirm engine warm-up time, inspect thermostat operation, and replace thermostat if stuck open.",
        category: "Cooling",
    },
    // EVAP System
    {
        code: "P0455",
        description: "EVAP system leak detected (gross leak).",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Tighten or replace fuel cap, inspect EVAP hoses and purge/vent valves, then run smoke test.",
        category: "Emissions",
    },
    {
        code: "P0440",
        description: "EVAP system malfunction.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Inspect all EVAP hoses for cracks, check purge valve operation, test charcoal canister.",
        category: "Emissions",
    },
    {
        code: "P0442",
        description: "EVAP system leak detected (small leak).",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check fuel cap seal, inspect hoses for pinhole leaks, perform EVAP smoke test.",
        category: "Emissions",
    },
    // EGR System
    {
        code: "P0400",
        description: "Exhaust Gas Recirculation (EGR) flow malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Clean EGR valve carbon buildup, test EGR solenoid, check vacuum lines.",
        category: "Emissions",
    },
    {
        code: "P0401",
        description: "EGR flow insufficient detected.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect EGR valve for sticking, clean EGR passages, test EGR control solenoid.",
        category: "Emissions",
    },
    // Transmission
    {
        code: "P0700",
        description: "Transmission control system malfunction.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Read transmission codes, check fluid level and condition, inspect pan for debris.",
        category: "Transmission",
    },
    {
        code: "P0706",
        description: "Transmission range sensor A circuit range/performance.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Test transmission range sensor voltage, check wiring for corrosion, verify mechanical linkage.",
        category: "Transmission",
    },
    {
        code: "P0725",
        description: "Engine speed input circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check engine speed sensor wiring, verify crankshaft sensor operation, test signal.",
        category: "Engine Control",
    },
    // Knock Sensor
    {
        code: "P0325",
        description: "Knock sensor circuit malfunction (bank 1 or single sensor).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check knock sensor mounting, inspect wiring and connectors, test sensor response.",
        category: "Ignition System",
    },
    // Fuel Pump
    {
        code: "P0230",
        description: "Fuel pump primary circuit malfunction.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check fuel pump relay and fuse, test fuel pump voltage, inspect wiring and connectors.",
        category: "Fuel System",
    },
    {
        code: "P0231",
        description: "Fuel pump secondary circuit low.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Test fuel pump current draw, check relay connections, verify pump operation.",
        category: "Fuel System",
    },
    // Throttle Position Sensor
    {
        code: "P0120",
        description: "Throttle/pedal position sensor A circuit malfunction.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Test TPS voltage signal, check wiring for breaks, verify sensor operation range.",
        category: "Engine Control",
    },
    {
        code: "P0121",
        description: "Throttle/pedal position sensor A circuit range/performance.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Verify TPS calibration, test sensor voltage, clean throttle body.",
        category: "Engine Control",
    },
    // Variable Valve Timing
    {
        code: "P0011",
        description: "Camshaft position A timing over-advanced or system performance (bank 1).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check camshaft position sensor, inspect variable valve timing actuator, verify timing chain.",
        category: "Valve Train",
    },
    {
        code: "P0014",
        description: "Camshaft position B timing over-advanced or system performance (bank 1).",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Clean VVT actuator, check oil viscosity, inspect solenoid valve.",
        category: "Valve Train",
    },
    // Oil Pressure
    {
        code: "P0520",
        description: "Engine oil pressure sensor/switch circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check oil level first, test oil pressure sensor, verify wiring connections.",
        category: "Engine Control",
    },
    {
        code: "P0521",
        description: "Engine oil pressure too low or too high.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check oil level and quality, inspect oil pump, verify relief valve operation.",
        category: "Engine Control",
    },
    // Boost Pressure (Turbo/Supercharged)
    {
        code: "P0234",
        description: "Engine over boost condition detected.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check boost pressure sensor, test waste gate operation, inspect turbo for damage.",
        category: "Engine Control",
    },

    // ==================== B CODES (BODY) ====================
    {
        code: "B0100",
        description: "Body module communication fault.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check vehicle network wiring, verify module connections, scan for additional codes.",
        category: "Body Control",
    },
    {
        code: "B1001",
        description: "Passenger airbag disable indicator lamp circuit short to ground.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect airbag indicator lamp wiring, check connector condition, test bulb.",
        category: "Airbag System",
    },
    {
        code: "B1062",
        description: "Door ajar switch circuit short to battery.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check door ajar switch, inspect wiring for shorts, verify switch contact.",
        category: "Door Locks",
    },
    {
        code: "B1000",
        description: "Battery voltage out of range.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check battery voltage (should be 12-14.5V), test charging system, inspect battery terminals.",
        category: "Electrical",
    },
    {
        code: "B1203",
        description: "Sunroof motor current limit exceeded.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check sunroof tracks for debris, test motor operation, verify wiring.",
        category: "Accessories",
    },
    {
        code: "B1342",
        description: "Driver seatbelt switch short to ground.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Inspect seatbelt switch, check wiring for corrosion, test continuity.",
        category: "Safety Systems",
    },
    {
        code: "B1670",
        description: "Electronic parking brake solenoid malfunction.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Test parking brake solenoid, check electrical connections, verify brake cable.",
        category: "Braking",
    },
    {
        code: "B2001",
        description: "Passenger door lock circuit malfunction.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Test door lock actuator, check wiring and connectors, verify switch operation.",
        category: "Door Locks",
    },
    {
        code: "B2610",
        description: "Front passenger window regulator motor current too high.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Check window track for debris, test motor operation, inspect wiring.",
        category: "Windows",
    },
    {
        code: "B2711",
        description: "Driver seat lumbar adjustment circuit malfunction.",
        urgency: "Low",
        safeToDrive: true,
        repairPath: "Test lumbar support motor, check wiring, verify switch function.",
        category: "Seating",
    },

    // ==================== C CODES (CHASSIS) ====================
    {
        code: "C0050",
        description: "Right front wheel sensor circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check wheel speed sensor wiring, inspect sensor gap, test sensor resistance.",
        category: "ABS System",
    },
    {
        code: "C0100",
        description: "ABS module fault.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Scan ABS system, check module connector, verify brake fluid level.",
        category: "ABS System",
    },
    {
        code: "C0110",
        description: "ABS system malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check all wheel speed sensors, inspect ABS module wiring, test brake pressure.",
        category: "ABS System",
    },
    {
        code: "C0200",
        description: "Left front wheel sensor circuit open or short.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect wheel speed sensor connector, test wiring continuity, replace sensor if faulty.",
        category: "ABS System",
    },
    {
        code: "C0205",
        description: "Right front wheel sensor circuit open or short.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check sensor mounting, verify wiring connections, test sensor output.",
        category: "ABS System",
    },
    {
        code: "C0300",
        description: "Brake pressure circuit malfunction.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check brake fluid level, inspect brake lines, test brake pressure sensor.",
        category: "Braking",
    },
    {
        code: "C0410",
        description: "Traction control system fault.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check all wheel speed sensors, verify traction control circuits, scan module.",
        category: "Traction Control",
    },
    {
        code: "C0900",
        description: "Suspension control system malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check suspension sensors, inspect height control valve, verify electrical connections.",
        category: "Suspension",
    },
    {
        code: "C1220",
        description: "Brake pressure sensor circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Test brake pressure sensor, check wiring for corrosion, verify sensor mount.",
        category: "Braking",
    },
    {
        code: "C1280",
        description: "Steering angle sensor circuit malfunction.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Center steering angle sensor, check electrical connector, verify sensor operation.",
        category: "Steering",
    },

    // ==================== U CODES (NETWORK/COMMUNICATION) ====================
    {
        code: "U0001",
        description: "High speed CAN bus off.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check CAN bus wiring, inspect module connectors, verify terminating resistors.",
        category: "Network",
    },
    {
        code: "U0002",
        description: "CAN bus message timeout.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Scan for other network codes, check module power supply, verify CAN shielding.",
        category: "Network",
    },
    {
        code: "U0010",
        description: "Medium speed CAN bus off.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check M-CAN wiring, inspect connector pins, test module voltage.",
        category: "Network",
    },
    {
        code: "U0073",
        description: "Control module communication bus off.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Verify all module connections, check power supply to modules, scan for related codes.",
        category: "Network",
    },
    {
        code: "U0100",
        description: "Lost communication with engine control module.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Check ECM connector and power supply, verify wiring continuity, test ECM voltage.",
        category: "Network",
    },
    {
        code: "U0101",
        description: "Lost communication with transmission control module.",
        urgency: "High",
        safeToDrive: false,
        repairPath: "Inspect TCM connections, check module power, verify CAN bus wiring.",
        category: "Network",
    },
    {
        code: "U0110",
        description: "Lost communication with ABS control module.",
        urgency: "High",
        safeToDrive: true,
        repairPath: "Check ABS module connector, verify power supply, test CAN communication.",
        category: "Network",
    },
    {
        code: "U0121",
        description: "Lost communication with instrument panel cluster.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Inspect cluster connector, check wiring for corrosion, verify module power.",
        category: "Network",
    },
    {
        code: "U0140",
        description: "Lost communication with body control module.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check BCM power and ground, verify wiring connections, scan for network issues.",
        category: "Network",
    },
    {
        code: "U0415",
        description: "Unexpected operation of cruise control module.",
        urgency: "Medium",
        safeToDrive: true,
        repairPath: "Check cruise control switch, inspect wiring, verify module communication.",
        category: "Network",
    },
];

/**
 * Search for OBD codes by code or keyword
 * @param {string} query - Code (e.g., 'P0420') or keyword (e.g., 'misfire')
 * @returns {array} Matching OBD code objects
 */
export function searchOBDCodes(query) {
    if (!query) return [];

    const normalized = query.trim().toUpperCase();
    return OBD_CODES.filter(
        (code) =>
            code.code.toUpperCase() === normalized ||
            code.description.toUpperCase().includes(normalized) ||
            code.category.toUpperCase().includes(normalized)
    );
}

/**
 * Get OBD codes by category
 * @param {string} category - Category filter (e.g., 'Fuel System', 'Emissions')
 * @returns {array} Codes in specified category
 */
export function getOBDCodesByCategory(category) {
    return OBD_CODES.filter((code) => code.category === category);
}

/**
 * Get all unique categories
 * @returns {array} List of all categories
 */
export function getOBDCategories() {
    return [...new Set(OBD_CODES.map((code) => code.category))].sort();
}

/**
 * Get codes by type (P, B, C, U)
 * @param {string} type - Code type prefix
 * @returns {array} Codes of specified type
 */
export function getOBDCodesByType(type) {
    const prefix = type.toUpperCase()[0];
    return OBD_CODES.filter((code) => code.code.startsWith(prefix));
}