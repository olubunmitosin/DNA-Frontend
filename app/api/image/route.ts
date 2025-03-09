import { fileTypeFromBuffer } from "file-type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url).searchParams.get("url");

  // Check if `url` exists and is a string
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 }); // Use 400 Bad Request for invalid input
  }

  try {
    // Fetch the image from the provided URL
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status } // Use the actual status code from the fetch response
      );
    }

    const imageBuffer = await response.arrayBuffer();
    const detectedType = await fileTypeFromBuffer(Buffer.from(imageBuffer));

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        "Content-Type": detectedType?.mime || "image/jpeg",

        // "Content-Type": response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    NextResponse.json({ error: "Error fetching image" }, { status: 500 });
  }
}
