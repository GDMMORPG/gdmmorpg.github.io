import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllBlogFiles, getBlogPath } from "@/utils/markdown";
import Link from "next/link";
import Image from "next/image";
import { BlogData } from "../page";
import { components } from "@/utils/markdown_components";

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export function generateStaticParams() {
    const markdownFiles = getAllBlogFiles();
    
    return markdownFiles.map((file) => {
        const slug = file.replace(/\.md$/, "").split(path.sep);
        return { slug };
    });
}

export default async function MarkdownPage({ params }: PageProps) {
    const { slug } = await params;
    const filePath = getBlogPath(slug.join(path.sep)) + ".md";

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content } = matter(fileContents);
    const blog = new BlogData(
        frontMatter.title || 'Untitled',
        frontMatter.releasedate ? new Date(frontMatter.releasedate).toLocaleDateString() : '',
        frontMatter.description || '',
        frontMatter.coverImage || '',
        slug.join('/'),
        frontMatter.author || '',
        frontMatter.tags ? frontMatter.tags.split(',').map((tag: string) => tag.trim()) : []
    )

    blog.author_github = frontMatter.author_github || '';

    const guess_content_reading_time = content.split(' ').length / 200;
    const reading_time_minutes = Math.ceil(guess_content_reading_time);
    const reading_time_text = reading_time_minutes <= 1 ? '1 min read' : `${reading_time_minutes} mins read`;

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Back button */}
            <Link href="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Blogs
            </Link>

            <div className="flex gap-8">
                {/* Left content area */}
                <div className="flex-1">
                <article className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    {/* Cover image */}
                    {blog.coverImage && (
                    <div className="mb-6">
                        <Image
                        src={blog.coverImage}
                        alt={blog.title || "Blog cover"}
                        width={800}
                        height={400}
                        className="rounded-lg object-cover w-full"
                        />
                    </div>
                    )}

                    {/* Title */}
                    {blog.title && (
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                        {blog.title}
                    </h1>
                    )}

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        {reading_time_text}
                    </p>

                    {/* Author */}
                    {blog.author && (
                    <div className="flex items-center mb-4 text-zinc-600 dark:text-zinc-400">
                        {blog.author_github && (
                        <Image 
                            src={`https://avatars.githubusercontent.com/${blog.author_github}`} 
                            width={20} 
                            height={20} 
                            className="rounded-full mr-2" 
                            alt={blog.author} 
                        />
                        )}
                        <span>
                            by {blog.author_github && (
                                <Link href={`https://github.com/${blog.author_github}`} className="text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer">{blog.author}</Link>
                            )
                            || blog.author }
                        </span>
                        {blog.releasedate && (
                        <span className="ml-2 text-zinc-500 dark:text-zinc-500">
                            • {blog.releasedate}
                        </span>
                        )}
                    </div>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.map((tag: string, index: number) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                        >
                            {tag}
                        </span>
                        ))}
                    </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <MDXRemote source={content} components={components} />
                    </div>
                </article>
                </div>
            </div>
            </div>
        </div>
    );
}
