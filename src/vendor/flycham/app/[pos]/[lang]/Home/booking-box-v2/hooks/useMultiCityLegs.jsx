'use client';

import { useState } from 'react';

export const useMultiCityLegs = () => {
  const [activeMultiCityCalendarLeg, setActiveMultiCityCalendarLeg] =
    useState(1);
  const [multiCityDatePicked, setMultiCityDatePicked] = useState({
    leg: 1,
    nonce: 0,
  });

  return {
    activeMultiCityCalendarLeg,
    setActiveMultiCityCalendarLeg,
    multiCityDatePicked,
    setMultiCityDatePicked,
  };
};

