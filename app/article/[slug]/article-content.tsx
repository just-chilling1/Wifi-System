"use client"

import { useEffect, useRef } from "react"
import { Sparkles, TrendingUp, Award } from 'lucide-react'
import { safeHref } from "@/lib/affiliate-url"
import { sanitizeArticleHtml } from "@/lib/sanitize-html"

interface ArticleContentProps {
  page: {
    id: string
    title: string
    content: string
    affiliate_link: string
    views: number
    created_at: string
    niches?: { name: string }
    offers?: { title: string }
  }
}

function generateHeroTitle(niche: string): string {
  const titles: Record<string, string> = {
    "Weight Loss": "The Ultimate Weight Loss Breakthrough",
    "Make Money Online": "How to Build Real Online Income",
    "Health & Fitness": "Transform Your Health Starting Today",
    "Tech & Gadgets": "The Latest Tech That Changes Everything",
    "Beauty & Skincare": "The Beauty Secrets That Actually Work",
    "Relationships": "Build the Relationship You Deserve",
    "Pets": "Everything Your Pet Needs to Thrive",
    "Home & Garden": "Transform Your Home Into Paradise",
  }
  return titles[niche] || "Life-Changing Insights You Need"
}

export default function ArticleContent({ page }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const safeLink = safeHref(page.affiliate_link)
  const safeHtml = sanitizeArticleHtml(page.content)

  useEffect(() => {
    if (!contentRef.current) return

    const links = contentRef.current.querySelectorAll('a.affiliate-link, a[href*="' + page.affiliate_link + '"]')

    const handleClick = async () => {
      try {
        await fetch("/api/track-click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId: page.id }),
        })
      } catch (error) {
        console.error("Failed to track click:", error)
      }
    }

    links.forEach((link) => {
      link.addEventListener("click", handleClick)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener("click", handleClick)
      })
    }
  }, [page.id, page.affiliate_link])

  const heroTitle = page.niches?.name ? generateHeroTitle(page.niches.name) : "Life-Changing Insights You Need"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - New personalized hero */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-[var(--ds-sapphire-700)]/10 to-primary/10 animate-pulse" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sapphire-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--ds-sapphire-700)]/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          {/* Hero Title */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-sapphire-500 animate-pulse" />
              <span className="text-ink-4 font-semibold tracking-wider uppercase text-sm">
                {page.niches?.name}
              </span>
              <Sparkles className="w-6 h-6 text-sapphire-700 animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-ink">
              {heroTitle}
            </h1>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-ink-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sapphire-700" />
                <span>{page.views || 0}+ readers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-warning" />
                <span>Expert Reviewed</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Updated {new Date(page.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content - New clean, magazine-style layout */}
      <main className="container mx-auto px-4 pb-20 max-w-4xl">
        <article className="bg-card/80 backdrop-blur-xl rounded-3xl border border-[var(--border-strong)] shadow-2xl overflow-hidden">
          {/* Content */}
          <div className="p-8 md:p-16">
            <div 
              ref={contentRef} 
              className="article-content prose prose-lg max-w-none" 
              dangerouslySetInnerHTML={{ __html: safeHtml }} 
            />
          </div>

          {/* Footer CTA - More compelling and clean design */}
          <div className="border-t border-[var(--border-strong)] bg-gradient-to-br from-primary/10 to-primary-hover/10 p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-hover mb-6">
                <Sparkles className="w-8 h-8 text-ink" />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-ink mb-4">
                Ready to Take Action?
              </h3>
              
              <p className="text-xl text-ink-4 mb-8 leading-relaxed">
                Join thousands who have already transformed their lives. Your journey starts here.
              </p>
              
              {safeLink ? (
              <a
                href={safeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary via-primary to-primary-hover text-ink text-lg font-bold rounded-full hover:shadow-[0_0_40px_rgba(13,148,136,0.6)] hover:scale-105 transition-all duration-300 group"
              >
                Get Started Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              ) : null}
              
              <p className="text-sm text-ink-4 mt-6">
                100% Risk-Free • Instant Access • No Hidden Fees
              </p>
            </div>
          </div>
        </article>
      </main>

      <style jsx global>{`
        .article-content h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--ds-ink);
          line-height: 1.2;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--ds-ink) 0%, var(--link) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .article-content h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--ds-ink);
          line-height: 1.3;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid rgba(13,148,136, 0.45);
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--ds-ink-4);
          line-height: 1.4;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .article-content p {
          font-size: 1.125rem;
          line-height: 1.9;
          color: var(--ds-ink-4);
          margin-bottom: 1.5rem;
        }

        .article-content strong {
          font-weight: 600;
          color: var(--ds-ink);
        }

        .article-content a.inline-link {
          color: var(--link);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(13,148,136, 0.5);
          padding-bottom: 1px;
        }

        .article-content a.inline-link:hover {
          color: var(--brand-50);
          border-bottom-color: rgba(13,148,136, 0.6);
        }

        .article-content a.affiliate-link {
          color: var(--ds-ink-4);
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s ease;
          border-bottom: 2px solid rgba(90, 132, 148, 0.5);
          padding-bottom: 2px;
        }

        .article-content a.affiliate-link:hover {
          color: var(--link);
          border-bottom-color: rgba(13,148,136, 0.7);
          transform: translateY(-1px);
        }

        .article-content .mid-article-cta {
          margin: 3rem 0;
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(13,148,136, 0.15) 0%, rgba(15,118,110, 0.15) 100%);
          border: 2px solid rgba(13,148,136, 0.3);
          border-radius: 1rem;
          text-align: center;
        }

        .article-content .mid-article-cta h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1.75rem;
          background: linear-gradient(135deg, var(--link) 0%, var(--brand-50) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .article-content .mid-article-cta p {
          font-size: 1.125rem;
          margin-bottom: 0;
        }

        .article-content a {
          color: var(--link);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(13,148,136, 0.35);
          padding-bottom: 1px;
        }

        .article-content a:hover {
          color: var(--ds-ink-4);
          border-bottom-color: rgba(90, 132, 148, 0.5);
        }

        .article-content ul,
        .article-content ol {
          margin-left: 2rem;
          margin-bottom: 1.5rem;
          color: var(--ds-ink-4);
        }

        .article-content li {
          font-size: 1.125rem;
          line-height: 1.9;
          margin-bottom: 0.75rem;
        }

        .article-content li::marker {
          color: var(--link);
        }

        @media (max-width: 768px) {
          .article-content h1 {
            font-size: 2rem;
          }

          .article-content h2 {
            font-size: 1.5rem;
          }

          .article-content h3 {
            font-size: 1.25rem;
          }

          .article-content p,
          .article-content li {
            font-size: 1rem;
          }

          .article-content .mid-article-cta {
            padding: 1.5rem;
          }

          .article-content .mid-article-cta h3 {
            font-size: 1.5rem;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  )
}
