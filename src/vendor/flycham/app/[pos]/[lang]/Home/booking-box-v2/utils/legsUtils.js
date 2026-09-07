/**
 * Shared utilities for the legs array in booking form state.
 * Form state uses legs[0], legs[1], legs[2] instead of source/source2/source3, etc.
 */

export const MAX_LEGS = 2;

const emptyLeg = () => ({ source: '', destination: '', dateStart: '' });

/** Default legs array for initial form values */
export const getDefaultLegs = () =>
  Array.from({ length: MAX_LEGS }, () => emptyLeg());

/**
 * Get leg at index (0-based). Returns empty leg object if missing.
 * @param {Object} values - Form values (with values.legs)
 * @param {number} legIndex - 0-based leg index
 */
export function getLeg(values, legIndex) {
  const legs = values?.legs;
  if (!Array.isArray(legs) || legIndex < 0 || legIndex >= legs.length) {
    return emptyLeg();
  }
  const leg = legs[legIndex];
  return {
    source: leg?.source ?? '',
    destination: leg?.destination ?? '',
    dateStart: leg?.dateStart ?? '',
  };
}

/**
 * Get a single field from a leg
 */
export function getLegField(values, legIndex, field) {
  return getLeg(values, legIndex)[field] ?? '';
}

/**
 * Update one field of one leg. Uses Formik's setFieldValue with path legs.${legIndex}.${field}.
 * @param {Object} formik - Formik bag (setFieldValue, setValues)
 * @param {number} legIndex - 0-based leg index
 * @param {string} field - 'source' | 'destination' | 'dateStart'
 * @param {*} value
 */
export function setLegField(formik, legIndex, field, value) {
  if (!formik?.setFieldValue) return;
  formik.setFieldValue(`legs.${legIndex}.${field}`, value);
}

/**
 * Set all fields of one leg at once
 */
export function setLeg(formik, legIndex, row) {
  if (!formik?.setFieldValue) return;
  const path = `legs.${legIndex}`;
  formik.setFieldValue(`${path}.source`, row?.source ?? '');
  formik.setFieldValue(`${path}.destination`, row?.destination ?? '');
  formik.setFieldValue(`${path}.dateStart`, row?.dateStart ?? '');
}

/**
 * Clear legs from legIndex onward (e.g. when switching from multi-city to one-way)
 */
export function clearLegsFrom(formik, fromLegIndex) {
  if (!formik?.setFieldValue) return;
  for (let i = fromLegIndex; i < MAX_LEGS; i++) {
    setLeg(formik, i, emptyLeg());
  }
}

/**
 * Normalize persisted formik data: if it has legacy flat keys (source, source2, ...),
 * return object with legs array. Otherwise return data as-is.
 */
export function normalizeFormikDataFromLegacy(data) {
  if (!data) return data;
  if (Array.isArray(data.legs) && data.legs.length >= MAX_LEGS) {
    return data;
  }
  const legs = getDefaultLegs();
  legs[0] = {
    source: data.source ?? '',
    destination: data.destination ?? '',
    dateStart: data.dateStart ?? '',
  };
  legs[1] = {
    source: data.source2 ?? '',
    destination: data.destination2 ?? '',
    dateStart: data.dateStart2 ?? '',
  };
  legs[2] = {
    source: data.source3 ?? '',
    destination: data.destination3 ?? '',
    dateStart: data.dateStart3 ?? '',
  };
  const { source, source2, source3, destination, destination2, destination3, dateStart, dateStart2, dateStart3, ...rest } = data;
  return { ...rest, legs };
}

/**
 * First-leg values for one-way/return (convenience for components that only care about leg 0)
 */
export function getFirstLeg(values) {
  return getLeg(values, 0);
}
