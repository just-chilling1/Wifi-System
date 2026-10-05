import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
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
            <CardTitle className="text-4xl font-bold text-foreground">Privacy Policy</CardTitle>
            <p className="text-base text-muted-foreground">Last updated: January 2025</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, including your name, email address, and any content
                you create using our platform. We also automatically collect certain information about your device and
                how you interact with our services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, to process your
                transactions, to send you technical notices and support messages, and to communicate with you about
                products, services, and events.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Information Sharing</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We do not share your personal information with third parties except as described in this policy. We may
                share information with service providers who perform services on our behalf, and we may share
                information when required by law or to protect our rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Data Security</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, and
                unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security
                of our systems.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">5. Your Rights</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. You can do this
                through your account settings or by contacting us directly. You also have the right to opt out of
                marketing communications.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">6. Contact Us</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@p55account.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
