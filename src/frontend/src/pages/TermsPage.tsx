import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground">
            Last updated: January 26, 2026
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using AnantJap, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to use AnantJap for personal, non-commercial
            spiritual practice. This license shall automatically terminate if
            you violate any of these restrictions.
          </p>

          <h2>3. Local Data Storage</h2>
          <p>
            All data in AnantJap is stored locally on your device. We do not
            collect, store, or transmit your personal data to any servers. You
            are responsible for backing up your data.
          </p>

          <h2>4. Disclaimer</h2>
          <p>
            AnantJap is provided "as is" without any representations or
            warranties. We do not guarantee that the app will be error-free or
            uninterrupted.
          </p>

          <h2>5. Limitations</h2>
          <p>
            In no event shall AnantJap or its developers be liable for any
            damages arising out of the use or inability to use the application.
          </p>

          <h2>6. Modifications</h2>
          <p>
            We reserve the right to revise these terms at any time. By
            continuing to use AnantJap, you agree to be bound by the current
            version of these terms.
          </p>

          <h2>7. Spiritual Content</h2>
          <p>
            The mantras and spiritual content provided are for devotional
            purposes. We respect all religious traditions and encourage users to
            practice according to their beliefs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
