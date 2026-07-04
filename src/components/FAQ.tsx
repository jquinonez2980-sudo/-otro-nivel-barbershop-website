import { faqs } from "@/data/site";

/** Native <details> accordion — keyboard and screen-reader accessible with zero JS. */
export default function FAQ() {
  return (
    <div className="divide-y divide-edge rounded-lg border border-edge bg-surface">
      {faqs.map((faq) => (
        <details key={faq.q} className="group px-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-cream [&::-webkit-details-marker]:hidden">
            {faq.q}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-gold transition-transform group-open:rotate-45"
            >
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <p className="pb-5 text-muted">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
