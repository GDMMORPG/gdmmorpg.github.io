import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAllBlogFiles, getAllDocumentationFiles, getAllDocumentationFilesNormalized, getDocumentationFile, getDocumentationPath } from "@/utils/markdown";
import Link from "next/link";
import Image from "next/image";
import { components } from "@/utils/markdown_components";

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export function generateStaticParams() {
    const markdownFiles = getAllDocumentationFilesNormalized();
    return markdownFiles.map((file) => {
        const slug = file.replace(/\.md$/, "").split(path.sep);
        return { slug };
    });
}

class DocumentationData {
    title: string
    author_githubs?: string

    constructor(title: string) {
        this.title = title;
    }
}

export default async function MarkdownPage({ params }: PageProps) {
    const { slug } = await params;
    const filePath = getDocumentationFile(slug.join(path.sep));
    
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data: frontMatter, content } = matter(fileContents);
    const documentation = new DocumentationData(
        frontMatter.title || 'Untitled',
    )

    const guess_content_reading_time = content.split(' ').length / 200;
    const reading_time_minutes = Math.ceil(guess_content_reading_time);
    const reading_time_text = reading_time_minutes <= 1 ? '1 min read' : `${reading_time_minutes} mins read`;

    return (
        <div className="min-h-screen">
            <div className="flex gap-8 p-8">
                {/* Left content area */}
                <div className="flex-1">
                <article>
                    {/* Title */}
                    {documentation.title && (
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
                        {documentation.title}
                    </h1>
                    )}

                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                        {reading_time_text}
                    </p>

                    {/* Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <MDXRemote source={content} components={components} />
                    </div>
                </article>
                </div>

                {/* Right sidebar for authors */}
                {documentation.author_githubs && (
                <div className="w-64 shrink-0">
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 sticky top-8">
                        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Authors</h3>
                        <div className="space-y-3">
                            {documentation.author_githubs.split(',').map((github: string, index: number) => (
                                <div key={index} className="flex items-center">
                                    <Image 
                                        src={`https://avatars.githubusercontent.com/${github.trim()}`} 
                                        width={24} 
                                        height={24} 
                                        className="rounded-full mr-3" 
                                        alt={github.trim()} 
                                    />
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{github.trim()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
