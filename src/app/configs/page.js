import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import ConfigsClient from "./ConfigsClient";

export default function ConfigsPage() {
  const token = cookies().get("auth_token")?.value;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif" }}>
        <h2>Access Denied</h2>
        <p>You need to login to access this page.</p>
        <a href="/" style={{ color: "#0066cc", textDecoration: "underline" }}>
          Go back to login
        </a>
      </div>
    );
  }

  // Build configFiles dynamically by reading the protected/ directory.
  // Priority:
  // 1) CONFIGS env var (JSON mapping: filename -> base64 or raw content)
  // 2) protected/ directory (local dev)
  // 3) fallback hard-coded list
  let configFiles = [];

  // 1) Try CONFIGS env var
  try {
    const configsEnv = process.env.CONFIGS;
    if (configsEnv) {
      let mapping = {};
      try {
        mapping = JSON.parse(configsEnv);
      } catch (e) {
        console.warn('CONFIGS env var is not valid JSON');
      }

      // mapping keys are filenames. We don't decode here; we only need the names
      configFiles = Object.keys(mapping || {})
        .filter((f) => typeof f === 'string' && f.toLowerCase().endsWith('.conf'))
        .map((f) => {
          const base = f.replace(/\.conf$/i, '');
          const name = base.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          return { name, filename: f };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    }
  } catch (err) {
    console.error('Error parsing CONFIGS env var:', err?.message || err);
    configFiles = [];
  }

  // 2) Fallback to protected/ directory for local development
  if (!configFiles || configFiles.length === 0) {
    try {
      const protectedDir = path.join(process.cwd(), 'protected');
      if (fs.existsSync(protectedDir)) {
        const files = fs.readdirSync(protectedDir);
        configFiles = files
          .filter((f) => f.toLowerCase().endsWith('.conf'))
          .map((f) => {
            const base = f.replace(/\.conf$/i, '');
            const name = base.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            return { name, filename: f };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    } catch (err) {
      configFiles = [];
    }
  }

  // 3) Final fallback
  if (!configFiles || configFiles.length === 0) {
    configFiles = [
      { name: 'Client 1 (Accio)', filename: 'Accio.conf' },
      { name: 'Client 2 (Lumos)', filename: 'Lumos.conf' },
      { name: 'Client 3 (Expecto)', filename: 'Expecto.conf' }
    ];
  }

  return <ConfigsClient configFiles={configFiles} />;
}