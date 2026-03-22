import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function HelpPage({ G, goHome, setScreen }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>Help</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("about")} style={G.ghost}>ABOUT</button>
                </div>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>SUPPORT</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "8px" }}>How can we help?</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6" }}>Get assistance with using MechanIQs or contact our support team.</p>
                </div>

                <div style={{ display: "grid", gap: "20px" }}>
                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Chat with AI Assistant</h3>
                        <p style={{ color: "#b8b3ab", fontSize: "13px", lineHeight: "1.6", marginBottom: "16px" }}>
                            Our AI assistant can help you troubleshoot issues, explain features, and guide you through repairs.
                        </p>
                        <button onClick={() => setScreen("diagnosis")} style={G.btn("#e8890c")}>START CHAT →</button>
                    </div>

                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Common Questions</h3>
                        <div style={{ display: "grid", gap: "12px" }}>
                            <div>
                                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#e8890c" }}>How do I add my vehicle?</h4>
                                <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>Go to the Dashboard and click "Add Vehicle". You can enter details manually or use a VIN for automatic lookup.</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#e8890c" }}>What are OBD-II codes?</h4>
                                <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>OBD-II codes are diagnostic trouble codes from your vehicle's computer. Use our lookup tool to understand what they mean.</p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#e8890c" }}>How do repairs work?</h4>
                                <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>Select a repair from the catalog, view compatible parts, then follow our step-by-step tutorial with videos.</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Contact Support</h3>
                        <p style={{ color: "#b8b3ab", fontSize: "13px", lineHeight: "1.6", marginBottom: "16px" }}>
                            Need more help? Our support team is here to assist you.
                        </p>
                        <div style={{ display: "grid", gap: "8px" }}>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                                <strong style={{ color: "#f5f1ea" }}>Email:</strong> support@mechaniqs.com
                            </div>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                                <strong style={{ color: "#f5f1ea" }}>Hours:</strong> Monday-Friday, 9AM-6PM EST
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "32px", textAlign: "center" }}>
                    <button onClick={goHome} style={G.btn("#202020")}>← BACK TO DASHBOARD</button>
                </div>
            </div>
        </div>
    )
}