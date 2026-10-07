/**
 * Sequential keyboard navigation for booking forms (iOS Return → Next).
 * Fields must live inside `[data-booking-field-flow]` and carry `data-booking-form-field`.
 */

export const BOOKING_FIELD_FLOW_ATTR = 'data-booking-field-flow';
export const BOOKING_FORM_FIELD_ATTR = 'data-booking-form-field';

const FIELD_SELECTOR = [
    `input[${BOOKING_FORM_FIELD_ATTR}]:not([disabled]):not([type="hidden"])`,
    `select[${BOOKING_FORM_FIELD_ATTR}]:not([disabled])`,
    `button[${BOOKING_FORM_FIELD_ATTR}]:not([disabled])`,
    `textarea[${BOOKING_FORM_FIELD_ATTR}]:not([disabled])`,
].join(', ');

function isFieldVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    if (element.getAttribute('aria-hidden') === 'true') return false;
    return element.getClientRects().length > 0;
}

export function getBookingFormFields(flowRoot) {
    if (!(flowRoot instanceof HTMLElement)) return [];
    return Array.from(flowRoot.querySelectorAll(FIELD_SELECTOR)).filter(isFieldVisible);
}

export function focusNextBookingFormField(current) {
    const flow = current?.closest?.(`[${BOOKING_FIELD_FLOW_ATTR}]`);
    if (!flow) return false;

    const fields = getBookingFormFields(flow);
    const index = fields.indexOf(current);
    if (index < 0 || index >= fields.length - 1) return false;

    const next = fields[index + 1];
    next.focus({ preventScroll: false });
    return true;
}

export function handleBookingFormEnterKey(event) {
    if (event.key !== 'Enter' || event.nativeEvent?.isComposing) return;

    const current = event.currentTarget;
    if (!(current instanceof HTMLElement)) return;

    const flow = current.closest(`[${BOOKING_FIELD_FLOW_ATTR}]`);
    if (!flow) return;

    // iOS Safari may treat Return/Done as an implicit form submit — always block it.
    event.preventDefault();
    event.stopPropagation();

    const fields = getBookingFormFields(flow);
    const index = fields.indexOf(current);
    if (index < 0) return;

    if (index < fields.length - 1) {
        focusNextBookingFormField(current);
        return;
    }

    current.blur();
}

export function resolveEnterKeyHint({ enterKeyHint, isLastField } = {}) {
    if (enterKeyHint) return enterKeyHint;
    return isLastField ? 'done' : 'next';
}
