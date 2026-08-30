import { journeySteps } from '../utils/journeySteps.js'
import JourneyStep from './JourneyStep.jsx'

const JourneySection = () => (
  <section className="bg-white rounded-xl px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
    <h2 className="font-montserrat text-xl md:text-[22px] font-bold text-[#3e3e3b] m-0 mb-7">
      Start with your journey
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
      {journeySteps.map((step) => (
        <JourneyStep
          key={step.stepLabel}
          icon={step.icon}
          stepLabel={step.stepLabel}
          links={step.links}
        />
      ))}
    </div>
  </section>
)

export default JourneySection
