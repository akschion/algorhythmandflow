import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import katex from "katex";

interface Paper {
  title: string;
  date: string;
  abstract: string;
  conference: string;
  filename: string;
}

async function getPapers(): Promise<Paper[]> {
  const response = await fetch("/papers/papers.json");
  if (!response.ok) throw new Error("Failed to load papers");
  const papers: Paper[] = await response.json();
  return papers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function renderLatex(text: string): string {
  // Replace $$...$$ (display) first, then $...$ (inline)
  let result = text;
  result = result.replace(/\$\$([^$]+)\$\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: true, throwOnError: false });
    } catch {
      return `$$${math}$$`;
    }
  });
  result = result.replace(/\$([^$\n]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, { displayMode: false, throwOnError: false });
    } catch {
      return `$${math}$`;
    }
  });
  return result;
}

function LatexText({ text, className }: { text: string; className?: string }) {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: renderLatex(text) }}
    />
  );
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Research() {
  const { data: papers, isLoading } = useQuery<Paper[]>({
    queryKey: ["papers"],
    queryFn: getPapers
  });

  return (
    <>
      <SEO
        title="Algorhythm + Flow - Research"
        description="Research papers on mathematics, music, and technology."
        type="website"
      />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] overflow-x-hidden">
        <div className="space-y-8">
          {/* Title Card */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            </div>
            <div className="relative p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent pb-2">
                Research Papers
              </h1>
              <p className="mt-3 text-foreground/70 text-base md:text-lg leading-relaxed max-w-2xl">
                A collection of my academic work spanning mathematics, music, and their intersections. Feel free to read and reach out with any thoughts.
              </p>
            </div>
          </div>

          {/* Papers List */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse rounded-xl bg-muted/40 p-8 space-y-4">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-1/5" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {papers?.map((paper) => (
                <motion.article
                  key={paper.filename}
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-muted/40 to-background p-6 group transform-gpu cursor-pointer"
                  onClick={() => window.open(`/papers/${paper.filename}`, "_blank")}
                >
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  </div>

                  <div className="relative p-2 md:p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <time dateTime={paper.date}>
                        {format(new Date(paper.date), "MMM d, yyyy")}
                      </time>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold mb-1 text-foreground group-hover:text-primary transition-colors">
                      <LatexText text={paper.title} />
                    </h2>

                    {paper.conference && (
                      <p className="text-sm text-muted-foreground mb-3">
                        <em><LatexText text={paper.conference} /></em>
                      </p>
                    )}

                    <p className="text-foreground/80 text-base leading-relaxed tracking-wide line-clamp-3">
                      <LatexText text={paper.abstract} />
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
