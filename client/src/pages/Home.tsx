import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogSidebar } from "@/components/BlogSidebar";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
        <div className="md:col-span-3 space-y-8">
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
            <div className="relative p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Mathematics × Technology × Hip-Hop
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Exploring the fascinating intersections of mathematical concepts, technological innovations, and hip-hop culture through academic research and analysis.
              </p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-muted/50 to-background border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                Research Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p className="text-lg leading-relaxed">
                My research combines signal processing techniques with musical analysis,
                examining the mathematical structures present in hip-hop music.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Fourier Analysis</h3>
                    <p className="text-sm text-muted-foreground">Analyzing beat patterns and rhythmic structures</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">AI Composition</h3>
                    <p className="text-sm text-muted-foreground">Developing algorithmic composition systems</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">ML Applications</h3>
                    <p className="text-sm text-muted-foreground">Applying machine learning to music production</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}