import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { SEO } from "@/components/SEO";
import { Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import katex from "katex";

interface Paper {
  title: string;
  date: string;
  abstract: string;
  conference: string;
  filename: string;
  tags?: string[];
}

async function getPapers(): Promise<Paper[]> {
  const response = await fetch("/research/research.json");
  if (!response.ok) throw new Error("Failed to load papers");
  const papers: Paper[] = await response.json();
  return papers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function renderLatex(text: string): string {
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: papers, isLoading } = useQuery<Paper[]>({
    queryKey: ["papers"],
    queryFn: getPapers
  });

  const allTags = Array.from(new Set(papers?.flatMap(p => p.tags ?? []) || []));

  const filteredPapers = papers?.filter(paper =>
    selectedTags.length === 0 ||
    selectedTags.every(tag => paper.tags?.includes(tag))
  ) || [];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <SEO
        title="Research | Akshay Chandrasekhar — Algorhythm + Flow"
        description="Academic research papers in computer vision, mathematics, and AI by Akshay Chandrasekhar. Covering topics from geometry to machine learning."
        type="website"
        url="/research"
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
                {selectedTags.length > 0
                  ? `Papers tagged: ${selectedTags.join(", ")}`
                  : "Research Papers"
                }
              </h1>
              {selectedTags.length === 0 && (
                <p className="mt-3 text-foreground/70 text-base md:text-lg leading-relaxed max-w-2xl">
                  A list of my published and unpublished research work
                </p>
              )}
            </div>
          </div>

          {/* Topics Filter */}
          <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="no-underline focus:outline-none rounded-full"
                  >
                    <Badge
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className={`
                        transition-colors duration-200
                        ${selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'hover:bg-primary hover:text-primary-foreground'
                        }
                      `}
                    >
                      {tag}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

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
              {filteredPapers.map((paper) => (
                <motion.article
                  key={paper.filename}
                  variants={item}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative overflow-hidden rounded-xl shadow-md bg-gradient-to-br from-muted/40 to-background p-6 group transform-gpu cursor-pointer"
                  onClick={() => window.open(`/research/${paper.filename}`, "_blank")}
                >
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  </div>

                  <div className="relative p-2 md:p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
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

                        <p className="text-foreground/80 text-base leading-relaxed tracking-wide line-clamp-3 mb-4">
                          <LatexText text={paper.abstract} />
                        </p>

                        {paper.tags && paper.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                            {paper.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className="no-underline focus:outline-none rounded-full"
                              >
                                <Badge
                                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                  className={`
                                    transition-colors duration-200
                                    ${selectedTags.includes(tag)
                                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                      : 'hover:bg-primary hover:text-primary-foreground'
                                    }
                                  `}
                                >
                                  {tag}
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {paper.conference && (
                        <div className="flex-shrink-0 mt-1">
                          <Star fill="currentColor" className="h-4 w-4 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
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
