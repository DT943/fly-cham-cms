import { useTranslation } from 'react-i18next'
import Container from '../../../shared/components/Container.jsx'
import { typography } from '../../../styles/typography.js'
import LegalInfoCard from './LegalInfoCard.jsx'

/**
 * Full-bleed "Get more information" band shared by every legal page. `cards` is
 * an ordered list of `{ id, href }` pointing at the two sibling legal pages.
 */
const LegalMoreInfo = ({ cards = [] }) => {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-secondary-1/15 py-11">
      <Container className="flex flex-col gap-6">
        <h2 className={`m-0 font-semibold text-700 ${typography.sectionTitle}`}>
          {t('legal.moreInfoTitle')}
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <LegalInfoCard key={card.id} {...card} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export default LegalMoreInfo
