'use client';
/**
 * Port of flychamwebsite's `ManageTap`: same PNR + last-name form, validation,
 * input clean-up and footer.
 *
 * The real tab retrieves the PNR through the B2C manage-booking stack and then
 * routes inside flycham.com. That API sits behind flycham.com's same-origin
 * `feapi` proxy (no CORS), and the session it returns is kept in flycham.com's
 * sessionStorage, so neither can be used from this app. Instead the submit hands
 * the traveller to flycham.com's manage-booking deep link,
 * `/{pos}/{lang}/manage-booking/{PNR}/{LASTNAME}`, which runs the lookup itself.
 * That page only looks a booking up when both values are present, so the last
 * name is required here (it is optional on flycham.com's own tab).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Ticket, User } from '@phosphor-icons/react';
import { useParams } from 'next/navigation';
import FloatingInput from './manage/FloatingInput';
import ManageFooter from './manage/ManageFooter';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { FLYCHAM_SITE_URL, useFlyChamLocalePrefix } from '@/lib/flychamSite';

/** flycham.com manage-booking deep link for a PNR + surname. */
function buildManageBookingUrl(localePrefix, pnr, lastName) {
  return `${FLYCHAM_SITE_URL}${localePrefix}/manage-booking/${encodeURIComponent(pnr)}/${encodeURIComponent(lastName)}`;
}

const ManageTap = () => {
  const copy = useBookingBoxContentOptional();
  const manageCopy = copy.manage;
  const { lang } = useParams();
  const isRtl = lang === 'ar';
  const localePrefix = useFlyChamLocalePrefix();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Back button from flycham.com restores this page from the bfcache with the
  // button still in its "Searching" state — reset it.
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) setIsRedirecting(false);
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        pnr: Yup.string()
          .trim()
          .min(6, manageCopy.errors.pnrMin)
          .required(manageCopy.errors.pnrRequired),
        lastName: Yup.string()
          .trim()
          .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, {
            message: manageCopy.errors.lastNameEnglish,
            excludeEmptyString: true,
          })
          .required(manageCopy.errors.lastNameRequired),
      }),
    [manageCopy],
  );

  const formik = useFormik({
    initialValues: { pnr: '', lastName: '' },
    validationSchema,
    onSubmit: ({ pnr, lastName }) => {
      setIsRedirecting(true);
      window.location.assign(
        buildManageBookingUrl(localePrefix, pnr.trim(), lastName.trim().toUpperCase()),
      );
    },
  });

  const handlePNRChange = (e) => {
    formik.setFieldValue('pnr', e.target.value.toUpperCase().slice(0, 6));
  };

  const handleLastNameChange = (e) => {
    const englishOnly = e.target.value
      .replace(/[^A-Za-z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trimStart()
      .toUpperCase();
    formik.setFieldValue('lastName', englishOnly);
  };

  const canSearch = !!formik.values.pnr;

  return (
    <div className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={formik.handleSubmit} className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <FloatingInput
            name="pnr"
            label={manageCopy.pnrLabel}
            hint={manageCopy.pnrHint}
            icon={<Ticket size={18} weight="fill" />}
            value={formik.values.pnr}
            onChange={handlePNRChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.pnr}
            error={formik.errors.pnr}
            isRtl={isRtl}
          />
          <FloatingInput
            name="lastName"
            label={manageCopy.lastNameLabel}
            icon={<User size={18} weight="fill" />}
            value={formik.values.lastName}
            onChange={handleLastNameChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.lastName}
            error={formik.errors.lastName}
            isRtl={isRtl}
          />
        </div>
        <ManageFooter canSearch={canSearch} isLoading={isRedirecting} />
      </form>
    </div>
  );
};

export default ManageTap;
