"use client";

import { FaClipboard } from "react-icons/fa";


export default function ClipboardButton({ code }: { code: string }) {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code.trim()).then(() => {
            alert("Code copied to clipboard!");
        }).catch(err => {
            alert("Failed to copy code: " + err);
        });
    };
    return (
        <button
            onClick={copyToClipboard}
            className="p-2 bg-zinc-300 dark:bg-gray-700 hover:bg-zinc-400 dark:hover:bg-gray-600 rounded cursor-pointer"
            title="Copy to clipboard"
        >
            <FaClipboard className="w-4 h-4" />
        </button>
    );
}