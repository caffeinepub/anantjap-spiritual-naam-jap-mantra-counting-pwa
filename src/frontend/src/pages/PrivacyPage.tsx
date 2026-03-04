import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground">
            Last updated: January 26, 2026
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            AnantJap does not collect any personal information. All data is
            stored locally on your device using browser local storage.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Since we don't collect any data, we don't use, share, or sell your
            information. Your spiritual practice data remains completely private
            on your device.
          </p>

          <h2>3. Data Storage</h2>
          <p>
            All your jap counts, custom gods, bhajans, and devotee information
            are stored locally in your browser's local storage. This data is not
            transmitted to any servers.
          </p>

          <h2>4. Data Security</h2>
          <p>
            Your data security depends on your device security. We recommend:
          </p>
          <ul>
            <li>Keeping your device secure with a password/PIN</li>
            <li>Regularly backing up your data using the export feature</li>
            <li>
              Not sharing your device with others if you want to keep your
              practice private
            </li>
          </ul>

          <h2>5. Data Deletion</h2>
          <p>
            You can delete all your data at any time using the "Delete All Data"
            option in Settings. You can also clear your browser's local storage
            to remove all AnantJap data.
          </p>

          <h2>6. Third-Party Services</h2>
          <p>
            AnantJap does not use any third-party analytics, tracking, or
            advertising services. Your practice remains completely private.
          </p>

          <h2>7. Children's Privacy</h2>
          <p>
            AnantJap is suitable for all ages. Since we don't collect any data,
            there are no special considerations for children's privacy.
          </p>

          <h2>8. Changes to Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on this page with an updated revision date.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions about this privacy policy, please use the
            Feedback form to contact us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
