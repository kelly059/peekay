import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import cloudinary from "@/lib/cloudinary"

// Create a singleton instance of PrismaClient
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

interface CloudinaryUploadResult {
  secure_url: string
  [key: string]: unknown
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// GET single confession by ID
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: Request, { params }: any) {
  try {
    const id = params.id

    const confession = await prisma.content.findUnique({
      where: { id: Number(id) },
      include: {
        comments: {
          orderBy: { created_at: "desc" },
          select: {
            id: true,
            content: true,
            author: true,
            created_at: true,
            deleteToken: true,
            parentId: true,
          },
        },
      },
    })

    if (!confession) {
      return NextResponse.json<ApiResponse>({ success: false, error: "Confession not found" }, { status: 404 })
    }

    const responseData = {
      id: confession.id,
      title: confession.title,
      description: confession.description,
      created_at: confession.created_at.toISOString(),
    }

    return NextResponse.json<ApiResponse<typeof responseData>>({
      success: true,
      data: responseData,
    })
  } catch (error: unknown) {
    console.error("GET confession error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch confession"
    return NextResponse.json<ApiResponse>({ success: false, error: errorMessage }, { status: 500 })
  }
}

// POST - Update confession
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function POST(req: Request, { params }: any) {
  try {
    const id = params.id
    const request = req as unknown as NextRequest // Cast to NextRequest for formData

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const file = formData.get("cover_image") as File | null

    let cover_image: string | undefined

    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uploadRes = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "confessions" }, (error, result) => {
            if (error) {
              reject(error)
            } else if (!result) {
              reject(new Error("Cloudinary upload failed"))
            } else {
              resolve(result)
            }
          })
          .end(buffer)
      })

      cover_image = uploadRes.secure_url
    }

    const updatedConfession = await prisma.content.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(cover_image && { cover_image }),
      },
    })

    const responseData = {
      id: updatedConfession.id,
      title: updatedConfession.title,
      description: updatedConfession.description,
      created_at: updatedConfession.created_at.toISOString(),
    }

    return NextResponse.json<ApiResponse<typeof responseData>>({
      success: true,
      data: responseData,
    })
  } catch (error: unknown) {
    console.error("POST confession error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to update confession"
    return NextResponse.json<ApiResponse>({ success: false, error: errorMessage }, { status: 500 })
  }
}
