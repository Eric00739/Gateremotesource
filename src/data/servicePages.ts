export const oemPage = {
  path: '/oem-odm',
  metaTitle: 'OEM / ODM RF Remote Development | GateRemoteSource',
  metaDescription:
    'Private-label RF remote development, packaging, manual, sample testing, and protocol matching support for wholesale buyers.',
  eyebrow: 'OEM / ODM',
  title: 'Private-Label RF Remote Development',
  subtitle:
    'Build a controlled product line around verified frequency, protocol, packaging, and market requirements instead of public brand-style catalog claims.',
  primaryCta: 'Discuss OEM Project',
  secondaryCta: 'Request Catalog Access',
  supportTitle: 'What can be customized',
  supportHeading: 'Build around your market, not public product copying.',
  supportSubtitle:
    'The work starts after model matching, sample requirements, and target market details are clear.',
  highlights: [
    'Private-label logo, packaging, label, and manual support',
    'Frequency, PCB, button layout, and protocol tuning for target markets',
    'Neutral presentation for distributors who need safer wholesale supply',
  ],
  workflowLabel: 'Controlled workflow',
  detailTitle: 'From matching request to controlled production',
  detailSubtitle:
    'Each project is scoped around compatibility evidence, sample testing, and export-ready production details.',
};

export const factoryQualityPage = {
  path: '/factory-quality',
  metaTitle: 'Factory & Quality Evidence | GateRemoteSource',
  metaDescription:
    'Production evidence, RF testing, packaging inspection, sample verification, and export documentation support for compatible remote supply.',
  eyebrow: 'Factory & Quality',
  title: 'Factory Evidence Before Bulk Orders',
  subtitle:
    'Show buyers how RF remote supply is controlled: sample verification, functional testing, packaging checks, and shipment preparation.',
  primaryCta: 'Send Model for Verification',
  secondaryCta: 'Request Wholesale Catalog',
  processLabel: 'Production control',
  processTitle: 'Quality controls buyers can understand',
  processSubtitle:
    'The page focuses on process evidence instead of exposing risky product shell comparisons.',
  checks: [
    'Incoming material and PCB inspection',
    'Frequency and signal range testing',
    'Protocol compatibility sample checks',
    'Packaging, label, and manual verification',
    'Export document and shipment preparation',
    'Batch feedback before repeat production',
  ],
  facilityLabel: 'Facility evidence',
  facilityTitle: 'Visible process, controlled claims.',
};

export const catalogPage = {
  path: '/request-catalog',
  metaTitle: 'Request Wholesale Compatibility Catalog | GateRemoteSource',
  metaDescription:
    'Request a private wholesale catalog for compatible remote controls, receivers, and RF solutions after model and frequency confirmation.',
  eyebrow: 'Controlled Catalog Access',
  title: 'Request a Wholesale Compatibility Catalog',
  subtitle:
    'Catalog access is handled after model, frequency, protocol, quantity, and target market are checked, so buyers receive relevant options without public product browsing.',
  primaryCta: 'Request Wholesale Catalog',
  secondaryCta: 'Check Supported Brands',
  cardNote: 'Model details first. Catalog after verification.',
  requirementTitle: 'What to send first',
  requirementHeading: 'A catalog request should start with fitment data.',
  requirementSubtitle:
    'These details help us narrow the catalog to compatible options and avoid model, frequency, or regional mismatch.',
  requirements: [
    {
      title: 'Remote Photos',
      description: 'Front, back, label, button layout, and PCB photo when possible.',
    },
    {
      title: 'Model and Frequency',
      description: 'Brand reference, model number, 315 / 433.92 / 868 MHz label, and code type if known.',
    },
    {
      title: 'Target Market',
      description: 'Country or region version, required certification notes, and packaging language.',
    },
    {
      title: 'Order Scope',
      description: 'Sample quantity, wholesale quantity, private-label needs, and timeline.',
    },
  ],
  scopeLabel: 'Private scope',
  scopeTitle: 'What the private catalog can cover',
  scopeItems: [
    'Compatible replacement remote options',
    'Universal receivers and controller solutions',
    'Private-label packaging and manual options',
    'Sample testing plan before bulk production',
  ],
};

export const homepageCapabilities = [
  {
    title: 'Compatibility References',
    description: 'Public brand and model references that guide buyers toward verification before ordering.',
    href: '/compatibility',
  },
  {
    title: 'OEM / ODM Development',
    description: 'Private-label RF projects built around frequency, protocol, packaging, and sample testing.',
    href: oemPage.path,
  },
  {
    title: 'Factory & Quality Evidence',
    description: 'Production, RF testing, packaging, and export process details for wholesale buyers.',
    href: factoryQualityPage.path,
  },
  {
    title: 'Request Wholesale Catalog',
    description: 'A private catalog path after the buyer sends model, frequency, photos, and quantity needs.',
    href: catalogPage.path,
  },
];
