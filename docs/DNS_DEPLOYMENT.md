# DNS & Deployment Guide — status.nuxari.com

## Step 1 — Create the Vercel project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the `nuxari-status` repository
3. Set **Project Name** to `nuxari-status`
4. Framework: **Next.js** (auto-detected)
5. Root directory: `/` (the repo root)
6. Add environment variables:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_STATUS_API_URL` | `https://api.nuxari.com` |
   | `NEXT_PUBLIC_STATUS_PAGE_URL` | `https://status.nuxari.com` |

7. Deploy — Vercel will assign a default domain like `nuxari-status.vercel.app`

---

## Step 2 — Add the custom domain in Vercel

1. In Vercel → Project → **Settings → Domains**
2. Add domain: `status.nuxari.com`
3. Vercel will display the required DNS record:

   ```
   Type:  CNAME
   Name:  status
   Value: cname.vercel-dns.com
   ```

---

## Step 3 — Configure Cloudflare DNS

1. Log into Cloudflare → select the `nuxari.com` zone
2. Go to **DNS → Records → Add record**
3. Fill in:

   | Field | Value |
   |---|---|
   | Type | `CNAME` |
   | Name | `status` |
   | Target | `cname.vercel-dns.com` |
   | Proxy status | **DNS Only** (grey cloud) ← important |
   | TTL | Auto |

   > **Why DNS Only?**
   > Vercel handles TLS termination and edge delivery. Proxying through Cloudflare (orange cloud) breaks Vercel's SSL certificate provisioning and can cause redirect loops. Set to DNS Only initially; after verifying SSL works, you may optionally enable proxying for DDoS protection — but test carefully.

4. Save the record.

---

## Step 4 — Verify the domain in Vercel

1. Back in Vercel → Domains
2. Wait 1–5 minutes for DNS propagation
3. Vercel will show `status.nuxari.com` as **Valid Configuration**
4. SSL certificate will be provisioned automatically via Let's Encrypt

---

## Step 5 — Verify the deployment

Run these checks after DNS propagates:

```bash
# 1. DNS resolves to Vercel
dig status.nuxari.com CNAME +short
# Expected: cname.vercel-dns.com.

# 2. HTTPS responds with Vercel headers (not Railway)
curl -sI https://status.nuxari.com | grep -E "server:|x-vercel"
# Expected: x-vercel-id or server: Vercel

# 3. Status page loads real data
curl -s https://status.nuxari.com | grep -o "All Systems\|Degraded\|Outage\|Maintenance"

# 4. API is reachable from the status site's origin
curl -s https://api.nuxari.com/api/status/public | python3 -m json.tool | head -10

# 5. No auth required
curl -sI https://status.nuxari.com
# Expected: HTTP/2 200 (no redirect to /login)
```

---

## Also update the nuxari-api environment variables

Add these to the Railway environment for `nuxari-api`:

| Variable | Value |
|---|---|
| `STATUS_PAGE_URL` | `https://status.nuxari.com` |
| `STATUS_API_URL` | `https://api.nuxari.com` |

These are used in incident notification emails so that:
- "View status page" links → `https://status.nuxari.com`
- Unsubscribe links → `https://status.nuxari.com/unsubscribe?token=xxx`

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SSL_ERROR_RX_RECORD_TOO_LONG` | Cloudflare proxy is on (orange cloud) | Switch to DNS Only |
| Redirect loop | Cloudflare SSL mode is "Full" or "Flexible" with proxy | Disable proxy |
| 404 on `status.nuxari.com` | CNAME not propagated yet | Wait 5–10 min; check with `dig` |
| Status data not loading | `NEXT_PUBLIC_STATUS_API_URL` wrong | Verify env var in Vercel settings |
| CORS error in browser | API `ALLOWED_ORIGINS` missing status domain | Add `https://status.nuxari.com` to Railway `ALLOWED_ORIGINS` |

---

## Updating ALLOWED_ORIGINS on the API

The Railway `ALLOWED_ORIGINS` variable for `nuxari-api` must include `https://status.nuxari.com` so browser fetch calls from the status site are accepted:

```
ALLOWED_ORIGINS=https://app.nuxari.com,https://status.nuxari.com
```
