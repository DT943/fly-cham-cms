import urgentHelpBg from '../../../assets/images/contact-us/ph1.png'
import Button from '../../../shared/components/Button.jsx'

const UrgentHelp = () => (
  <section
    className="relative rounded-xl overflow-hidden w-full min-h-[300px] md:min-h-[415px] bg-cover bg-center flex items-center px-8 sm:px-12 md:px-20 py-12 md:py-16"
    style={{ backgroundImage: `url(${urgentHelpBg})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-[#00253cdb] via-[#00253c66] to-transparent z-[1]" />

    <div className="relative z-[2] flex flex-col gap-6 max-w-xl">
      <h2 className="font-montserrat text-2xl sm:text-3xl md:text-4xl font-semibold text-[#fdfdfc] m-0">
        Need urgent help?
      </h2>
      <p className="font-montserrat text-base md:text-lg font-medium text-[#fdfdfc] m-0 leading-relaxed">
        If your travel is today or you are already at the airport, please contact us for live operational support.
      </p>
      <Button>Contact us</Button>
    </div>
  </section>
)

export default UrgentHelp
