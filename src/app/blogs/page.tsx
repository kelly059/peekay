// app/blog/page.tsx or wherever your BlogPage is

import BlogPageClient from "@/components/blog-page-client"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const blogs = await fetchBlogsOnServer()
  return <BlogPageClient initialBlogs={blogs} initialError={null} />
}

async function fetchBlogsOnServer() {
  try {
    // ✅ Use your real domain in production
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.lirivelle.com"

    const response = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
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
