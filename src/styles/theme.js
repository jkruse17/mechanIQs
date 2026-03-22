export const G = {
    app: { minHeight: "100vh", background: "#0b0b0b", color: "#ede9e1", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", fontSize: "14px" },
    topbar: { height: "48px", borderBottom: "1px solid #222", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 },
    logo: { fontWeight: "700", fontSize: "16px", letterSpacing: "0.06em", color: "#e8890c" },
    logoBtn: { background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" },
    ghost: { background: "none", border: "1px solid #2a2a2a", color: "#666", padding: "5px 12px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontSize: "12px", letterSpacing: "0.04em" },
    pill: (active) => ({ background: active ? "#e8890c" : "#161616", border: `1px solid ${active ? "#e8890c" : "#2a2a2a"}`, color: active ? "#0b0b0b" : "#888", padding: "4px 12px", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "11px", fontWeight: active ? "700" : "400", letterSpacing: "0.05em" }),
    btn: (color = "#e8890c") => ({ background: color, border: "none", color: "#0b0b0b", padding: "10px 22px", borderRadius: "3px", cursor: "pointer", fontFamily: "inherit", fontWeight: "700", fontSize: "12px", letterSpacing: "0.06em" }),
}
