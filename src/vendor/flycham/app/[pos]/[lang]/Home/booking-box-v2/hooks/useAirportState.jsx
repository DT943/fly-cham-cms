'use client';

import { useCallback, useEffect, useReducer } from "react";
import {
  airportsInitialState,
  airportsReducer,
  AIRPORT_ACTIONS,
} from "../reducers/airportsReducer";
import {
  AIRPORT_TYPES,
  RESTRICTED_AIRPORTS,
} from "../constants/bookingBoxConstants";
import { getFirstLeg } from "../utils/legsUtils";
import { collectDestinationIatasForOrigin } from "@/util/airports";
import { collectDestinationIatasFromB2cRoutes } from "@/lib/b2cAvailability/collectDestinationIatasFromB2cRoutes";
import {
  TRIP_TYPES,
} from "../constants/bookingBoxConstants";
import {
  collectMultiCityLeg2DestinationIatas,
  collectMultiCityLeg2SourceIatas,
  normalizeRouteRows,
  resolveAirportIataById,
} from "../utils/multiCityLeg2AirportFilter";

/** Damascus first when present; keeps relative order of all other airports. */
function sortWithDamFirst(items) {
  if (!Array.isArray(items) || items.length === 0) return items;
  const dam = RESTRICTED_AIRPORTS.DAM;
  let damIdx = -1;
  for (let i = 0; i < items.length; i++) {
    if ((items[i]?.iataCode || "").toUpperCase() === dam) {
      damIdx = i;
      break;
    }
  }
  if (damIdx < 0) return items;
  const damItem = items[damIdx];
  const rest = items.filter((_, i) => i !== damIdx);
  return [damItem, ...rest];
}

const getAirportName = (cities, airportId) => {
  if (!airportId) return "";
  const city = cities?.find((c) => c.id === airportId);
  return city?.airPortTranslations?.[0]?.airPortName ?? "";
};

