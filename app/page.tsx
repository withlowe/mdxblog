import fs from "fs"
import path from "path"
import matter from "gray-matter"
import Link from "next/link"
import { formatDistance } from "date-fns"
import { Tag } from "lucide-react"

export default function Home({
  searchParams,
}: {
  searchParams: { tag?: string }
}) {
  // Get the tag from the URL query parameters
  const selectedTag = searchParams.tag

  // Get all markdown files from the posts directory
  const postsDirectory = path.join(process.cwd(), "posts")
  const filenames = fs.readdirSync(postsDirectory)

  // Get the front matter and slug from each file
  const posts = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "")
    const fullPath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    return {
      slug,
      ...data,
    }
  })

  // Sort posts by date
  const sortedPosts = posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Filter posts by tag if a tag is selected
  const filteredPosts = selectedTag
    ? sortedPosts.filter((post) => post.tags && post.tags.includes(selectedTag))
    : sortedPosts

  // Extract all unique tags from all posts
  const allTags = Array.from(new Set(posts.flatMap((post) => (post.tags ? post.tags : [])))).sort()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Markdown Blog</h1>
        <p className="text-gray-600 mb-6">A simple blog built with Next.js and Markdown</p>

        {/* Tags filter section */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Tag className="w-4 h-4 mr-2" />
            <h2 className="text-lg font-semibold">Filter by tag</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedTag ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All Posts
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/?tag=${tag}`}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Show which tag is selected */}
        {selectedTag && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing posts tagged with: <span className="font-semibold">{selectedTag}</span>
            </p>
          </div>
        )}
      </header>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No posts found with the tag: {selectedTag}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            View all posts
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/posts/${post.slug}`} className="block mb-2">
                <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors">{post.title}</h2>
              </Link>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <time dateTime={post.date}>{formatDistance(new Date(post.date), new Date(), { addSuffix: true })}</time>
              </div>
              <Link href={`/posts/${post.slug}`} className="block mb-4">
                <p className="text-gray-700">{post.excerpt}</p>
              </Link>
              <div className="flex flex-wrap gap-2">
                {post.tags &&
                  post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/?tag=${tag}`}
                      className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full hover:bg-gray-200"
                    >
                      {tag}
                    </Link>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
