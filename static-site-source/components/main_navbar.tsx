import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function MainNavbar() {
    return (
        <div className="w-full border-b border-zinc-200 bg-white px-8 py-6 dark:border-zinc-800 dark:bg-black sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-white">
            Godot-MMORPG
          </Link>

          <nav className="mt-4 flex space-x-4 sm:mt-0">
            <Link
              href="/docs"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Documentation
            </Link>
            <Link
              href="/blogs"
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Blogs
            </Link>
            <Link 
              href="https://github.com/orgs/GDMMORPG/repositories" 
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <FaGithub className="inline mr-1" />
              Github
            </Link>
          </nav>
        </div>
    );
}