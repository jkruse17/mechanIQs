import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"
import OBDIICodeLookup from "../components/OBDIICodeLookup"

export default function OBDLookupPage({ G, goHome, setScreen }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>

            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>OBD-II Code Lookup</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("help")} style={G.ghost}>HELP</button>
                    <button onClick={() => setScreen("about")} style={G.ghost}>ABOUT</button>
                </div>
            </div>

            <div style={{ maxWidth: "920px", width: "100%", margin: "0 auto", padding: "22px 20px" }}>
                <OBDIICodeLookup G={G} />
            </div>
        </div>
    )
}
