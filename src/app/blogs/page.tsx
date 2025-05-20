import BlogPageClient from "@/components/blog-page-client"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const blogs = await fetchBlogsOnServer()
  return <BlogPageClient initialBlogs={blogs} initialError={null} />
}

async function fetchBlogsOnServer() {
  try {
    // For Server Components, we need to use absolute URLs
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    
    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs on server:", error)
    return []
  }
}