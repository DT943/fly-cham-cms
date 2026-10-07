/**
 * iPad / iOS Safari keyboard "Return" synthesizes a form submit when focus is
 * in a single-line input (HTML default). Block that so only the real Submit
 * button can submit. Matches the booking-form Enter guard pattern.
 */
export default function blockImplicitFormSubmitOnEnter(event) {
  if (event.key !== "Enter" || event.nativeEvent?.isComposing) return;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  // Real submit CTA may still use Enter / activation.
  if (target instanceof HTMLButtonElement && target.type === "submit") return;
  if (target instanceof HTMLInputElement && target.type === "submit") return;
  if (target instanceof HTMLTextAreaElement) return;

  event.preventDefault();
}
