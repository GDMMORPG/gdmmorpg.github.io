
import { isProd } from "@/next.config";
import fs from "fs";
import path from "path";

export function getDocumentationPath(slug?: string): string {
    if (!isProd) {
        return path.join(process.cwd(), "../", "docs", slug || "");
    } else {
        return path.join(process.cwd(), ".pages", "docs", slug || "");
    }
}

export function getBlogPath(slug?: string): string {
    if (!isProd) {
        return path.join(process.cwd(), "../", "blogs", slug || "");
    } else {
        return path.join(process.cwd(), ".pages", "blogs", slug || "");
    }
}

export function getAllDocumentationFiles(): string[] {
    return getAllMarkdownFiles(getDocumentationPath());
}

export function getAllDocumentationFilesNormalized(): string[] {
    const markdownFiles = getAllDocumentationFiles();

    // Remove the <# number>_ from the beginning of the filenames
    const cleanedFiles = markdownFiles.map(file => file.replace(/(^|[\\\/])\d+_/g, '$1'));

    // Flatten the index.md files to their parent directory
    const flattenedFiles = cleanedFiles.map(file => file.replace(/[\\\/]index\.md$/, ""));

    return flattenedFiles;
}
export function getDocumentationFile(slug: string): string {
    const markdownFiles = getAllDocumentationFiles();
    for (const file of markdownFiles) {
        const cleanedFile = file.replace(/(^|[\\\/])\d+_/g, "$1").replace(/[\\\/]index\.md$/, "").replace(/\.md$/, "");
        if (cleanedFile === slug) {
            return path.join(getDocumentationPath(), file);
        }
    }
    throw new Error(`Documentation file not found for slug: ${slug}`);
}

export function getAllBlogFiles(): string[] {
    return getAllMarkdownFiles(getBlogPath());
}

export function getAllMarkdownFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...getAllMarkdownFiles(fullPath, baseDir));
        } else if (item.endsWith(".md")) {
            const relativePath = path.relative(baseDir, fullPath);
            files.push(relativePath);
        }
    }

    return files;
}
