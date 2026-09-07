'use client'
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '@/store/flightSlice';
import { TAB_NAVIGATION, TAB_STYLES, TABS } from '@/app/[pos]/[lang]/Home/booking-box-v2/constants/bookingBoxConstants';
import useIsMobile from '@/hooks/useIsMobile';
import { useBookingBoxContentOptional } from '@/app/[pos]/[lang]/Home/booking-box/content/BookingBoxContent';
import { trackBookingTabClarityEvent } from '@/lib/clarity';

const TAB_LABEL_KEYS = {
  book: 'book',
  manage: 'manage',
  'flight status': 'flightStatus',
};

/**
 * TabNavigation Component
 * 
 * A reusable tab navigation component with keyboard navigation and accessibility features.
 * Gets tabs, activeTab, and isMobile from Redux store and hooks internally.
 * 
 * @param {Object} props - Component props
 * @param {Function} [props.onTabChange] - Optional callback when tab changes
 * @param {string} [props.className] - Optional additional CSS classes
 */
const TabNavigation = ({
  onTabChange,
  className = '',
}) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.flights.activeTab);
  const isMobile = useIsMobile();
  const copy = useBookingBoxContentOptional();
  const tabs = TABS;

  // Check if a tab is disabled
  const isTabDisabled = useCallback((tab) => {
    return TAB_NAVIGATION.DISABLED_TABS.includes(tab);
  }, []);

  // Handle tab click with validation
  const handleTabClick = useCallback((tab) => {
    if (isTabDisabled(tab)) {
      return;
    }

    if (tab !== activeTab) {
      trackBookingTabClarityEvent(tab);
    }

    dispatch(setActiveTab(tab));
    onTabChange?.(tab);
  }, [activeTab, dispatch, isTabDisabled, onTabChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event, tab, index) => {
    if (isTabDisabled(tab)) {
      return;
    }

    let targetIndex = index;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        // Find previous enabled tab
        for (let i = index - 1; i >= 0; i--) {
          if (!isTabDisabled(tabs[i])) {
            targetIndex = i;
            break;
          }
        }
        if (targetIndex !== index) {
          handleTabClick(tabs[targetIndex]);
          // Focus the new tab
          const buttons = event.currentTarget.parentElement?.querySelectorAll('button[role="tab"]');
          buttons?.[targetIndex]?.focus();
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        // Find next enabled tab
        for (let i = index + 1; i < tabs.length; i++) {
          if (!isTabDisabled(tabs[i])) {
            targetIndex = i;
            break;
          }
        }
        if (targetIndex !== index) {
          handleTabClick(tabs[targetIndex]);
          // Focus the new tab
          const buttons = event.currentTarget.parentElement?.querySelectorAll('button[role="tab"]');
          buttons?.[targetIndex]?.focus();
        }
        break;

      case 'Home':
        event.preventDefault();
        // Focus first enabled tab
        const firstEnabledIndex = tabs.findIndex(tab => !isTabDisabled(tab));
        if (firstEnabledIndex !== -1 && firstEnabledIndex !== index) {
          handleTabClick(tabs[firstEnabledIndex]);
          const buttons = event.currentTarget.parentElement?.querySelectorAll('button[role="tab"]');
          buttons?.[firstEnabledIndex]?.focus();
        }
        break;

      case 'End':
        event.preventDefault();
        // Focus last enabled tab
        let lastEnabledIndex = -1;
        for (let i = tabs.length - 1; i >= 0; i--) {
          if (!isTabDisabled(tabs[i])) {
            lastEnabledIndex = i;
            break;
          }
        }
        if (lastEnabledIndex !== -1 && lastEnabledIndex !== index) {
          handleTabClick(tabs[lastEnabledIndex]);
          const buttons = event.currentTarget.parentElement?.querySelectorAll('button[role="tab"]');
          buttons?.[lastEnabledIndex]?.focus();
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        handleTabClick(tab);
        break;

      default:
        break;
    }
  }, [tabs, isTabDisabled, handleTabClick]);

  // Format tab label (capitalize first letter)
  const formatTabLabel = useCallback((tab) => {
    const key = TAB_LABEL_KEYS[tab];
    return key ? copy.tabs[key] : tab;
  }, [copy.tabs]);

  // Memoize container classes — tabs stay left-aligned together at every breakpoint
  const containerClasses = useMemo(() => {
    return [
      'flex my-2 items-center justify-start gap-6 border-b border-[#E5E5E3] mb-6',
      className,
    ]
      .filter(Boolean)
      .join(' ');
  }, [className]);

  // Memoize button classes generator
  const getButtonClasses = useCallback((isActive, isDisabled) => {
    const baseClasses = 'cursor-pointer px-4 text-sm font-semibold border-b-2 transition-colors duration-400 normal-case';
    const paddingClasses = isMobile ? 'py-4' : 'py-2';

    if (isDisabled) {
      return `${baseClasses} ${paddingClasses} text-[#9CA3AF] border-transparent cursor-not-allowed`.trim();
    }

    if (isActive) {
      return `${baseClasses} ${paddingClasses} ${TAB_STYLES.ACTIVE_COLOR}`.trim();
    }

    return `${baseClasses} ${paddingClasses} text-[#5F5F5C] border-transparent ${TAB_STYLES.HOVER_COLOR}`.trim();
  }, [isMobile]);

  return (
    <nav
      role="tablist"
      aria-label={copy.tabs.ariaLabel}
      className={containerClasses}
    >
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        const isDisabled = isTabDisabled(tab);
        const tabId = `tab-${tab.replace(/\s+/g, '-')}`;
        const panelId = `tabpanel-${tab.replace(/\s+/g, '-')}`;

        return (
          <button
            key={tab}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            aria-disabled={isDisabled}
            tabIndex={isActive ? 0 : -1}
            disabled={isDisabled}
            onClick={() => handleTabClick(tab)}
            onKeyDown={(e) => handleKeyDown(e, tab, index)}
            className={getButtonClasses(isActive, isDisabled)}
          >
            {formatTabLabel(tab)}
          </button>
        );
      })}
    </nav>
  );
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(TabNavigation);
