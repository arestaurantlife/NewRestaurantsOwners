import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const Body = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
})

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let raw: unknown
  try { raw = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const parsed = Body.safeParse(raw)
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400)
  const { name, email, subject, message } = parsed.data

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  // Rate limit: max 3 messages per email address per 10 minutes
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await admin.from('contact_submissions').select('id', { count: 'exact', head: true })
    .eq('email', email).gte('created_at', since)
  if ((count ?? 0) >= 3) return json({ error: 'Too many messages. Please try again later.' }, 429)

  const { data: row, error } = await admin.from('contact_submissions')
    .insert({ name, email, subject: subject || null, message }).select('id').single()
  if (error || !row) {
    console.error('insert failed', error)
    return json({ error: 'Could not save message' }, 500)
  }

  try {
    await sendTemplateEmail('contact-notification', 'support@newrestaurantsowners.com', {
      templateData: { name, email, subject: subject || '', message },
      idempotencyKey: `contact-notify-${row.id}`,
      replyTo: email,
    })
  } catch (e) {
    // Message is saved; log the email failure but don't fail the visitor.
    console.error('notification email failed', e)
  }

  return json({ ok: true })
})
