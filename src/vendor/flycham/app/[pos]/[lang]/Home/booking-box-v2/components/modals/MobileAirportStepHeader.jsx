'use client';

import React from 'react';
import { AirplaneLanding, AirplaneTakeoff, AirplaneTilt } from '@phosphor-icons/react';

function StepNode({
  icon: Icon,
  title,
  value,
  active,
  flip = false,
}) {
  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2.5 ${active ? '' : 'opacity-70'}`}>
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
          active
            ? 'bg-primary-1 text-white'
            : 'bg-[#E8E8E6] text-[#9E9E9B]'
        }`}
        aria-hidden
      >
        <Icon size={20} weight="fill" className={flip ? 'scale-x-[-1]' : undefined} />
      </div>
      <div className="min-w-0 flex flex-col items-start text-start">
        <span
          className={`truncate text-xs leading-tight ${
            active ? 'text-primary-1/80' : 'text-[#9E9E9B]'
          }`}
        >
          {title}
        </span>
        <span
          className={`truncate text-sm font-semibold leading-tight ${
            active ? 'text-primary-1' : 'text-[#5F5F5C]'
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function PlaneConnector({ flip = false }) {
  return (
    <div className="mx-1 flex w-12 shrink-0 items-center sm:w-16" aria-hidden>
      <AirplaneTilt
        size={14}
        weight="fill"
        className={`mx-1 shrink-0 text-[#9E9E9B] ${flip ? 'scale-x-[-1] -rotate-45' : 'rotate-45'}`}
      />
      <span className="h-px w-8 border-t border-dashed border-[#C8C8C4]" />
    </div>
  );
}

/**
 * Mobile airport progress: always Flying from + Flying to.
 * Active side follows the current picker step.
 */
export default function MobileAirportStepHeader({
  activeStep,
  flyingFromTitle,
  flyingFromValue,
  flyingToTitle,
  flyingToValue,
  stepIds,
  isRtl = false,
}) {
  const isFrom = activeStep === stepIds.FLYING_FROM;
  const isTo = activeStep === stepIds.FLYING_TO;

  if (!isFrom && !isTo) return null;

  return (
    <div
      className="mb-4 flex w-full items-center gap-1 rounded-2xl bg-white px-1 py-2"
      role="navigation"
      aria-label={`${flyingFromTitle} / ${flyingToTitle}`}
    >
      <StepNode
        icon={AirplaneTakeoff}
        title={flyingFromTitle}
        value={flyingFromValue}
        active={isFrom}
        flip={Boolean(isRtl)}
      />
      <PlaneConnector flip={Boolean(isRtl)} />
      <StepNode
        icon={AirplaneLanding}
        title={flyingToTitle}
        value={flyingToValue}
        active={isTo}
        flip={Boolean(isRtl)}
      />
    </div>
  );
}
