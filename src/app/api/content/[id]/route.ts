import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(request: Request, context: unknown) {
  try {
    // Type assertion to access params
    const params = (context as { params: { id?: string } }).params
    const id = params?.id

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const content = await prisma.content.findUnique({
      where: { id: Number(id) },
    })

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
