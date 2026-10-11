'use client'
/**
 * flychamwebsite's `ManageFooter`, minus Redux: the loading flag comes in as a
 * prop (it is set while the browser leaves for flycham.com) instead of
 * `s.manageBookV2.isLoading`, and the manage-booking API debugger attribute is
 * dropped since this app never calls that API.
 */
import ButtonSpinner from '@/components/Ui/ButtonSpinner'
import useIsMobile from '@/hooks/useIsMobile'
import { Info } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent'

const ManageFooter = ({ canSearch, isLoading = false }) => {
    const copy = useBookingBoxContentOptional()
    const manageCopy = copy.manage
    const { lang } = useParams() ?? {}
    const isRtl = lang === 'ar'
    const [isMobile, setIsMobile] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const isMb = useIsMobile()
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    // close tooltip when clicking outside on mobile
    useEffect(() => {
        if (!isMobile) return;
        const handleClickOutside = (e) => {
            if (!(e.target).closest(".tooltip-wrapper")) {
                setShowTooltip(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMobile]);

    const isDs = !canSearch || isLoading

    return (
        <div
            dir={isRtl ? 'rtl' : 'ltr'}
            className="mt-6 flex flex-col-reverse md:flex-row gap-3 md:gap-0 items-center justify-between"
        >
            {/* Help link — sits at inline-start in LTR / inline-end in RTL via justify-between */}
            <div className="mt-3 relative group w-full md:w-auto tooltip-wrapper">
                <button
                    type="button"
                    onClick={() => isMobile && setShowTooltip((prev) => !prev)}
                    className="flex items-center !self-start gap-2 text-[15px] md:text-base text-primary-1 font-medium text-start"
                >
                    <Info size={isMb ? 16 : 24} className='font-medium shrink-0' />
                    {manageCopy.cantFindPnr}
                </button>

                <div
                    className={`absolute top-[100%] mt-2 mb-2 start-0 w-64 rounded-md bg-gray-600 text-white text-xs px-3 py-2 shadow-lg transition-all duration-200 text-start
                     ${isMobile ? (showTooltip ? "opacity-100" : "opacity-0 pointer-events-none")
                            : "opacity-0 group-hover:opacity-100 group-hover:translate-y-[-2px] pointer-events-none"}`}
                >
                    {manageCopy.pnrTooltip}
                </div>
            </div>

            <button
                type="submit"
                disabled={isDs}
                className={`px-8 py-4 w-full text-nowrap md:w-[200px] rounded-md text-sm md:text-base font-medium transition bg-primary-2 text-btn
        ${(isDs) ? " !cursor-not-allowed" : ""}
    `}
            >
                {isLoading ?
                    <span className="flex items-center justify-center gap-2">
                        <ButtonSpinner size={18} />
                        {manageCopy.searching}
                    </span>
                    : manageCopy.search}
            </button>
        </div>
    )
}

export default ManageFooter
