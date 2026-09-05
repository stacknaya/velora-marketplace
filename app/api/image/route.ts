import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname");

  if (!pathname) {
    return NextResponse.json(
      { error: "Missing pathname" },
      { status: 400 }
    );
  }

 const blobPath = pathname.startsWith("http")
  ? new URL(pathname).pathname.replace(/^\/+/, "")
  : pathname;

const result = await get(blobPath, {
  access: "private",
});

  if (result === null) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Cache-Control": "private, no-cache",
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
