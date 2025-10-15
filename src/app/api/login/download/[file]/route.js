// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import fs from "fs";
// import path from "path";

// export async function GET(req, { params }) {
//   const token = cookies().get("auth_token")?.value;
  
//   // Check if token exists
//   if (!token) {
//     return NextResponse.json({ erro: "Authentication required" }, { status: 401 });
//   }
  
//   // Verify JWT token
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(`File download requested by user: ${decoded.user}`);
//   } catch (error) {
//     console.error("JWT verification failed:", error.message);
//     return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//   }
  
//   const fileName = params.file;
  
//   // Validate file name
//   if (!fileName) {
//     return NextResponse.json({ error: "File name is required" }, { status: 400 });
//   }
  
//   // Only allow .conf files
//   if (!fileName.endsWith(".conf")) {
//     return NextResponse.json({ error: "Only .conf files are allowed" }, { status: 400 });
//   }
  
//   // Prevent directory traversal attacks
//   if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
//     return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
//   }
  
//   const filePath = path.join(process.cwd(), "protected", fileName);
  
//   // Check if file exists
//   if (!fs.existsSync(filePath)) {
//     console.error(`Requested file not found: ${filePath}`);
//     return NextResponse.json({ error: "Configuration file not found" }, { status: 404 });
//   }
  
//   try {
//     const fileContent = fs.readFileSync(filePath);
    
//     // Log successful download
//     console.log(`File downloaded successfully: ${fileName}`);
    
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
//     console.error(`Error reading file ${fileName}:`, error.message);
//     return NextResponse.json({ error: "Error reading file" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

/**
 * Download handler supports two modes:
 * 1) Production (recommended on Vercel): provide a JSON env var `CONFIGS`
 *    which is a mapping of filename -> base64(contents). Example:
 *    CONFIGS='{"Accio.conf":"BASE64...","Lumos.conf":"BASE64..."}'
 * 2) Local development: fall back to reading files from `protected/` directory.
 */
export async function GET(req, { params }) {
  const token = cookies().get("auth_token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`File download requested by user: ${decoded.user} for file: ${params.file}`);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
  
  const fileName = params.file;
  
  // Validate file name
  if (!fileName || !fileName.endsWith(".conf")) {
    return NextResponse.json({ error: "Invalid file name - only .conf files allowed" }, { status: 400 });
  }
  
  // Prevent directory traversal attacks
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return NextResponse.json({ error: "Invalid file name - security violation" }, { status: 400 });
  }
  
  // Get config content from environment variable
  // First, try reading mapping from CONFIGS env var (JSON: filename -> base64)
  try {
    const configsEnv = process.env.CONFIGS;
    if (configsEnv) {
      let mapping = {};
      try {
        mapping = JSON.parse(configsEnv);
      } catch (e) {
        console.warn('CONFIGS env var is not valid JSON');
      }

      const configBase64 = mapping[fileName];
      if (configBase64) {
        try {
          const fileContent = Buffer.from(configBase64, 'base64');
          console.log(`File downloaded from CONFIGS env: ${fileName}, size: ${fileContent.length}`);
          return new NextResponse(fileContent, {
            headers: {
              "Content-Type": "text/plain",
              "Content-Disposition": `attachment; filename="${fileName}"`,
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
              "Expires": "0"
            }
          });
        } catch (e) {
          console.error(`Error decoding base64 for ${fileName}:`, e.message);
          return NextResponse.json({ error: "Error processing configuration file" }, { status: 500 });
        }
      }
    }
  } catch (err) {
    console.error('Error reading CONFIGS env var:', err?.message || err);
  }

  // Fallback: read the file from local protected/ directory (for local dev)
  try {
    const filePath = path.join(process.cwd(), 'protected', fileName);
    if (!fs.existsSync(filePath)) {
      console.error(`Requested file not found in protected/: ${filePath}`);
      return NextResponse.json({ error: 'Configuration file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath);
    console.log(`File downloaded from protected/: ${fileName}, size: ${fileContent.length}`);
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (err) {
    console.error(`Error reading file from protected/: ${fileName}`, err?.message || err);
    return NextResponse.json({ error: 'Configuration file not found' }, { status: 404 });
  }
} 