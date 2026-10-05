import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { PRODUCT_NAME } from "@/lib/brand"

export default function TermsOfServicePage() {
  return (
    <div className="app-bg min-h-dvh p-6 lg:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="h-12 glass bg-transparent">
            <Link href="/settings">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Settings
            </Link>
          </Button>
        </div>

        <Card className="glass-strong border-border">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-foreground">Terms of Service</CardTitle>
            <p className="text-base text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By accessing and using {PRODUCT_NAME}, you accept and agree to be bound by these Terms of Service. If you
                do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Use of Service</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You agree to use {PRODUCT_NAME} only for lawful purposes and in accordance with these Terms. You are
                responsible for all content you create and share using our platform. You must not use our service to
                create misleading, fraudulent, or illegal content.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Account Responsibilities</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all
                activities that occur under your account. You must notify us immediately of any unauthorized use of your
                account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Intellectual Property</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The content you create using {PRODUCT_NAME} belongs to you. However, you grant us a license to use,
                display, and distribute your content as necessary to provide our services. Our platform, including all
                software and design elements, remains our property.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Refund Policy</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We offer a 30-day money-back guarantee on all upgrade purchases. To request a refund, contact our
                support team within 30 days of your purchase. Refunds are processed within 5-7 business days.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {PRODUCT_NAME} is provided as-is without warranties of any kind. We are not liable for any damages arising
                from your use of our service, including but not limited to lost profits, data loss, or business
                interruption.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">7. Changes to Terms</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the
                new Terms on this page. Your continued use of {PRODUCT_NAME} after changes constitutes acceptance of the
                new Terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
