/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE = 'https://newrestaurantsowners.com'

interface Props {
  name?: string
  amount?: string
}

const PaymentFailed = ({ name, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We couldn't process your membership payment</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your payment didn't go through</Heading>
        <Text style={text}>{name ? `Hi ${name},` : 'Hi there,'}</Text>
        <Text style={text}>
          We tried to charge <strong>{amount || 'your membership fee'}</strong> for your NewRestaurantsOwners.com membership, but the payment was declined.
          Please update your card to keep your access.
        </Text>
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button href={`${SITE}/dashboard`} style={button}>Update my card</Button>
        </Section>
        <Text style={text}>Open your dashboard and choose "Manage Billing" to update your payment details.</Text>
        <Hr style={hr} />
        <Text style={footer}>
          <Link href={`${SITE}/refunds`} style={link}>Refund Policy</Link>
          {'  ·  '}
          <Link href={`${SITE}/terms`} style={link}>Terms of Service</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentFailed,
  subject: 'Action needed: your membership payment failed',
  displayName: 'Payment failed',
  previewData: { name: 'Jane', amount: '$97.00' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { color: '#931f33', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', margin: '0 0 16px' }
const text = { color: '#2b2b2b', fontSize: '15px', lineHeight: '23px', margin: '0 0 12px' }
const button = { backgroundColor: '#931f33', color: '#ffffff', padding: '12px 22px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }
const hr = { borderColor: '#e8dcc8', margin: '24px 0 12px' }
const footer = { color: '#777777', fontSize: '12px', textAlign: 'center' as const }
const link = { color: '#d99726', textDecoration: 'underline' }
