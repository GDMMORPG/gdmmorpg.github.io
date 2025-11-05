import ClipboardButton from "@/components/clipboard";
import { MDXRemoteProps } from "next-mdx-remote";

export const components: MDXRemoteProps["components"] = {
    // Add any custom components you want to use in your MDX files here
    h1: (props) => <h1 className="text-4xl font-bold my-4" {...props} />,
    h2: (props) => <h2 className="text-3xl font-semibold my-3" {...props} />,
    h3: (props) => <h3 className="text-2xl font-semibold my-2" {...props} />,
    h4: (props) => <h4 className="text-xl font-semibold my-2" {...props} />,
    h5: (props) => <h5 className="text-lg font-semibold my-1" {...props} />,
    h6: (props) => <h6 className="text-base font-semibold my-1" {...props} />,
    p: (props) => <p className="my-2 leading-relaxed" {...props} />,
    a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
    ul: (props) => <ul className="list-disc my-2 ml-4" {...props} />,
    ol: (props) => <ol className="list-decimal my-2 ml-4" {...props} />,
    li: (props) => <li className="my-1 ml-4" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4" {...props} />,
    pre: (props) => (
        <div className="relative group">
            <pre className="bg-zinc-200 dark:bg-gray-800 rounded-lg p-4 my-4 overflow-x-auto" {...props} />
            <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ClipboardButton code={props.children.props.children} />
            </div>
        </div>
    ),
};