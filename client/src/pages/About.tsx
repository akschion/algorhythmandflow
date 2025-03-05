import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { getAssetUrl } from "@/lib/utils";
import { SEO } from "@/components/SEO";

export default function About() {
  return (
    <>
      <SEO
        title="About - Algorhythm and Flow"
        description="Learn about Akshay Chandrasekhar, a computer vision researcher exploring the intersections of mathematics, music, and technology."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <Card className="bg-gradient-to-br from-background via-background/95 to-muted border-none shadow-lg overflow-hidden">
              <CardHeader className="relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
                <div className="relative space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-10 rounded-full" />
                    <img
                      src={getAssetUrl("/images/profpic.jpg")}
                      alt="Author"
                      className="rounded-full w-full h-full object-cover relative z-10"
                    />
                  </div>
                  <CardTitle className="text-3xl text-center bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                    About Me
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  Hello! My name is Akshay Chandrasekhar, and I'm a computer vision researcher. My curiosity extends broadly though to a wide variety of topics including math, music, history, geography, economics, and linguistics. I'm particularly interested in hip-hop and geometry which have shaped my focus on the tech, business, and cultural aspects of media. You can explore my research and ideas via the blog posts here or the links below!
                </p>
                <div className="flex justify-center space-x-4">
                  <a href="https://github.com/akschion" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon className="text-2xl" icon={faGithub} />
                  </a>
                  <a href="mailto:algorhythmflow@gmail.com">
                    <FontAwesomeIcon className="text-2xl" icon={faEnvelope} />
                  </a>
                  <a href="https://arxiv.org/search/?searchtype=author&query=Akshay%20Chandrasekhar">
                    <FontAwesomeIcon className="text-2xl" icon={faBookOpen} />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}