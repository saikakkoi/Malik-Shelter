import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImgUrl(url: string | undefined) {
  if (!url) return 'https://placehold.co/400x400?text=No+Photo'
  if (url.startsWith('http') || url.startsWith('blob:')) return url
  return `${import.meta.env.VITE_API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
