import MainNavbar from "@/components/main_navbar";
import Sidebar, { SidebarProps } from "@/components/sidebar";
import { getAllDocumentationFiles } from "@/utils/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docs",
    description: "Documentation for GDMMORPG",
};

export default function DocsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const sidebarProps: SidebarProps = {
        isExpanded: true,
        title: "Home",
        href: "/docs",
        nestedItems: [],
    };

    const docs = getAllDocumentationFiles();
    const items: SidebarProps["nestedItems"] = [];

    const recursiveFindItem = (items: SidebarProps["nestedItems"], title: string): SidebarProps | null => {
        if (!items) return null;
        for (const item of items) {
            if (item.title === title) {
                return item;
            }
            const foundInNested = recursiveFindItem(item.nestedItems, title);
            if (foundInNested) {
                return foundInNested;
            }
        }
        return null;
    };

    for (const doc of docs) {
        const normalized = doc.replaceAll("\\", "/")
        const parts = normalized.split("/");

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const parentPart = i > 0 ? parts[i - 1] : null;
            const parentItem = parentPart ? recursiveFindItem(items, parentPart.replace(/^\d+_/, "").replace(/\.md$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase())) : null;
            const title = part.replace(/^\d+_/, "").replace(/\.md$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            const href = `/docs/${parts.map(p => p.replace(/^\d+_/, "")).slice(0, i + 1).join("/")}`.replace(/index\.md$/, "").replace(/\.md$/, "");

            if (part.endsWith(".md")) {
                // It's a file
                if (parentItem !== null && parentItem !== undefined) {
                    // Handle special case for index.md
                    if (title === "Index") {
                        parentItem.href = href;
                        continue;
                    }
                    if (!parentItem.nestedItems) {
                        parentItem.nestedItems = [];
                    }
                    if (!parentItem.nestedItems.some(item => item.title === title)) {
                        parentItem.nestedItems.push({
                            title: title,
                            href: href,
                        });
                    }
                }
            } else {
                // It's a directory
                if (parentItem === null) {
                    if (!items.some(item => item.title === title)) {
                        items.push({
                            title: title,
                            // href: href,
                            nestedItems: [],
                        });
                    }
                } else {
                    if (!parentItem.nestedItems) {
                        parentItem.nestedItems = [];
                    }
                    if (!parentItem.nestedItems.some(item => item.title === title)) {
                        parentItem.nestedItems.push({
                            title: title,
                            // href: href,
                            nestedItems: [],
                        });
                    }
                }
            }
        }
    } 

    sidebarProps.nestedItems = items;

    return <>
        {/* Title + Navigation Bar */}
        <MainNavbar />
        
        {/* Expandable Sidebar */}
        <Sidebar {...sidebarProps} >
            {/* Main Content */}
            {children}
        </Sidebar>
    </>;
}
