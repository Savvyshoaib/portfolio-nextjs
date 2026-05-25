import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and how we handle your data",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-8 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal delay={0.1}>
            <div className="prose prose-lg max-w-none">
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    This privacy policy applies to this website and should be read together with our terms and conditions.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Data We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may collect, use, store and transfer different kinds of personal data about you, which we have grouped together as follows:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Identity Data includes first name, last name, username or similar identifier.</li>
                    <li>• Contact Data includes email address and phone numbers.</li>
                    <li>• Technical Data includes internet protocol (IP) address, your login data.</li>
                    <li>• Profile Data includes your username and password, purchases or orders made by you.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">How We Use Your Data</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• To provide you with our services and maintain our website.</li>
                    <li>• To communicate with you about our services.</li>
                    <li>• To analyze how you use our website and improve our services.</li>
                    <li>• To comply with legal obligations.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Your Legal Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Under certain circumstances, you have rights under data protection laws in relation to your personal data including:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Request access to your personal data.</li>
                    <li>• Request correction of your personal data.</li>
                    <li>• Request erasure of your personal data.</li>
                    <li>• Object to processing of your personal data.</li>
                    <li>• Request restriction of processing your personal data.</li>
                    <li>• Request transfer of your personal data.</li>
                    <li>• Right to withdraw consent.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions about this privacy policy, please contact us through our contact page or email us directly.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We will respond to your request within 30 days of receiving your request.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
