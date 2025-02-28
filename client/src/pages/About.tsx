import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function About() {
  return (
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
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
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
                A passionate researcher exploring the intersections of mathematics, technology, and hip-hop culture.
                My work focuses on applying mathematical concepts and technological innovations to understand and
                enhance musical expression in hip-hop.
              </p>
              <h3 className="text-xl font-semibold mt-8 mb-4 text-foreground">Research Interests</h3>
              <ul className="space-y-4 list-none pl-0">
                <li className="flex items-start gap-4">
                  <div className="w-1 h-1 mt-3 rounded-full bg-primary" />
                  <p className="text-foreground">
                    <strong className="text-foreground">Signal Processing in Music:</strong> Analyzing beat patterns
                    and rhythmic structures using advanced mathematical techniques.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1 h-1 mt-3 rounded-full bg-primary" />
                  <p className="text-foreground">
                    <strong className="text-foreground">AI in Composition:</strong> Developing neural networks
                    for algorithmic music composition and style transfer.
                  </p>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-1 h-1 mt-3 rounded-full bg-primary" />
                  <p className="text-foreground">
                    <strong className="text-foreground">Machine Learning Applications:</strong> Building tools
                    for music production and analysis using cutting-edge ML techniques.
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}