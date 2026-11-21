import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const Email = ({ name, email }: { name?: string; email?: string }) => (
  <Html lang="en"><Head /><Preview>A visitor joined your launch waiting list</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }}>
      <Container style={{ padding: '28px', maxWidth: '560px' }}>
        <Heading style={{ color: '#722F37', fontFamily: 'Georgia, serif' }}>New launch waiting-list signup</Heading>
        <Text>NewRestaurantsOwners.com</Text>
        <Text>Name: {name}</Text><Text>Email: {email}</Text>
        <Text>This visitor agreed to receive the launch announcement and first-month offer. Their contact and consent are stored in waitlist_submissions (More → Database).</Text>
      </Container>
    </Body>
  </Html>
)
export const template = {
  component: Email,
  subject: 'New NRO launch waiting-list signup',
  displayName: 'Waiting-list owner notification',
  to: 'support@newrestaurantsowners.com',
  previewData: { name: 'Restaurant Owner', email: 'owner@example.com' },
} satisfies TemplateEntry