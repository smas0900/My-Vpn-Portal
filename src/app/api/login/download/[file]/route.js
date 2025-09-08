import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export async function GET(req, { params }) {
  const token = cookies().get("auth_token")?.value;
  
  // Check if token exists
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  
  // Verify JWT token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`File download requested by user: ${decoded.user}`);
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
  
  const fileName = params.file;
  
  // Validate file name
  if (!fileName) {
    return NextResponse.json({ error: "File name is required" }, { status: 400 });
  }
  
  // Only allow .conf files
  if (!fileName.endsWith(".conf")) {
    return NextResponse.json({ error: "Only .conf files are allowed" }, { status: 400 });
  }
  
  // Prevent directory traversal attacks
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }
  
  const filePath = path.join(process.cwd(), "protected", fileName);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`Requested file not found: ${filePath}`);
    return NextResponse.json({ error: "Configuration file not found" }, { status: 404 });
  }
  
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Log successful download
    console.log(`File downloaded successfully: ${fileName}`);
    
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error(`Error reading file ${fileName}:`, error.message);
    return NextResponse.json({ error: "Error reading file" }, { status: 500 });
  }
}