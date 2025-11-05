import MainNavbar from "@/components/main_navbar";
import Link from "next/link";
import { FaFile } from "react-icons/fa";
import { getBlogsData } from "./blogs/page";

export default function Home() {
  const blogs = getBlogsData(4)
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        {/* Title + Navigation Bar */}
        <MainNavbar />

        {/* Main Content */}
        <div className="flex w-full flex-1 flex-col items-center justify-start px-8 py-12">
          {/* Welcome Message */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Welcome to Godot-MMORPG Project
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl mx-auto">
              Your gateway to building immersive multiplayer online experiences. 
              Explore our documentation, learn from our community, and start creating.
            </p>
          </div>

          {/* About Us / Mission */}
          <div className="mb-12 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We&apos;re building a vibrant community of MMORPG developers. Our project welcomes 
              contributors of all skill levels, providing real-world experience and verifiable 
              open-source contributions for your professional portfolio.
            </p>
          </div>

          {/* Contributors and Latest Blogs Side by Side */}
          <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contributors Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                  How to Contribute
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Join our team! We welcome contributors from all disciplines
                </p>
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Engineers</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Code gameplay, networking, and tools</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-3">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Artists</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Create 3D models, textures, and animations</p>
                  </div>
                  <div className="border-l-2 border-purple-500 pl-3">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Designers</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Design gameplay, UI/UX, and systems</p>
                  </div>
                  <div className="border-l-2 border-orange-500 pl-3">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Writers</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Craft stories, documentation, and tutorials</p>
                  </div>
                </div>
                <Link 
                  href="/docs/contributing"
                  className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                <FaFile className="mr-1" />
                  Start contributing
                </Link>
            </div>

            {/* Latest Blogs Section */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                Latest Blogs
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                Stay updated with our latest insights and tutorials
              </p>
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <div key={blog.slug} className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-medium text-zinc-900 dark:text-white">
                      <Link href={`/blogs/${blog.slug}`} className="hover:underline">
                        {blog.title}
                      </Link>
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {blog.description.length > 100 
                        ? `${blog.description.substring(0, 100)}...` 
                        : blog.description
                      }
                    </p>
                  </div>
                ))}
              </div>
              <Link 
                href="/blogs"
                className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                <FaFile className="mr-1" />
                View all blogs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