export function useAirportState({
  formik,
  airports,
  prefetchedSchedules = null,
  /** @deprecated Use b2cRouteRows instead. */
  catalogDestinationFilter = false,
  /** B2C route/all rows; when set, destinations are filtered to served routes. */
  b2cRouteRows = null,
  /** True while on B2C flow but route matrix has not finished loading (`b2cRouteRows === null`). */
  b2cRoutesPending = false,
}) {
  const [state, dispatch] = useReducer(airportsReducer, airportsInitialState);

  const setCities = useCallback((items) => {
    dispatch({
      type: AIRPORT_ACTIONS.SET_CITIES,
      payload: Array.isArray(items) ? items : [],
    });
  }, []);

  const setSourceSearch = useCallback((value) => {
    dispatch({ type: AIRPORT_ACTIONS.SET_SOURCE_SEARCH, payload: value });
  }, []);

  const setDestinationSearch = useCallback((value) => {
    dispatch({ type: AIRPORT_ACTIONS.SET_DESTINATION_SEARCH, payload: value });
  }, []);

  useEffect(() => {
    if (airports?.items?.length) {
      setCities(airports.items);
      return;
    }
    setCities([]);
  }, [airports?.items, setCities]);

  useEffect(() => {
    if (!formik?.values) return;
    const firstLeg = getFirstLeg(formik.values);
    const sourceName = getAirportName(state.cities, firstLeg.source);
    const destinationName = getAirportName(state.cities, firstLeg.destination);

    setSourceSearch(sourceName);
    setDestinationSearch(destinationName);
  }, [
    formik?.values?.legs,
    state.cities,
    setSourceSearch,
    setDestinationSearch,
  ]);

  const getCitiesArray = useCallback(
    (type, iataSourceCode, search = "", options = {}) => {
      const normalizedSearch = search.toLowerCase();

      const matchesSearch = (c) => {
        const { airPortTranslations, iataCode } = c;
        const { airPortName, city, country } = airPortTranslations?.[0] || {};
        return (
          airPortName?.toLowerCase().includes(normalizedSearch) ||
          city?.toLowerCase().includes(normalizedSearch) ||
          country?.toLowerCase().includes(normalizedSearch) ||
          iataCode?.toLowerCase().includes(normalizedSearch)
        );
      };

      const filterByAllowedOrder = (allowedOrder) => {
        const allowedSet = new Set(allowedOrder.map((code) => code.toUpperCase()));
        const filtered =
          state.cities?.filter((c) => {
            if (!matchesSearch(c)) return false;
            return allowedSet.has((c.iataCode || "").toUpperCase());
          }) || [];
        if (allowedOrder.length === 0) return [];
        const orderIndex = new Map(
          allowedOrder.map((code, i) => [code.toUpperCase(), i]),
        );
        const byRoute = [...filtered].sort((a, b) => {
          const ia =
            orderIndex.get((a.iataCode || "").toUpperCase()) ?? 999;
          const ib =
            orderIndex.get((b.iataCode || "").toUpperCase()) ?? 999;
          return ia - ib;
        });
        return sortWithDamFirst(byRoute);
      };

      const isMultiCityLeg2 =
        options.multiCityLegIndex === 1 &&
        (options.tripType === TRIP_TYPES.MULTICITY ||
          formik?.values?.tripType === TRIP_TYPES.MULTICITY);

      if (isMultiCityLeg2) {
        const leg1 = getFirstLeg(options.formikValues || formik?.values);
        const leg1OriginIata = resolveAirportIataById(state.cities, leg1.source);
        const leg1DestIata = resolveAirportIataById(state.cities, leg1.destination);
        const routeRows = normalizeRouteRows(
          b2cRouteRows ?? prefetchedSchedules ?? [],
        );

        if (!leg1OriginIata || !leg1DestIata) {
          return [];
        }

        if (type === AIRPORT_TYPES.SOURCE) {
          return filterByAllowedOrder(
            collectMultiCityLeg2SourceIatas({
              routeRows,
              airports: state.cities,
              leg1OriginIata,
              leg1DestIata,
            }),
          );
        }

        if (!iataSourceCode) {
          return [];
        }

        return filterByAllowedOrder(
          collectMultiCityLeg2DestinationIatas({
            routeRows,
            airports: state.cities,
            leg1OriginIata,
            leg2SourceIata: iataSourceCode,
          }),
        );
      }

      if (type === AIRPORT_TYPES.SOURCE) {
        return sortWithDamFirst(state.cities?.filter((c) => matchesSearch(c)) || []);
      }

      if (b2cRoutesPending) {
        return [];
      }

      const hasScheduleRows =
        Array.isArray(prefetchedSchedules) && prefetchedSchedules.length > 0;

      const useB2cRoutes = b2cRouteRows != null;
      if (useB2cRoutes) {
        if (!iataSourceCode) {
          return [];
        }
        const allowedOrder = collectDestinationIatasFromB2cRoutes(
          b2cRouteRows,
          iataSourceCode,
        );
        return filterByAllowedOrder(allowedOrder);
      }

      const legacyDestinationRule = (c) => {
        const { iataCode } = c;
        if (
          iataSourceCode === RESTRICTED_AIRPORTS.DAM ||
          iataSourceCode === RESTRICTED_AIRPORTS.ALP
        ) {
          return (
            iataCode !== RESTRICTED_AIRPORTS.DAM &&
            iataCode !== RESTRICTED_AIRPORTS.ALP
          );
        }
        return (
          iataCode === RESTRICTED_AIRPORTS.DAM ||
          iataCode === RESTRICTED_AIRPORTS.ALP
        );
      };

      const useManifest = hasScheduleRows && Boolean(iataSourceCode);
      const allowedOrder = useManifest
        ? collectDestinationIatasForOrigin(
            prefetchedSchedules,
            iataSourceCode
          )
        : [];
      const allowedSet = useManifest
        ? new Set(allowedOrder.map((code) => code.toUpperCase()))
        : null;

      const filtered =
        state.cities?.filter((c) => {
          if (!matchesSearch(c)) return false;
          if (catalogDestinationFilter) {
            if (!iataSourceCode) return true;
            return (c.iataCode || "").toUpperCase() !== String(iataSourceCode).toUpperCase();
          }
          if (!iataSourceCode || !useManifest) {
            return legacyDestinationRule(c);
          }
          return allowedSet.has((c.iataCode || "").toUpperCase());
        }) || [];

      if (useManifest && allowedOrder.length > 0) {
        const orderIndex = new Map(
          allowedOrder.map((code, i) => [code.toUpperCase(), i])
        );
        const byManifest = [...filtered].sort((a, b) => {
          const ia =
            orderIndex.get((a.iataCode || "").toUpperCase()) ?? 999;
          const ib =
            orderIndex.get((b.iataCode || "").toUpperCase()) ?? 999;
          return ia - ib;
        });
        return sortWithDamFirst(byManifest);
      }

      return sortWithDamFirst(filtered);
    },
    [state.cities, prefetchedSchedules, catalogDestinationFilter, b2cRouteRows, b2cRoutesPending, formik?.values?.tripType]
  );

  return {
    cities: state.cities,
    sourceSearch: state.sourceSearch,
    destinationSearch: state.destinationSearch,
    setSourceSearch,
    setDestinationSearch,
    getCitiesArray,
  };
}

