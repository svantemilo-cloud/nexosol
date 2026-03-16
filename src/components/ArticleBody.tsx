import type { ArticleBlock } from "@/lib/articles";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <article className="max-w-none text-forest">
      {blocks.map((block, i) => {
        if (block.type === "p") {
          return (
            <p key={i} className="mb-4 leading-relaxed text-forest/90">
              {block.content}
            </p>
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={i}
              id={block.content.toLowerCase().replace(/\s+/g, "-")}
              className="mt-10 mb-4 text-xl font-semibold text-forest"
            >
              {block.content}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={i} className="mt-6 mb-3 text-lg font-semibold text-forest">
              {block.content}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={i} className="mb-4 list-disc space-y-1 pl-6 text-forest/90">
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }
        return null;
      })}
    </article>
  );
}
