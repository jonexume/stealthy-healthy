/**
 * Must be shown whenever synthetic/sample health content is displayed.
 * PRD requirement: clearly label fictional listings and sample health content.
 */
export default function SampleContentBanner({
  type = "content",
}: {
  type?: "content" | "listing" | "prototype";
}) {
  const messages = {
    content:
      "⚠ SAMPLE CONTENT — This is educational information created for prototype demonstration only. It has not been reviewed by a licensed clinician and is not medical advice.",
    listing:
      "⚠ FICTIONAL LISTING — This location, contact information, and details are entirely invented for prototype purposes. Do not attempt to contact or visit.",
    prototype:
      "⚠ PROTOTYPE — This app uses synthetic data only. No information entered here is stored, transmitted, or used for any real purpose.",
  };
  return (
    <div
      role="note"
      aria-label="Disclaimer"
      className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 font-medium leading-relaxed"
    >
      {messages[type]}
    </div>
  );
}
