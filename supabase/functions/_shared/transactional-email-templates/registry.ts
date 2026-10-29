import type { ComponentType } from 'npm:react@18.3.1'
import { template as contactNotification } from './contact-notification.tsx'
import { template as trialEnding } from './trial-ending.tsx'
import { template as paymentFailed } from './payment-failed.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-notification': contactNotification,
  'trial-ending': trialEnding,
  'payment-failed': paymentFailed,
}
