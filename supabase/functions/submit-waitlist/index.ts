import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255).transform(s => s.toLowerCase()),
  marketingConsent: z.literal(true),
  website: z.string().max(0).optional(),
})
const consentText = 'I agree to receive the launch announcement and first-month promotional offer from NewRestaurantsOwners.com by email. I can unsubscribe at any time.'
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  try {
    if (Number(req.headers.get('content-length') || 0) > 4096) return json({ error: 'Request too large' }, 413)
    const raw = await req.text()
    if (raw.length > 4096) return json({ error: 'Request too large' }, 413)
    let body: unknown
    try { body = JSON.parse(raw) } catch { return json({ error: 'Invalid request' }, 400) }
    const parsed = schema.safeParse(body)
    if (!parsed.success) return json({ error: 'Please provide your name, valid email and permission to receive the launch offer.' }, 400)
    const url = Deno.env.get('SUPABASE_URL')
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!url || !key) return json({ error: 'Signup is temporarily unavailable.' }, 503)
    const admin = createClient(url, key)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${key}:${ip}`))
    const ipHash = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
    const { count, error: limitError } = await admin.from('waitlist_submissions').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', new Date(Date.now() - 600000).toISOString())
    if (limitError) return json({ error: 'Please try again shortly.' }, 503)
    if ((count ?? 0) >= 3) return json({ error: 'Too many signups. Please try again later.' }, 429)
    const { name, email } = parsed.data
    const { data: row, error } = await admin.from('waitlist_submissions').insert({ name, email, marketing_consent: true, consent_text: consentText, ip_hash: ipHash }).select('id').single()
    // Identical response prevents exposing whether an email is already registered.
    if (error?.code === '23505') return json({ ok: true })
    if (error || !row) return json({ error: 'Could not save your signup. Please try again.' }, 500)
    try {
      await sendTemplateEmail('waitlist-notification', 'support@newrestaurantsowners.com', { templateData: { name, email }, idempotencyKey: `waitlist-notify-${row.id}` })
    } catch {
      console.error('Waiting-list owner notification failed; signup remains saved.')
    }
    return json({ ok: true })
  } catch {
    return json({ error: 'Signup is temporarily unavailable. Please try again.' }, 500)
  }
})