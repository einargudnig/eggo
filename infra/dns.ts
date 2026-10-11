/**
 * eggo.is DNS, copied from the Vercel-hosted zone (2026-10-11) before moving nameservers to Cloudflare.
 * Mail is Spacemail (MX, SPF, DKIM); Resend sends from send.eggo.is via Amazon SES.
 * Vercel's CAA records and its wildcard *.eggo.is were left out on purpose: Cloudflare issues its own
 * certificates, and nothing used the wildcard.
 */
type DnsRecord =
  | { id: string; name: string; type: "A" | "TXT"; content: string }
  | { id: string; name: string; type: "MX"; content: string; priority: number };

/** Keep the current site answering while the nameservers switch; replaced by the Worker's custom domain. */
const VERCEL_BRIDGE = ["216.150.1.65", "216.150.1.193"];

export const bridgeRecords: readonly DnsRecord[] = ["@", "www"].flatMap((name) =>
  VERCEL_BRIDGE.map((ip, i) => ({
    id: `Bridge-${name === "@" ? "apex" : name}-${i}`,
    name,
    type: "A" as const,
    content: ip,
  })),
);

export const mailRecords: readonly DnsRecord[] = [
  { id: "Mx1", name: "@", type: "MX", content: "mx1.spacemail.com", priority: 0 },
  { id: "Mx2", name: "@", type: "MX", content: "mx2.spacemail.com", priority: 0 },
  { id: "Spf", name: "@", type: "TXT", content: "v=spf1 include:spf.spacemail.com ~all" },
  { id: "Verification", name: "@", type: "TXT", content: "470a2429-34b6-42e2-b277-9f6d121c80ec" },
  { id: "Dmarc", name: "_dmarc", type: "TXT", content: "v=DMARC1; p=none;" },
  {
    id: "SpacemailDkim",
    name: "spacemail._domainkey",
    type: "TXT",
    content:
      "v=DKIM1;k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA74bP/BTS4Gqv0pkO8PwRrHugQFTVdcdD3T/kvIzHk74nDjpUGR/YAwtfEbVAFms/P9Qj7rzgOPIdXceI8PQzm+V0PsqZSUVwVjCHkl76OV+7+htVF8urWmcSz19YU/317M+5VUoUyOcunQCfRhtmjw3R9Vd3SqQdYFqnZVg+PwNd1l5Sh1DeYra1vXLZqRP7VqZSG3Lr/k7Zpby1nDfRBDz909R3BkCScNrZ4FTOLwlX+BDWZNN8u329oFeSkZdBfIK2Oy7mB9myJgx+KDfnCOrNCIsffAPH+IqeCdyu5b4rjrT/pT55YimUEOcuh0KEMAMB60v9qX1CgFsne72AJQIDAQAB",
  },
  {
    id: "ResendDkim",
    name: "resend._domainkey",
    type: "TXT",
    content:
      "p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrNXFmDGPhvhG4+RSFa0bECYM7GF20OFkbUF50GejuFP1GI/kWwSNZY3w48NSFNKXLMXekyAW4WqmwEAyaKF81IsuWs73XsLODcY32GO2LBAombP34+Q6jU4awZmfrTSf1sl3dk1q9OTD6tuwRgJvbuFe4tfHMmlsqEKC6iJUnTQIDAQAB",
  },
  {
    id: "ResendMx",
    name: "send",
    type: "MX",
    content: "feedback-smtp.eu-west-1.amazonses.com",
    priority: 10,
  },
  { id: "ResendSpf", name: "send", type: "TXT", content: "v=spf1 include:amazonses.com ~all" },
];
