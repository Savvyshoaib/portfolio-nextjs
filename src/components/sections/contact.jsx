import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/reveal";
import { CONTACT_DEFAULT_CONTENT, resolveContactIcon } from "@/lib/cms/contact-section";
import { renderTitle } from "@/lib/render-title";

export function ContactSection({ compact = false, content = CONTACT_DEFAULT_CONTENT }) {
  const resolved = { ...CONTACT_DEFAULT_CONTENT, ...(content || {}) };
  const contactItems = Array.isArray(resolved.items) ? resolved.items : CONTACT_DEFAULT_CONTENT.items;

  return (
    <section className={compact ? "py-16 sm:py-20" : "py-24 sm:py-32"} data-gsap-section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">{resolved.eyebrow}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.08] text-balance">
              {renderTitle(resolved.title, resolved.titleEmphasis, "span")}
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md text-pretty">{resolved.description}</p>

            {contactItems.length ? (
              <ul className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
                {contactItems.map((item, index) => {
                  const Icon = resolveContactIcon(item.icon);
                  const valueNode = item.href ? (
                    <a href={item.href} className="font-medium hover:text-accent transition-colors break-all">
                      {item.value}
                    </a>
                  ) : (
                    <div className="font-medium break-words">{item.value}</div>
                  );

                  return (
                    <li key={`${item.label}-${index}`} className="flex items-start sm:items-center gap-3 sm:gap-4">
                      <span className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 inline-flex items-center justify-center rounded-xl bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">{item.label}</div>
                        {valueNode}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
