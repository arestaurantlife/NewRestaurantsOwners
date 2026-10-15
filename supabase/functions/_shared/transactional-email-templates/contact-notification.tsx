/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactNotification = ({ name, email, subject, message }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New contact message from {name || 'a visitor'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Us message</Heading>
        <Text style={muted}>Someone sent a message from the NewRestaurantsOwners.com contact form. Reply to this email to answer them directly.</Text>
        <Section style={box}>
          <Text style={label}>Name</Text>
          <Text style={value}>{name || '—'}</Text>
          <Text style={label}>Email</Text>
          <Text style={value}>{email || '—'}</Text>
          <Text style={label}>Subject</Text>
          <Text style={value}>{subject || '(none)'}</Text>
          <Hr style={hr} />
          <Text style={label}>Message</Text>
          <Text style={{ ...value, whiteSpace: 'pre-wrap' }}>{message || ''}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactNotification,
  subject: (d: Record<string, any>) => `New contact message: ${d.subject || d.name || 'Contact form'}`,
  displayName: 'Contact form notification',
  to: 'support@newrestaurantsowners.com',
  previewData: { name: 'Jane Doe', email: 'jane@example.com', subject: 'Membership question', message: 'Hi, I have a question about the Pro plan.' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { color: '#722F37', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', margin: '0 0 12px' }
const muted = { color: '#555555', fontSize: '14px', lineHeight: '20px' }
const box = { border: '1px solid #e8dcc8', borderRadius: '8px', padding: '16px 20px', backgroundColor: '#fbf8f2' }
const label = { color: '#b08d3c', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em', margin: '8px 0 2px' }
const value = { color: '#2b2b2b', fontSize: '15px', lineHeight: '22px', margin: '0 0 6px' }
const hr = { borderColor: '#e8dcc8', margin: '12px 0' }
