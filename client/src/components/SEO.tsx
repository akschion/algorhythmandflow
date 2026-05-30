import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  image?: string;
  url?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  };
}

const SITE_URL = 'https://www.algorhythmandflow.com';
const AUTHOR_NAME = 'Akshay Chandrasekhar';
const AUTHOR_URL = 'https://arxiv.org/search/?searchtype=author&query=Akshay%20Chandrasekhar';
const SITE_NAME = 'Algorhythm + Flow';

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_NAME,
  "url": SITE_URL,
  "description": "Personal site of Akshay Chandrasekhar — computer vision researcher exploring mathematics, music, and technology.",
  "author": {
    "@type": "Person",
    "name": AUTHOR_NAME,
    "url": AUTHOR_URL,
    "sameAs": [
      AUTHOR_URL,
      "https://github.com/akshaychandra"
    ]
  }
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": AUTHOR_NAME,
  "url": SITE_URL,
  "sameAs": [
    AUTHOR_URL,
    "https://github.com/akshaychandra"
  ],
  "jobTitle": "Computer Vision Researcher",
  "knowsAbout": [
    "Computer Vision",
    "Mathematics",
    "Hip-Hop",
    "Machine Learning",
    "Geometry",
    "Music Theory"
  ],
  "description": "Akshay Chandrasekhar is a computer vision researcher exploring the intersection of mathematics, music, and technology."
};

export function SEO({
  title = `${SITE_NAME} | ${AUTHOR_NAME}`,
  description = `Personal site of ${AUTHOR_NAME} — computer vision researcher exploring the intersection of mathematics, music, and technology through academic research and creative writing.`,
  type = 'website',
  image = '/images/math-vinyl-icon.svg',
  url,
  article
}: SEOProps) {
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content={AUTHOR_NAME} />
      <meta name="keywords" content="Akshay Chandrasekhar, computer vision, mathematics, hip-hop, music theory, geometry, machine learning, research, blog" />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph tags */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${SITE_URL}${image}`} />
      <meta property="og:url" content={pageUrl} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}${image}`} />
      <meta name="twitter:creator" content="@akshaychandrasekhar" />

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={AUTHOR_NAME} />
          <meta property="article:published_time" content={article.publishedTime} />
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Website + Person structured data (on every page) */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>

      {/* Article structured data */}
      {type === 'article' && article && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "image": [`${SITE_URL}${image}`],
            "datePublished": article.publishedTime,
            "dateModified": article.modifiedTime || article.publishedTime,
            "author": {
              "@type": "Person",
              "name": AUTHOR_NAME,
              "url": AUTHOR_URL
            },
            "publisher": {
              "@type": "Person",
              "name": AUTHOR_NAME,
              "url": SITE_URL
            },
            "keywords": article.tags?.join(", "),
            "description": description,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": pageUrl
            }
          })}
        </script>
      )}
    </Helmet>
  );
}
