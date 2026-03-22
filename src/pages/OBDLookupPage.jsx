import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"
import OBDIICodeLookup from "../components/OBDIICodeLookup"

export default function OBDLookupPage({ G, goHome, setScreen }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>

            <div style={G.topbar}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => setScreen("hub")} style={{ ...G.ghost, padding: "8px 14px", fontSize: "13px" }}>← Dashboard</button>
                    <button onClick={goHome} style={G.logoBtn} aria-label="Go to home">
                        <span style={G.logo}>MECHANIQS</span>
                    </button>
                    <span style={{ color: "#444", fontSize: "12px" }}>/ OBD-II Code Lookup</span>
                </div>
            </div>

            <div style={{ maxWidth: "920px", width: "100%", margin: "0 auto", padding: "22px 20px" }}>
                <OBDIICodeLookup />
            </div>
        </div>
    )
}
