"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FiDownload, FiSave, FiSearch, FiStar, FiX } from "react-icons/fi"
import { FaGalacticRepublic } from "react-icons/fa"
import Image from "next/image"
import Head from "next/head"

type Wallpaper = {
  id: string
  title: string
  description: string
  image_url: string
  tags: string[]
}

export default function ExplorePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [filteredWallpapers, setFilteredWallpapers] = useState<Wallpaper[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [savedImages, setSavedImages] = useState<string[]>([])
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null)

  // SEO Metadata
  const pageTitle = "Nebula Visuals | HD Cosmic Wallpapers & Aesthetic Backgrounds"
  const pageDescription =
    "Discover stunning HD wallpapers including cosmic themes, nature backgrounds, cute wallpapers, and dark mode wallpapers. Perfect for phones and desktop. Free downloads available."
  const siteUrl = "https://lirivelle.com/wallpapers"
  const keywords = [
    "HD wallpapers",
    "aesthetic backgrounds",
    "phone wallpapers",
    "cute wallpapers",
    "nature backgrounds",
    "wallpapers for mental escape",
    "pet wallpapers",
    "motivational quotes wallpapers",
    "dark mode wallpapers",
    "cosmic wallpapers",
    "free wallpapers download",
    "4K backgrounds",
    "galaxy wallpapers",
    "space wallpapers",
    "nebula visuals",
  ].join(", ")

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const res = await fetch("/api/wallpapers")
        const data = await res.json()

        if (data.success) {
          setWallpapers(data.wallpapers)
          setFilteredWallpapers(data.wallpapers)
        } else {
          setError("Failed to load cosmic wonders.")
        }
      } catch (error) {
        setError("Connection to the cosmos failed.")
        console.error("Stellar fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWallpapers()

    const saved = localStorage.getItem("savedWallpapers")
    if (saved) {
      setSavedImages(JSON.parse(saved))
    }
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredWallpapers(wallpapers)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/searchy?query=${encodeURIComponent(searchQuery)}&type=wallpaper`)
      const data = await res.json()

      if (data.success) {
        setFilteredWallpapers(data.results)
      } else {
        setError("Cosmic search failed. Try another constellation.")
        setFilteredWallpapers(wallpapers)
      }
    } catch (error) {
      setError("Interstellar connection error.")
      console.error("Search error:", error)
      setFilteredWallpapers(wallpapers)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      // Create a hidden iframe to handle the download
      // This approach helps trigger the browser's download UI more reliably
      const iframe = document.createElement("iframe")
      iframe.style.display = "none"
      document.body.appendChild(iframe)

      // Fetch the image
      const response = await fetch(imageUrl, { mode: "cors" })
      if (!response.ok) throw new Error("Transmission failed")

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      // Use the iframe to trigger download
      const iframeDoc = iframe.contentWindow?.document
      if (iframeDoc) {
        const link = iframeDoc.createElement("a")
        link.href = blobUrl
        link.download = `${title || "cosmic-wonder"}.jpg`
        link.click()

        // Clean up after a short delay
        setTimeout(() => {
          window.URL.revokeObjectURL(blobUrl)
          document.body.removeChild(iframe)
        }, 1000)
      } else {
        // Fallback to the original method if iframe approach fails
        const link = document.createElement("a")
        link.href = blobUrl
        link.download = `${title || "cosmic-wonder"}.jpg`
        link.target = "_blank"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Warp drive malfunction! Try again.")
    }
  }

  const handleSaveToGallery = async (id: string, imageUrl: string, title: string) => {
    try {
      if (!savedImages.includes(id)) {
        await handleDownload(imageUrl, title)

        const updatedSaved = [...savedImages, id]
        setSavedImages(updatedSaved)
        localStorage.setItem("savedWallpapers", JSON.stringify(updatedSaved))
      }
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const openFullImage = (wallpaper: Wallpaper) => {
    setSelectedWallpaper(wallpaper)
    document.body.style.overflow = "hidden"
  }

  const closeFullImage = () => {
    setSelectedWallpaper(null)
    document.body.style.overflow = "auto"
  }

  if (loading) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={siteUrl} />
          <meta property="og:type" content="website" />
        </Head>
        <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-70 animate-pulse"></div>
            <div className="relative w-24 h-24 border-4 border-transparent border-t-cyan-300 border-r-cyan-300 rounded-full animate-spin"></div>
          </div>
          <p className="mt-8 text-xl text-cyan-100 font-light tracking-widest animate-pulse">CONNECTING TO COSMOS...</p>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
        </Head>
        <div className="p-4 text-center bg-gradient-to-br from-indigo-900 to-purple-900 min-h-screen flex flex-col justify-center items-center">
          <div className="mb-6 text-cyan-300 text-7xl">✧</div>
          <p className="text-xl mb-4 text-cyan-100 font-light max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-cyan-600/20 border border-cyan-400/50 text-cyan-100 rounded-full shadow-lg transition-all duration-300 hover:bg-cyan-500/40 hover:text-white hover:shadow-cyan-500/30"
          >
            RETRY TRANSMISSION
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${siteUrl}/images/nebula-visuals-preview.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${siteUrl}/images/nebula-visuals-preview.jpg`} />
        <link rel="canonical" href={siteUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 text-white relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
              }}
            ></div>
          ))}
        </div>

        <main className="container mx-auto px-4 py-12 relative z-10">
          <header className="mb-16 text-center">
            <div className="flex justify-center items-center mb-6">
              <FaGalacticRepublic className="text-cyan-300 text-4xl mr-3" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300 tracking-tight">
                NEBULA VISUALS
              </h1>
            </div>

            <p className="max-w-2xl mx-auto text-cyan-100 mb-10 text-lg font-light tracking-wide">
              Discover ultra HD cosmic wallpapers from across the universe. Elevate your screens to interstellar levels.
            </p>

            <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto mb-12 relative">
              <input
                type="text"
                placeholder="Search galaxies, nebulas, planets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow px-6 py-4 rounded-full border border-indigo-700 focus:ring-2 focus:ring-cyan-300 bg-indigo-900/30 backdrop-blur-sm text-white placeholder-indigo-300 shadow-xl pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-cyan-300 hover:text-white"
                aria-label="Search wallpapers"
              >
                <FiSearch className="text-xl" />
              </button>
            </form>
          </header>

          <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 lg:gap-6 space-y-3 sm:space-y-4 lg:space-y-6">
            {filteredWallpapers.map((wallpaper) => (
              <div
                key={wallpaper.id}
                className="break-inside-avoid group relative mb-3 sm:mb-4 lg:mb-6 overflow-hidden rounded-xl bg-indigo-900/20 border border-indigo-700/50 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-xl hover:shadow-cyan-500/10 cursor-zoom-in"
                itemScope
                itemType="https://schema.org/ImageObject"
                onClick={() => openFullImage(wallpaper)}
              >
                <div className="relative overflow-hidden aspect-auto">
                  <Image
                    src={wallpaper.image_url || "/placeholder.svg"}
                    alt={wallpaper.title}
                    width={600}
                    height={900}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div>
                      <h2 className="text-xl font-medium text-white mb-1" itemProp="name">
                        {wallpaper.title}
                      </h2>
                      <p className="text-sm text-cyan-100 font-light mb-3" itemProp="description">
                        {wallpaper.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {wallpaper.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2.5 py-1 rounded-full bg-indigo-900/40 text-cyan-100 border border-cyan-400/20"
                            itemProp="keywords"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex gap-2 opacity-100 sm:opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(wallpaper.image_url, wallpaper.title)
                    }}
                    className="p-2.5 bg-indigo-900/70 rounded-full hover:bg-cyan-500 transition-colors duration-200 text-white"
                    title="Download"
                    aria-label={`Download ${wallpaper.title}`}
                  >
                    <FiDownload />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveToGallery(wallpaper.id, wallpaper.image_url, wallpaper.title)
                    }}
                    disabled={savedImages.includes(wallpaper.id)}
                    className={`p-2.5 rounded-full transition-colors duration-200 ${
                      savedImages.includes(wallpaper.id)
                        ? "bg-purple-500/70 text-white cursor-default"
                        : "bg-indigo-900/70 hover:bg-purple-500 text-white"
                    }`}
                    title={savedImages.includes(wallpaper.id) ? "Saved" : "Save"}
                    aria-label={savedImages.includes(wallpaper.id) ? "Wallpaper saved" : "Save wallpaper"}
                  >
                    {savedImages.includes(wallpaper.id) ? (
                      <FiStar className="fill-yellow-300 text-yellow-300" />
                    ) : (
                      <FiSave />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWallpapers.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="text-7xl mb-6 text-cyan-300/30">✧</div>
              <h3 className="text-2xl text-cyan-100 font-light mb-3">No cosmic wonders found</h3>
              <p className="text-cyan-300/70 max-w-md mx-auto">Try adjusting your search or explore another galaxy</p>
            </div>
          )}
        </main>

        {/* Full Image View Modal */}
        {selectedWallpaper && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={closeFullImage}
          >
            <button
              onClick={closeFullImage}
              className="absolute top-4 right-4 p-2 text-white hover:text-cyan-300 transition-colors z-50"
              aria-label="Close full view"
            >
              <FiX className="text-2xl" />
            </button>

            <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={selectedWallpaper.image_url || "/placeholder.svg"}
                alt={selectedWallpaper.title}
                width={1920}
                height={1080}
                className="w-full h-auto max-h-[80vh] object-contain"
                quality={100}
              />

              <div className="mt-4 text-white">
                <h2 className="text-2xl font-bold">{selectedWallpaper.title}</h2>
                <p className="text-cyan-100">{selectedWallpaper.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedWallpaper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-indigo-900/40 text-cyan-100 border border-cyan-400/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(selectedWallpaper.image_url, selectedWallpaper.title)
                  }}
                  className="px-4 py-2 bg-cyan-600 rounded-lg flex items-center gap-2 hover:bg-cyan-500 transition-colors"
                >
                  <FiDownload /> Download
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveToGallery(selectedWallpaper.id, selectedWallpaper.image_url, selectedWallpaper.title)
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    savedImages.includes(selectedWallpaper.id) ? "bg-purple-600" : "bg-indigo-700 hover:bg-indigo-600"
                  }`}
                >
                  {savedImages.includes(selectedWallpaper.id) ? (
                    <>
                      <FiStar className="fill-yellow-300 text-yellow-300" /> Saved
                    </>
                  ) : (
                    <>
                      <FiSave /> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes twinkle {
            0% { opacity: 0.1; }
            100% { opacity: 0.8; }
          }
          body {
            background-color: #1e1b4b;
          }
          /* Ensure images don't break across columns */
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        `}</style>
      </div>
    </>
  )
}
