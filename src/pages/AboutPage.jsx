import { FONT_IMPORT_STYLE_NO_ITALIC } from "../constants/appData"

export default function AboutPage({ G, goHome, setScreen }) {
    return (
        <div style={G.app}>
            <style>{FONT_IMPORT_STYLE_NO_ITALIC}</style>
            <div style={G.topbar}>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#f5f1ea" }}>About</div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => setScreen("help")} style={G.ghost}>HELP</button>
                </div>
            </div>

            <div style={{ maxWidth: "760px", margin: "0 auto", padding: "36px 20px" }}>
                <div style={{ marginBottom: "32px" }}>
                    <div style={{ fontSize: "10px", color: "#555", letterSpacing: "0.12em", marginBottom: "6px" }}>ABOUT</div>
                    <h2 style={{ fontSize: "26px", fontWeight: "700", marginBottom: "8px" }}>MechanIQs</h2>
                    <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.6", marginBottom: "-15px" }}>Vehicle maintenance and repair made simple.
                        <br /> Developed by Jeremy Kruse, Aidan Bailey, Frank Hyun, and Kareem Fenaish.</p>
                </div>

                <div style={{ display: "grid", gap: "20px" }}>
                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>What We Do</h3>
                        <p style={{ color: "#b8b3ab", fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
                            MechanIQs is your comprehensive vehicle maintenance companion. We provide:
                        </p>
                        <ul style={{ color: "#888", fontSize: "12px", lineHeight: "1.8", paddingLeft: "20px" }}>
                            <li>Step-by-step repair tutorials with video guides</li>
                            <li>Real-time parts compatibility and pricing from RockAuto</li>
                            <li>AI-powered symptom diagnosis for your specific vehicle</li>
                            <li>OBD-II code lookup and explanation</li>
                            <li>Maintenance schedule tracking</li>
                            <li>Recall checking and management</li>
                        </ul>
                    </div>

                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Our Mission</h3>
                        <p style={{ color: "#b8b3ab", fontSize: "13px", lineHeight: "1.6" }}>
                            To democratize vehicle maintenance by providing accessible, accurate, and comprehensive tools
                            that empower car owners to maintain and repair their vehicles with confidence.
                        </p>
                    </div>

                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Privacy & Terms</h3>
                        <div style={{ display: "grid", gap: "12px" }}>
                            <div>
                                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#e8890c" }}>Privacy Policy</h4>
                                <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>
                                    We collect minimal data necessary to provide our services. Vehicle information and user preferences
                                    are stored locally on your device. Authentication data is managed securely through Supabase.
                                </p>
                            </div>
                            <div>
                                <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px", color: "#e8890c" }}>Terms of Service</h4>
                                <p style={{ color: "#888", fontSize: "12px", lineHeight: "1.5" }}>
                                    MechanIQs is provided as-is for informational purposes. Always consult professional mechanics
                                    for complex repairs. We are not liable for any damages or issues arising from the use of our tools.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ border: "1px solid #2a2a2a", borderRadius: "4px", padding: "24px", background: "#0e0e0e" }}>
                        <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "12px", color: "#f5f1ea" }}>Contact Us</h3>
                        <div style={{ display: "grid", gap: "8px" }}>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                                <strong style={{ color: "#f5f1ea" }}>Email:</strong> hello@mechaniqs.com
                            </div>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                                <strong style={{ color: "#f5f1ea" }}>Support:</strong> support@mechaniqs.com
                            </div>
                            <div style={{ fontSize: "12px", color: "#888" }}>
                                <strong style={{ color: "#f5f1ea" }}>Website:</strong> www.mechaniqs.com
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}