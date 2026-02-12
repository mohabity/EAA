import { NextResponse, type NextRequest } from "next/server"
// import { updateSession } from "@/lib/supabase/middleware"

// TEST DIAGNOSTIC : middleware désactivé pour isoler la cause du 404
export async function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclut les fichiers statiques et assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
