# Nuxari Status — Support Requests

## Support CTA

The status page includes a Support CTA section that directs affected organizations to submit a support ticket if they are experiencing an issue not reflected in the public status.

### Component: `SupportCTA`

Location: `components/SupportCTA.tsx`

The component renders:
- A heading: "Experiencing an issue not listed here?"
- A description explaining that support is available if the organization is affected but the issue isn't listed
- Two action buttons:
  - "Open app" — links to `NEXT_PUBLIC_APP_URL`
  - "Submit support request →" — links to `NEXT_PUBLIC_SUPPORT_URL` (primary, blue button)

### Configuration

Set the support URL in your `.env.local`:

```env
NEXT_PUBLIC_SUPPORT_URL=https://app.nuxari.com/admin/support/tickets/new
```

The default fallback is `https://app.nuxari.com/admin/support/tickets/new`.

The support link opens in a new tab (`target="_blank"`) with `rel="noopener noreferrer"`.

### Placement

The `SupportCTA` renders in `app/page.tsx` between the subscribe form and the trust panel — after all operational content.

## Support Escalation Flow

When a user clicks "Submit support request":

1. They are sent to the Nuxari app support ticket creation page
2. They must be logged in to submit a ticket (handled by the app)
3. The ticket is routed to the Nuxari support team
4. The support team investigates and, if needed, creates or updates a public incident

## Footer Support Link

The site footer also includes a "Support" link in its navigation row, pointing to the same `NEXT_PUBLIC_SUPPORT_URL`. This provides a persistent, low-friction path to support from any page.

## Unsubscribe Error State

The unsubscribe page includes a link to the Nuxari app as an alternative path if the user has issues with the unsubscribe flow. This provides a support escape hatch without requiring a direct support ticket link from the unsubscribe page.
