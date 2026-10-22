/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE = 'https://newrestaurantsowners.com'

interface Props {
  name?: string
  trialEnd?: string
  amount?: string
}

const TrialEnding = ({ name, trialEnd, amount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your free trial ends {trialEnd || 'soon'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your free trial ends in 3 days</Heading>
        <Text style={text}>{name ? `Hi ${name},` : 'Hi there,'}</Text>
        <Text style={text}>
          Your NewRestaurantsOwners.com Starter trial ends on <strong>{trialEnd || 'the date shown in your account'}</strong>.
          After that, your card will be charged <strong>{amount || '$47/month'}</strong> unless you cancel before then.
        </Text>
        <Text style={text}>Want to keep going? You don't need to do anything. Not for you? Cancel in one click from your account:</Text>
        <Section style={{ textAlign: 'center', margin: '24px 0' }}>
          <Button href={`${SITE}/dashboard#cancel`} style={button}>Cancel my subscription</Button>
        </Section>
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
  component: TrialEnding,
  subject: (d: Record<string, any>) => `Your free trial ends ${d.trialEnd || 'in 3 days'}`,
  displayName: 'Trial ending reminder',
  previewData: { name: 'Jane', trialEnd: 'December 22, 2026', amount: '$47/month' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px 28px', maxWidth: '560px' }
const h1 = { color: '#931f33', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', margin: '0 0 16px' }
const text = { color: '#2b2b2b', fontSize: '15px', lineHeight: '23px', margin: '0 0 12px' }
const button = { backgroundColor: '#931f33', color: '#ffffff', padding: '12px 22px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none' }
const hr = { borderColor: '#e8dcc8', margin: '24px 0 12px' }
const footer = { color: '#777777', fontSize: '12px', textAlign: 'center' as const }
const link = { color: '#d99726', textDecoration: 'underline' }
