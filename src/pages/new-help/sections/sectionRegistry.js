import PageHero from '../../../shared/components/PageHero.jsx'
import { pageHeroProps } from './adapters/pageHeroAdapter.js'

/**
 * Maps a block's `sectionId` to the component that renders it plus the adapter
 * that turns the block into that component's props.
 *
 * To make another section dynamic, add one entry here (Component + mapProps).
 * Everything else — fetching, ordering, looping — already handles it.
 */
export const sectionRegistry = {
  'page-hero': { Component: PageHero, mapProps: pageHeroProps },
}

export function getSection(sectionId) {
  return sectionRegistry[sectionId] || null
}
