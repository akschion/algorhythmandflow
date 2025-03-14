import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Post } from "@shared/schema";
import { getPosts } from "@/lib/posts";
import { SEO } from "@/components/SEO";

export default function Home() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: getPosts
  });

  const recentPosts = posts || [];

  return (
    <>
      <SEO
        title="Algorhythm + Flow"
        description="Exploring the intersection of mathematics, music, and technology through academic research and creative exploration."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          <div className="md:col-span-3 space-y-12">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
              <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative p-8 md:p-12"
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent pb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Algorhythm + Flow
                </motion.h1>
                <motion.p 
                  className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Documenting my research and hot takes on the interesting concepts bridging the real world and our imagination. Mostly focused on math, tech, and hip-hop, but includes random other topics as well.
                </motion.p>
              </motion.div>
            </div>

            <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg overflow-visible">
              <CardContent className="pt-6">
                <div className="aspect-video rounded-lg overflow-hidden max-h-[250px] w-full">
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/8Ir-zFC9nFE?si=XbwkBYjPbhdiwMdE" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg overflow-visible">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                  Recent Posts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Carousel 
                  className="w-full pb-2 px-2"
                  opts={{
                    slidesToScroll: 1,
                    align: "start"
                  }}
                >
                  <CarouselContent className="py-1">
                    {recentPosts.map(post => (
                      <CarouselItem key={post.id} className="md:basis-1/2 lg:basis-1/3">
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="group relative z-10 overflow-hidden rounded-xl shadow-md 
                             bg-gradient-to-br from-black to-black/10 p-4 h-[160px] 
                             before:absolute before:inset-0 before:bg-grid-white/[0.1]"

                          onClick={() => window.location.href = `/post/${post.slug}`}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="absolute inset-0 w-full h-full">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:14px_24px]" />
                          </div>
                          <div className="flex flex-col h-full relative z-10">
                            <h3 className="text-lg font-medium group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {post.title.length > 60 ? post.title.substring(0, 57) + '...' : post.title}
                            </h3>
                            <div className="text-sm text-muted-foreground mb-1">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                              {post.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-foreground">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}