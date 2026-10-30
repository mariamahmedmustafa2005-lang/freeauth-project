import { CheckCircle2, CircleAlert } from 'lucide-react'
import type { Notice } from '../types/auth'

type NoticeBannerProps = {
  notice: Notice
}

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null
  const Icon = notice.kind === 'error' ? CircleAlert : CheckCircle2

  return (
    <div
      className={`notice notice-${notice.kind}`}
      role={notice.kind === 'error' ? 'alert' : 'status'}
      aria-live={notice.kind === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      <Icon size={17} aria-hidden="true" />
      <span>{notice.message}</span>
    </div>
  )
}
