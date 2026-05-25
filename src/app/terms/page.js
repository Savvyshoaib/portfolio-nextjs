import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Terms and Conditions",
  description: "Our terms and conditions for using our services",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-background to-accent/5" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.9] mb-8 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Terms and Conditions
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
                    Welcome to our website. By using our website and services, you agree to comply with and be bound by the following terms and conditions of use.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Please read these terms and conditions carefully before using our website. If you do not agree with these terms and conditions, you should not use our website.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Intellectual Property Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Unless otherwise stated, we own the intellectual property rights for all material on this website. All intellectual property rights are reserved.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You may view this website and its content for your personal, non-commercial use only. You must not:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Republish material from this website without our permission.</li>
                    <li>• Sell, rent or sub-license material from this website.</li>
                    <li>• Reproduce, duplicate or copy material from this website.</li>
                    <li>• Redistribute content from this website without our permission.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Services</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We offer various services including web development, design, consulting, and digital marketing services. The specific details of each service will be outlined in separate agreements or proposals.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to accept responsibility for all activities that occur under your account or password. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Nothing in this disclaimer will limit or exclude any liability for death or personal injury resulting from negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be limited or excluded by applicable law.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Indemnification</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You hereby indemnify us and undertake to keep us indemnified against any losses, damages, costs, liabilities and expenses.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    This includes any breaches by you of any term of these terms and conditions, or any breach of any representation, warranty, or condition.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Termination</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may terminate your access to the website immediately, without prior notice or liability, for any reason whatsoever.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Upon termination, your right to use the website will immediately cease. All provisions of the terms and conditions which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Governing Law</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction in which we are based.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Any disputes arising from these terms and conditions shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may revise these terms and conditions from time to time. Revised terms and conditions will apply to the use of this website from the date of publication.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We advise you to review this page frequently to stay informed of any changes. Your continued use of this website constitutes acceptance of those changes.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    If you have any questions about these terms and conditions, please contact us through our contact page or email us directly.
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
