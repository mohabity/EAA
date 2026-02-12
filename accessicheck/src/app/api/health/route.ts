import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Requête simple pour vérifier la connexion à la DB
    const { error } = await supabase.from("profiles").select("id").limit(1)

    if (error) {
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ status: "ok", connected: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    )
  }
}
