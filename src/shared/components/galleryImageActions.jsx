import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from '@phosphor-icons/react'

const fileNameFromSrc = (src) => {
  const clean = String(src || '').split('?')[0].split('#')[0]
  const name = clean.split('/').pop()
  if (name && name.includes('.')) {
    try {
      return decodeURIComponent(name)
    } catch {
      return name
    }
  }
  return 'photo.webp'
}

export async function downloadGalleryImage(src) {
  const filename = fileNameFromSrc(src)
  try {
    const response = await fetch(src)
    if (!response.ok) throw new Error('download failed')
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  } catch {
    const link = document.createElement('a')
    link.href = src
    link.download = filename
    link.target = '_blank'
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}

export function GalleryLightbox({ image, onClose, closeLabel = 'Close' }) {
  useEffect(() => {
    if (!image) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [image, onClose])

  if (!image || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute end-4 top-4 grid size-10 place-items-center rounded-full bg-black/60 text-white"
      >
        <X size={18} weight="bold" />
      </button>
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain"
        onClick={(event) => event.stopPropagation()}
      />
    </div>,
    document.body,
  )
}
