import matter from "gray-matter";
import Link from "next/link";
import fs from "fs";
import path from "path";
import Image from "next/image";
import { getAllBlogFiles, getAllDocumentationFiles, getBlogPath, getDocumentationPath } from "@/utils/markdown";

export class BlogData {
    title: string
    releasedate: string
    description: string
    coverImage: string
    slug: string
    author: string
    author_github?: string
    tags: string[]
    
    constructor(title: string, releasedate: string, description: string, coverImage: string, slug: string, author: string, tags: string[]) {
        this.title = title;
        this.releasedate = releasedate;
        this.description = description;
        this.coverImage = coverImage;
        this.slug = slug;
        this.author = author;
        this.tags = tags;
    }
}

export function getBlogsData(limit?: number) : BlogData[] {
    const blogsDir = getBlogPath();
    const blogFiles = getAllBlogFiles();
    const blogs = blogFiles.map(file => {
        const filePath = path.join(blogsDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        const blog = new BlogData(
            data.title || 'Untitled',
            data.releasedate ? new Date(data.releasedate).toLocaleDateString() : '',
            data.description || '',
            data.coverImage || '',
            file.replace(/\.md$/, ''),
            data.author || '',
            data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []
        );

        blog.author_github = data.author_github || '';

        return blog;
    }).sort((a, b) => {
        return new Date(b.releasedate).getTime() - new Date(a.releasedate).getTime();
    });

    return limit ? blogs.slice(0, limit) : blogs;
}



export default function BlogsPage() {
    const blogs: BlogData[] = getBlogsData();
    
    console.log(blogs);

    return (
        <div className="p-24">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                    Blogs
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    Stay updated with our latest insights and tutorials
                </p>
                <div className="space-y-3">
                    {blogs.map((blog) => (
                        <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="no-underline block">
                            <div className="flex items-start p-4 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors">
                                {blog.coverImage && (
                                    <div className="shrink-0 mr-4">
                                        {blog.coverImage && (
                                            <Image
                                            src={blog.coverImage}
                                            alt={blog.title}
                                            width={80}
                                            height={80}
                                            className="rounded-lg object-cover"
                                        />)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                                        {blog.title}
                                        {blog.releasedate && (
                                            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                                ({blog.releasedate})
                                            </span>
                                        )}
                                        {blog.author && blog.author_github && (
                                            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                                by <Image src={`https://avatars.githubusercontent.com/${blog.author_github}`} 
                                                width={16} height={16} className="inline-block rounded-full mr-1" alt={blog.author} /> {blog.author}
                                            </span>
                                        ) || (blog.author && !blog.author_github && (
                                            <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
                                                by {blog.author}
                                            </span>
                                        ))}
                                    </h4>
                                    {blog.description && (
                                        <p className="text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                                            {blog.description.length > 200 
                                                ? `${blog.description.substring(0, 200)}... read more`
                                                : blog.description
                                            }
                                        </p>
                                    )}
                                    {blog.tags.length > 0 && (
                                        <>
                                        <hr className="my-2 border-zinc-300 dark:border-zinc-600" />
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {blog.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
