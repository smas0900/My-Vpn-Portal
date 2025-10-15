"use client";
import { useState, useEffect } from "react";

export default function ConfigsClient({ configFiles }) {
  const [darkMode, setDarkMode] = useState(true);

  // Load preference
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  // Dark mode theme
  const theme = {
    // Main colors
    bg: darkMode ? '#3f3d3dff' : '#ffffff',
    cardBg: darkMode ? '#1a1a1a' : '#ffffff',
    text: darkMode ? '#e0e0e0' : '#000000',
    textSecondary: darkMode ? '#a0a0a0' : '#6c757d',
    border: darkMode ? '#333333' : '#ddd',
    
    // Section themes
    primary: {
      bg: darkMode ? '#1a2332' : '#e7f3ff',
      border: darkMode ? '#2a4a6b' : '#b3d9ff',
      text: darkMode ? '#64b5f6' : '#0066cc'
    },
    secondary: {
      bg: darkMode ? '#1f1f1f' : '#f8f9fa',
      border: darkMode ? '#3a3a3a' : '#dee2e6',
      text: darkMode ? '#b0b0b0' : '#495057'
    },
    info: {
      bg: darkMode ? '#1a2e3d' : '#d1ecf1',
      border: darkMode ? '#2e5a7a' : '#bee5eb',
      text: darkMode ? '#4fc3f7' : '#0c5460'
    },
    warning: {
      bg: darkMode ? '#2e2416' : '#fff3cd',
      border: darkMode ? '#5c4a2c' : '#ffeaa7',
      text: darkMode ? '#ffb74d' : '#856404'
    },
    success: {
      bg: darkMode ? '#1b2e1f' : '#d4edda',
      border: darkMode ? '#2d5a31' : '#c3e6cb',
      text: darkMode ? '#4caf50' : '#155724'
    },
    
    // Platform colors
    android: darkMode ? '#66bb6a' : '#34a853',
    ios: darkMode ? '#42a5f5' : '#007aff',
    windows: darkMode ? '#5c9cfc' : '#0078d4',
    
    // Button colors
    button: {
      primary: {
        bg: darkMode ? '#1976d2' : '#007bff',
        hover: darkMode ? '#1565c0' : '#0056b3'
      },
      danger: {
        bg: darkMode ? '#d32f2f' : '#dc3545',
        hover: darkMode ? '#c62828' : '#c82333'
      },
      toggle: {
        bg: darkMode ? '#ffc107' : '#343a40',
        hover: darkMode ? '#ffb300' : '#23272b'
      }
    }
  };

  return (
    <div style={{
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        padding: 40,
        fontFamily: "sans-serif",
        maxWidth: 1000,
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 30
        }}>
          <h1 style={{ color: theme.text, margin: 0 }}>WireGuard VPN Portal</h1>

          <div style={{ display: "flex", gap: "10px" }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: "8px 16px",
                backgroundColor: theme.button.toggle.bg,
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.button.toggle.hover}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.button.toggle.bg}
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 16px",
                backgroundColor: theme.button.danger.bg,
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = theme.button.danger.hover}
              onMouseOut={(e) => e.target.style.backgroundColor = theme.button.danger.bg}
            >
              Logout
            </button>
          </div>
        </div>

        {/* WireGuard Installation Section */}
        <div style={{
          backgroundColor: theme.primary.bg,
          padding: 25,
          borderRadius: 8,
          marginBottom: 30,
          border: `1px solid ${theme.primary.border}`,
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ marginTop: 0, color: theme.primary.text }}>📱 Step 1: Install WireGuard Client</h2>
          <p style={{ marginBottom: 20, fontSize: "16px", color: theme.text }}>
            First, install the WireGuard app on your device:
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 20
          }}>
            {/* Android */}
            <div style={{
              backgroundColor: theme.cardBg,
              padding: 20,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: theme.android }}>🤖 Android</h4>
              
              <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 15 }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", color: theme.text }}>
                    <strong>Play Store (Recommended):</strong>
                  </p>
                  <a href="https://play.google.com/store/apps/details?id=com.wireguard.android"
                     target="_blank" style={{ color: theme.android, textDecoration: "none" }}>
                    Install from Play Store
                  </a>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://play.google.com/store/apps/details?id=com.wireguard.android&bgcolor=${darkMode ? '1a1a1a' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`}
                  alt="Play Store QR"
                  style={{ border: `1px solid ${theme.border}`, borderRadius: 4 }}
                />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 15, marginTop: "20px" }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", color: theme.text }}>
                    <strong>Direct APK Download:</strong>
                  </p>
                  <a href="https://download.wireguard.com/android-client/"
                     target="_blank" style={{ color: theme.android, textDecoration: "none" }}>
                    Download APK
                  </a>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://download.wireguard.com/android-client/&bgcolor=${darkMode ? '1a1a1a' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`}
                  alt="APK QR"
                  style={{ border: `1px solid ${theme.border}`, borderRadius: 4 }}
                />
              </div>
            </div>

            {/* iOS */}
            <div style={{
              backgroundColor: theme.cardBg,
              padding: 20,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: theme.ios }}>📱 iOS</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", color: theme.text }}>
                    <strong>App Store:</strong>
                  </p>
                  <a href="https://apps.apple.com/app/wireguard/id1441195209"
                     target="_blank" style={{ color: theme.ios, textDecoration: "none" }}>
                    Install from App Store
                  </a>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://apps.apple.com/app/wireguard/id1441195209&bgcolor=${darkMode ? '1a1a1a' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`}
                  alt="App Store QR"
                  style={{ border: `1px solid ${theme.border}`, borderRadius: 4 }}
                />
              </div>
            </div>

            {/* Windows */}
            <div style={{
              backgroundColor: theme.cardBg,
              padding: 20,
              borderRadius: 8,
              border: `1px solid ${theme.border}`,
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: theme.windows }}>💻 Windows</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <div>
                  <p style={{ margin: "0 0 8px 0", color: theme.text }}>
                    <strong>Windows Installer:</strong>
                  </p>
                  <a href="https://download.wireguard.com/windows-client/wireguard-installer.exe"
                     target="_blank" style={{ color: theme.windows, textDecoration: "none" }}>
                    Download for Windows
                  </a>
                </div>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://download.wireguard.com/windows-client/wireguard-installer.exe&bgcolor=${darkMode ? '1a1a1a' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`}
                  alt="Windows QR"
                  style={{ border: `1px solid ${theme.border}`, borderRadius: 4 }}
                />
              </div>
            </div>
          </div>

          {/* Mobile tip */}
          <div style={{
            backgroundColor: theme.warning.bg,
            padding: 15,
            borderRadius: 6,
            border: `1px solid ${theme.warning.border}`,
            transition: 'all 0.3s ease'
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: theme.warning.text }}>
              📲 <strong>Mobile Users:</strong> Simply scan the QR code with your phone's camera to open the download link directly!
            </p>
          </div>
        </div>

        {/* Configuration Files Section Header */}
        <div style={{
          backgroundColor: theme.secondary.bg,
          padding: 25,
          borderRadius: 8,
          marginBottom: 30,
          border: `1px solid ${theme.secondary.border}`,
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ marginTop: 0, color: theme.secondary.text }}>⚙️ Step 2: Download Your Configuration</h2>
          <p style={{ marginBottom: 0, fontSize: "16px", color: theme.text }}>
            After installing WireGuard, download and import your configuration file:
          </p>
        </div>

        {/* Config Files */}
        <div style={{ display: "grid", gap: 15, marginBottom: 30 }}>
          {configFiles.map((config, index) => (
            <div key={index} style={{
              border: `1px solid ${theme.border}`,
              padding: 25,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.cardBg,
              boxShadow: darkMode ? "0 2px 8px rgba(255,255,255,0.05)" : "0 2px 4px rgba(0,0,0,0.1)",
              transition: 'all 0.3s ease'
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 5px 0", color: theme.text }}>{config.name}</h4>
                <small style={{ color: theme.textSecondary }}>{config.filename}</small>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <a
                  href={`/api/login/download/${config.filename}`}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: theme.button.primary.bg,
                    color: "white",
                    textDecoration: "none",
                    borderRadius: 6,
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = theme.button.primary.hover}
                  onMouseOut={(e) => e.target.style.backgroundColor = theme.button.primary.bg}
                >
                  📥 Download
                </a>
                
                <div style={{ textAlign: "center" }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/login/download/${config.filename}`)}&bgcolor=${darkMode ? '1a1a1a' : 'ffffff'}&color=${darkMode ? 'ffffff' : '000000'}`}
                    alt={`QR Code for ${config.name}`}
                    style={{ border: `1px solid ${theme.border}`, borderRadius: 4 }}
                  />
                  <p style={{ fontSize: "12px", color: theme.textSecondary, margin: "5px 0 0 0" }}>
                    Scan to download
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage Instructions */}
        <div style={{
          marginTop: 30,
          padding: 25,
          backgroundColor: theme.info.bg,
          border: `1px solid ${theme.info.border}`,
          borderRadius: 8,
          transition: 'all 0.3s ease'
        }}>
          <h3 style={{ marginTop: 0, color: theme.info.text }}>📋 How to Use</h3>
          <ol style={{ paddingLeft: 20, lineHeight: 1.6, color: theme.text }}>
            <li><strong>Install WireGuard</strong> using the links/QR codes above</li>
            <li><strong>Download your config file</strong> by clicking download or scanning QR code</li>
            <li><strong>Import the config</strong> into WireGuard app:
              <ul style={{ marginTop: 8 }}>
                <li><strong>Mobile:</strong> Tap "+" → "Create from file or archive"</li>
                <li><strong>Windows:</strong> Click "Add Tunnel" → "Import tunnel(s) from file"</li>
              </ul>
            </li>
            <li><strong>Connect</strong> by toggling the switch in WireGuard</li>
          </ol>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: 20,
          padding: 20,
          backgroundColor: theme.warning.bg,
          border: `1px solid ${theme.warning.border}`,
          borderRadius: 8,
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ marginTop: 0, color: theme.warning.text }}>⚠️ Security Notice</h4>
          <p style={{ margin: 0, color: theme.text }}>
            These configuration files contain sensitive information. Keep them secure and do not share them with unauthorized users.
            Each config file is unique to you and should not be used on multiple devices simultaneously.
          </p>
        </div>
      </div>
    </div>
  );
}