import { helpCategories } from '../utils/helpCategories.jsx'
import HelpCategoryCard from './HelpCategoryCard.jsx'

const HelpCategories = () => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl md:text-[22px] font-bold text-700 m-0">
      Choose how we can help
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {helpCategories.map((cat) => (
        <HelpCategoryCard
          key={cat.title}
          icon={cat.icon}
          title={cat.title}
          description={cat.description}
        />
      ))}
    </div>
  </section>
)

export default HelpCategories
