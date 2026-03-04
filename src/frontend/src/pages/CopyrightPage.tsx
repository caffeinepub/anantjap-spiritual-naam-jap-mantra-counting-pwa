import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CopyrightPage() {
  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Copyright</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-muted-foreground">
            © 2025 AnantJap. All rights reserved.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            AnantJap and its original content, features, and functionality are
            owned by the AnantJap development team and are protected by
            international copyright, trademark, and other intellectual property
            laws.
          </p>

          <h2>Spiritual Content</h2>
          <p>
            The mantras, bhajans, and spiritual content provided in AnantJap are
            traditional sacred texts that belong to the public domain and
            various spiritual traditions. We honor and respect these ancient
            teachings.
          </p>

          <h2>User-Generated Content</h2>
          <p>
            Any custom gods, mantras, or bhajans you create within the app
            remain your property. Since all data is stored locally on your
            device, you maintain full ownership and control.
          </p>

          <h2>Images and Assets</h2>
          <p>
            The deity images and visual assets used in AnantJap are either
            created specifically for this application or sourced from public
            domain resources. We respect the sacred nature of these
            representations.
          </p>

          <h2>Open Source</h2>
          <p>
            AnantJap is built using open-source technologies and libraries. We
            are grateful to the open-source community for their contributions.
          </p>

          <h2>Fair Use</h2>
          <p>
            You may use screenshots and descriptions of AnantJap for personal,
            educational, or review purposes, provided you give appropriate
            credit.
          </p>

          <h2>Restrictions</h2>
          <p>You may not:</p>
          <ul>
            <li>
              Reproduce, distribute, or create derivative works without
              permission
            </li>
            <li>Use AnantJap branding or assets for commercial purposes</li>
            <li>Reverse engineer or attempt to extract the source code</li>
            <li>Remove or alter any copyright notices</li>
          </ul>

          <h2>Attribution</h2>
          <p>
            Built with love using caffeine.ai. We acknowledge the Internet
            Computer ecosystem and the technologies that make this application
            possible.
          </p>

          <h2>Contact</h2>
          <p>
            For copyright inquiries or permissions, please contact us through
            the Feedback form.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
