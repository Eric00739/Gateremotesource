export type CompatibilityModel = {
  model: string;
  frequency: string;
  codeType: string;
  note: string;
};

export type CompatibilityBrand = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  buyerIntent: string;
  models: CompatibilityModel[];
  checks: string[];
};

export const compatibilityBrands: CompatibilityBrand[] = [
  {
    slug: 'faac',
    name: 'FAAC',
    shortDescription: 'Replacement remote matching for selected FAAC gate systems.',
    description: 'Aftermarket remote options for selected FAAC gate systems. Final matching depends on model, frequency, receiver version, chip, and coding protocol.',
    buyerIntent: 'FAAC remote replacement, FAAC gate remote compatible, FAAC 433.92MHz remote',
    models: [
      { model: 'XT2 / XT4 references', frequency: '433.92 MHz references', codeType: 'Rolling code references', note: 'Confirm by original remote photo and receiver label.' },
      { model: 'SLH / master remote references', frequency: 'Market version dependent', codeType: 'Protocol dependent', note: 'Sample testing is recommended before bulk orders.' },
      { model: 'Older fixed code references', frequency: 'Label dependent', codeType: 'Fixed code references', note: 'Share DIP switch or PCB details when available.' },
    ],
    checks: ['Original remote front and back photos', 'Receiver or motor control board label', 'Frequency label such as 433.92 MHz', 'Chip or PCB marking if available', 'Target country or market version'],
  },
  {
    slug: 'nice',
    name: 'Nice',
    shortDescription: 'Compatible replacement remote sourcing for selected Nice gate operators.',
    description: 'Compatibility support for selected Nice remote control references, including model matching, sample verification, and private-label supply.',
    buyerIntent: 'Nice gate remote replacement, Nice compatible remote, Nice garage door remote supplier',
    models: [
      { model: 'FLO2R-S references', frequency: '433.92 MHz references', codeType: 'Rolling code references', note: 'Confirm model and region before matching.' },
      { model: 'ON / ON-E references', frequency: 'Market version dependent', codeType: 'Rolling code references', note: 'Receiver version can affect matching.' },
      { model: 'Fixed code references', frequency: 'Label dependent', codeType: 'Fixed code references', note: 'Share remote and receiver photos for verification.' },
    ],
    checks: ['Remote model printed on shell or label', 'Frequency marking', 'Receiver board or motor label', 'Button count and shell photo', 'Sample quantity and OEM needs'],
  },
  {
    slug: 'bft',
    name: 'BFT',
    shortDescription: 'Aftermarket BFT-style replacement remotes and RF matching support.',
    description: 'Remote replacement matching for selected BFT gate systems, focused on buyer verification, sample testing, and wholesale sourcing.',
    buyerIntent: 'BFT remote replacement, BFT MITTO compatible remote, BFT gate remote supplier',
    models: [
      { model: 'MITTO 2 references', frequency: '433.92 MHz references', codeType: 'Rolling code references', note: 'Match by model, receiver version, and market region.' },
      { model: 'MITTO 4 references', frequency: '433.92 MHz references', codeType: 'Rolling code references', note: 'Confirm button count and original remote photo.' },
      { model: 'Regional references', frequency: 'Region dependent', codeType: 'Protocol dependent', note: 'Engineering confirmation is required for bulk orders.' },
    ],
    checks: ['Original remote photo', 'Model or family reference', 'Receiver label', 'Frequency and market version', 'Required packaging or branding'],
  },
  {
    slug: 'doorhan',
    name: 'DoorHan',
    shortDescription: 'DoorHan remote replacement matching for selected gate and garage door systems.',
    description: 'Support for selected DoorHan remote control replacement requests, with model matching, frequency confirmation, and sample verification.',
    buyerIntent: 'DoorHan remote control replacement, DoorHan compatible remote, DoorHan gate remote supplier',
    models: [
      { model: '2-button remote references', frequency: '433.92 MHz references', codeType: 'Protocol dependent', note: 'Confirm shell, receiver, and regional version.' },
      { model: '4-button remote references', frequency: 'Label dependent', codeType: 'Protocol dependent', note: 'Share remote photos before sample matching.' },
      { model: 'Garage door opener references', frequency: 'Market version dependent', codeType: 'Receiver dependent', note: 'Receiver label is important for verification.' },
    ],
    checks: ['Remote shell photo', 'Frequency label', 'Receiver or opener label', 'Button count', 'Country or market version'],
  },
  {
    slug: 'came',
    name: 'CAME',
    shortDescription: 'Compatible replacement remote references for selected CAME gate systems.',
    description: 'Aftermarket sourcing support for selected CAME remote references, including model comparison, sample testing, and OEM packaging options.',
    buyerIntent: 'CAME remote replacement, CAME gate remote compatible, CAME 433.92MHz remote supplier',
    models: [
      { model: 'TOP series references', frequency: '433.92 MHz references', codeType: 'Fixed or rolling references', note: 'Confirm exact model and coding before matching.' },
      { model: 'TAM / TWIN references', frequency: 'Label dependent', codeType: 'Protocol dependent', note: 'Share remote and receiver details.' },
      { model: 'Multi-button references', frequency: 'Market version dependent', codeType: 'Receiver dependent', note: 'Sample testing is recommended.' },
    ],
    checks: ['Exact model family', 'Remote label and shell photo', 'Receiver board photo', 'Frequency marking', 'Bulk order and branding requirements'],
  },
  {
    slug: 'liftmaster',
    name: 'LiftMaster',
    shortDescription: 'Selected LiftMaster-compatible remote replacement and wholesale support.',
    description: 'Replacement remote support for selected LiftMaster garage door and gate operator references, with careful frequency and protocol verification.',
    buyerIntent: 'LiftMaster remote replacement, LiftMaster compatible remote, garage door remote wholesale',
    models: [
      { model: '893MAX references', frequency: 'Security+ 2.0 references', codeType: 'Rolling code references', note: 'Confirm opener generation and region.' },
      { model: '315 MHz references', frequency: '315 MHz references', codeType: 'Protocol dependent', note: 'Check original model and receiver label.' },
      { model: '390 MHz references', frequency: '390 MHz references', codeType: 'Protocol dependent', note: 'Older systems require model confirmation.' },
    ],
    checks: ['Original remote model', 'Opener or receiver label', 'Frequency or protocol marking', 'Button color or shell photo', 'Country or market version'],
  },
];

export function getCompatibilityBrand(slug: string) {
  return compatibilityBrands.find((brand) => brand.slug === slug);
}
