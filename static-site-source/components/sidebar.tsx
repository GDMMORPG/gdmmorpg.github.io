"use client";
import Link from "next/link";
import { useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleDown, FaAngleRight } from "react-icons/fa";

export class SidebarProps {
    isExpanded?: boolean;
    title?: string;
    href?: string;
    nestedItems?: SidebarItemProps[];
    children?: React.ReactNode;
}

export class SidebarItemProps {
    title: string;
    href?: string;
    hints?: string[];
    nestedItems?: SidebarItemProps[];
    constructor(title: string, nestedItems?: SidebarItemProps[]) {
        this.title = title;
        this.nestedItems = nestedItems;
    }
}

export default function Sidebar(props: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const toggleExpansion = (itemKey: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemKey)) {
            newExpanded.delete(itemKey);
        } else {
            newExpanded.add(itemKey);
        }
        setExpandedItems(newExpanded);
    };

    const searchInItem = (item: SidebarItemProps, term: string): boolean => {
        const lowerTerm = term.toLowerCase();
        
        // Check if title matches
        if (item.title.toLowerCase().includes(lowerTerm)) {
            return true;
        }
        
        // Check if any hints match
        if (item.hints && item.hints.some(hint => hint.toLowerCase().includes(lowerTerm))) {
            return true;
        }
        
        // Check nested items recursively
        if (item.nestedItems && item.nestedItems.some(nestedItem => searchInItem(nestedItem, term))) {
            return true;
        }
        
        return false;
    };

    const filterItems = (items: SidebarItemProps[]): SidebarItemProps[] => {
        if (!searchTerm.trim()) return items;
        
        return items.filter(item => searchInItem(item, searchTerm)).map(item => ({
            ...item,
            nestedItems: item.nestedItems ? filterItems(item.nestedItems) : undefined
        }));
    };

    const expandNestedItems = (items: SidebarItemProps[], depth: number = 0) => {
        const filteredItems = filterItems(items);
        
        return (
            <ul className={`${depth == 0 ? 'space-y-2' : 'ml-6 mt-1 space-y-1'}`}>
                {filteredItems.map((item, index) => {
                    const itemKey = `${item.title}-${index}-${depth}`;
                    const hasNestedItems = item.nestedItems && item.nestedItems.length > 0;
                    const isItemExpanded = expandedItems.has(itemKey) || searchTerm.trim() !== "";
                    
                    return (
                        <li key={itemKey}>
                            <div className="flex items-center">
                                {item.href ? (
                                    <Link 
                                        href={item.href} 
                                        className="flex-1 flex items-center text-gray-700 dark:text-gray-300 no-underline hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
                                        title={item.title}
                                    >
                                        <span className={isExpanded ? 'block' : 'hidden'}>{item.title}</span>
                                    </Link>
                                ) : (
                                    <span className="flex-1 flex items-center text-gray-700 dark:text-gray-300 p-1 rounded" title={item.title}>
                                        <span className={isExpanded ? 'block' : 'hidden'}>{item.title}</span>
                                    </span>
                                )}
                                {hasNestedItems && isExpanded && !searchTerm.trim() && (
                                    <button
                                        onClick={() => toggleExpansion(itemKey)}
                                        className="p-1 ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                                    >
                                        {isItemExpanded ? (
                                            <FaAngleDown className="w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-200" />
                                        ) : (
                                            <FaAngleRight className="w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform duration-200" />
                                        )}
                                    </button>
                                )}
                            </div>
                            {/* Show hints if searching and item matches */}
                            {searchTerm.trim() && item.hints && item.hints.some(hint => hint.toLowerCase().includes(searchTerm.toLowerCase())) && isExpanded && (
                                <div className="ml-4 mt-1">
                                    {item.hints.filter(hint => hint.toLowerCase().includes(searchTerm.toLowerCase())).map((hint, hintIndex) => (
                                        <div key={hintIndex} className="text-xs text-gray-500 dark:text-gray-400 italic">
                                            {hint}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {hasNestedItems && isExpanded && isItemExpanded && (
                                expandNestedItems(item.nestedItems!, depth + 1)
                            )}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="flex">
            <aside className={`${isExpanded ? 'w-64' : 'w-16'} bg-gray-100 dark:bg-gray-800 p-4 min-h-screen transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
                {/* Sidebar Title */}
                {props.href && (
                    <Link href={props.href} className={`text-xl font-bold text-gray-900 dark:text-white ${isExpanded ? 'block' : 'hidden'}`}>
                        {props.title}
                    </Link>
                ) || (
                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${isExpanded ? 'block' : 'hidden'}`}>
                        {props.title}
                    </h2>
                )}
                {/* Expand/Collapse Button */}
                <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                {isExpanded ? (
                    <FaAngleDoubleLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                    <FaAngleDoubleRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
                </button>
            </div>
            {/* Search bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isExpanded ? 'block' : 'hidden'}`}
                />
            </div>

            {/* Navigation Items */}
            <nav>
                {props.nestedItems && expandNestedItems(props.nestedItems)}
            </nav>
            </aside>
            {props.children && (
            <main className="flex-1">
                {props.children}
            </main>
            )}
        </div>
    );
}