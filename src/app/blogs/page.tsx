import BlogPageClient from "@/components/blog-page-client"

// This is a server component that pre-fetches the data
export const dynamic = "force-dynamic" // Add this line to make the route dynamic

export default async function BlogPage() {
  // Fetch data on the server before the page is sent to the client
  const blogs = await fetchBlogsOnServer()

  return <BlogPageClient initialBlogs={blogs} initialError={null} />
}

// Server-side data fetching function
async function fetchBlogsOnServer() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/blogs`, {
      cache: "no-store", // Don't cache the request
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching blogs on server:", error)
    return [] // Return empty array on error
  }
}
