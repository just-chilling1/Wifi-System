import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { PRODUCT_NAME } from "@/lib/brand"

export default function DisclaimerPage() {
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
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold text-foreground">Earnings Disclaimer</CardTitle>
                <p className="text-base text-muted-foreground">Important information about income claims</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div className="glass rounded-xl p-6 border border-amber-500/30">
              <p className="text-lg font-bold text-amber-500 leading-relaxed">
                EVERY EFFORT HAS BEEN MADE TO ACCURATELY REPRESENT THIS PRODUCT AND ITS POTENTIAL. THERE IS NO GUARANTEE
                THAT YOU WILL EARN ANY MONEY USING THE TECHNIQUES AND IDEAS IN THESE MATERIALS.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">No Guaranteed Results</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The testimonials and examples used are exceptional results and do not apply to the average user. They
                are not intended to represent or guarantee that anyone will achieve the same or similar results. Each
                individual's success depends on their background, dedication, desire, and motivation.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Results May Vary</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                As with any business endeavor, there is an inherent risk of loss of capital and there is no guarantee
                that you will earn any money. The use of our information, products, and services should be based on your
                own due diligence and you agree that we are not liable for any success or failure of your business that
                is directly or indirectly related to the purchase and use of our information, products, and services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">FTC Compliance</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                This website and the products and services offered on this website are not associated, affiliated,
                endorsed, or sponsored by any affiliate networks mentioned, nor have they been reviewed, tested, or
                certified by these companies. All trademarks, logos, and service marks displayed are registered and/or
                unregistered trademarks of their respective owners.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Affiliate Disclosure</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {PRODUCT_NAME} is designed to help you find trending Shorts and generate comment packs. You are responsible
                for complying with platform rules and applicable laws. Do not post spam, misleading claims, or links.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Typical Results</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The typical user of {PRODUCT_NAME} may not achieve any specific results. Success depends on consistency,
                comment quality, timing, and many factors outside our control. Any examples are illustrative and not a
                promise of outcomes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Responsibility</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                You are solely responsible for your results. We provide tools and training, but your success depends on
                your own efforts, market conditions, and many other factors beyond our control. Always conduct your own
                research and consult with qualified professionals before making business decisions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
