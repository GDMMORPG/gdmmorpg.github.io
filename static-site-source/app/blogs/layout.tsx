import MainNavbar from "@/components/main_navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docs",
    description: "Documentation for GDMMORPG",
};

export default function BlogsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        {/* Title + Navigation Bar */}
        <MainNavbar />
        {children}
    </>;
}
