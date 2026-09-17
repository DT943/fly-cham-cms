import { typography } from '../../../styles/typography.js'

const NewsDetailParagraphs = ({ paragraphs = [], className = '' }) => (
  <div className={`flex flex-col gap-4 md:gap-5 ${className}`}>
    {paragraphs.map(({ bold, text }, index) => (
      <p key={index} className={`m-0 font-normal leading-relaxed text-700 ${typography.body}`}>
        {bold ? <span className="font-semibold text-800">{bold}</span> : null}
        {text}
      </p>
    ))}
  </div>
)

export default NewsDetailParagraphs
