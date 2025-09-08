import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
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

  const configFiles = [
    { name: "Client 1 (Accio)", filename: "Accio.conf" },
    { name: "Client 2 (Lumos)", filename: "Lumos.conf" },
    { name: "Client 3 (Expecto)", filename: "Expecto.conf" }
  ];

  return <ConfigsClient configFiles={configFiles} />;
 }
// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";

// // Map filenames to environment variable names
// const CONFIG_FILES = {
//   "Accio.conf": process.env.ACCIO_CONFIG,
//   "Lumos.conf": process.env.LUMOS_CONFIG,
//   "Expecto.conf": process.env.EXPECTO_CONFIG,
// };

// export async function GET(req, { params }) {
//   const token = cookies().get("auth_token")?.value;
  
//   if (!token) {
//     return NextResponse.json({ error: "Authentication required" }, { status: 401 });
//   }
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(`File download requested by user: ${decoded.user} for file: ${params.file}`);
//   } catch (error) {
//     console.error("JWT verification failed:", error.message);
//     return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//   }
  
//   const fileName = params.file;
  
//   // Validate file name
//   if (!fileName || !fileName.endsWith(".conf")) {
//     return NextResponse.json({ error: "Invalid file name - only .conf files allowed" }, { status: 400 });
//   }
  
//   // Prevent directory traversal attacks
//   if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
//     return NextResponse.json({ error: "Invalid file name - security violation" }, { status: 400 });
//   }
  
//   // Get config content from environment variable
//   const configBase64 = CONFIG_FILES[fileName];
  
//   if (!configBase64) {
//     console.error(`Configuration not found: ${fileName}. Available configs: ${Object.keys(CONFIG_FILES).join(', ')}`);
//     return NextResponse.json({ 
//       error: "Configuration file not found", 
//       available: Object.keys(CONFIG_FILES) 
//     }, { status: 404 });
//   }
  
//   try {
//     // Decode from base64
//     const fileContent = Buffer.from(configBase64, 'base64');
    
//     console.log(`File downloaded successfully: ${fileName}, size: ${fileContent.length} bytes`);
    
//     return new NextResponse(fileContent, {
//       headers: {
//         "Content-Type": "text/plain",
//         "Content-Disposition": `attachment; filename="${fileName}"`,
//         "Cache-Control": "no-cache, no-store, must-revalidate",
//         "Pragma": "no-cache",
//         "Expires": "0"
//       },
//     });
//   } catch (error) {
//     console.error(`Error decoding file ${fileName}:`, error.message);
//     return NextResponse.json({ error: "Error processing configuration file" }, { status: 500 });
//   }
// }