import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogSidebar } from "@/components/BlogSidebar";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="prose dark:prose-invert max-w-none">
            <h1 className="font-serif">Welcome to My Academic Blog</h1>
            <p className="lead">
              Exploring the fascinating intersections of mathematics, technology, and hip-hop culture.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Research Focus</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert">
              <p>
                My research combines signal processing techniques with musical analysis,
                particularly focusing on the mathematical structures present in hip-hop music.
              </p>
              <p>
                Recent work includes:
              </p>
              <ul>
                <li>Fourier analysis of beat patterns</li>
                <li>Algorithmic composition systems</li>
                <li>Machine learning applications in music production</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>

        <div className="md:col-span-1">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
