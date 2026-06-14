export const basePath = '';

export const brands = [
  'LiftMaster', 'Chamberlain', 'FAAC', 'BFT', 'Nice', 'CAME',
  'BENINCA', 'Hormann', 'Marantec', 'Somfy', 'Sommer', 'DEA',
  'Roger', 'V2', 'Ditec', 'Fadini', 'Merlin', 'Centurion',
  'Aprimatic', 'Allmatic', 'Key Automation', 'GIBIDI', 'Norton',
  'Linear', 'Genie', 'Cardin', 'Erreka', 'Tousek', 'King Gates',
  'SEA', 'RIB', 'Life', 'Tau', 'Cobra',
];

export const stats = [
  { value: '~1,000', label: 'SKU Range' },
  { value: 'Multi', label: 'Market Support' },
  { value: '24-48h', label: 'Sample Lead Time' },
  { value: 'Mainstream', label: 'Brand Systems' },
  { value: 'OEM', label: 'Logo / Packaging' },
];

export const compatibilityRows = [
  {
    brand: 'FAAC',
    model: 'XT2',
    frequency: '433.92 MHz',
    codeType: 'Rolling Code',
    solution: 'Available',
    sampleTest: 'Recommended',
  },
  {
    brand: 'BFT',
    model: 'MITTO 2',
    frequency: '433.92 MHz',
    codeType: 'Rolling Code',
    solution: 'Available',
    sampleTest: 'Yes',
  },
  {
    brand: 'Nice',
    model: 'FLO2R-S',
    frequency: '433.92 MHz',
    codeType: 'Rolling Code',
    solution: 'Available',
    sampleTest: 'Yes',
  },
  {
    brand: 'LiftMaster',
    model: '893MAX',
    frequency: 'Security+ 2.0',
    codeType: 'Rolling Code',
    solution: 'To Confirm',
    sampleTest: 'Yes',
  },
];

export const riskCards = [
  {
    title: 'Compatibility-Based Description',
    description: 'We describe products by compatible systems and technical specifications, not by brand ownership.',
  },
  {
    title: 'No Misleading Brand Association',
    description: 'We do not imply affiliation with any brand owner. Brand names are used for compatibility reference only.',
  },
  {
    title: 'Model / Frequency Verification',
    description: 'Compatibility must be confirmed by model, frequency, IC/chip, PCB layout, and coding protocol.',
  },
  {
    title: 'Engineering Sample Testing',
    description: 'Samples are tested on actual systems when possible to validate function, signal range, and stability.',
  },
  {
    title: 'Private Label Packaging',
    description: 'OEM / ODM branding, custom manuals, neutral packaging, and private label solutions are supported.',
  },
  {
    title: 'Documentation & Compliance Support',
    description: 'We provide technical information, export documents, and product details for smooth international trade.',
  },
];

export const products = [
  {
    title: 'Compatible Replacement Remotes',
    description: 'Wide range of remotes for rolling code, fixed code, and multi-frequency systems.',
    image: basePath + '/images/product-remotes.png',
    specs: [
      { label: 'Frequency', value: '433.92 MHz / 868 MHz' },
      { label: 'Code Type', value: 'Rolling / Fixed / Learning' },
      { label: 'Battery', value: 'CR2032 / 12V 23A' },
      { label: 'MOQ', value: '100 pcs' },
      { label: 'OEM', value: 'Logo / Packaging' },
    ],
  },
  {
    title: 'Universal Receivers',
    description: 'External and plug-in receivers for multi-brand compatibility and system upgrades.',
    image: basePath + '/images/product-receiver.png',
    specs: [
      { label: 'Frequency', value: '315 / 433.92 / 868 MHz' },
      { label: 'Code Type', value: 'Learning Code' },
      { label: 'Power', value: '12-24V options' },
      { label: 'MOQ', value: '100 pcs' },
      { label: 'OEM', value: 'Label / Packaging' },
    ],
  },
  {
    title: 'Remote Duplicators',
    description: 'Copy and clone remotes for selected protocols and frequencies.',
    image: basePath + '/images/product-duplicator.png',
    specs: [
      { label: 'Frequency', value: 'Multi-frequency options' },
      { label: 'Code Type', value: 'Fixed / Selected rolling' },
      { label: 'Battery', value: 'CR2032 / 27A' },
      { label: 'MOQ', value: '100 pcs' },
      { label: 'OEM', value: 'Logo / Manual' },
    ],
  },
  {
    title: 'Garage Door Controllers',
    description: 'Control solutions for garage doors, roller shutters, and access control systems.',
    image: basePath + '/images/product-controller.png',
    specs: [
      { label: 'Frequency', value: 'By receiver protocol' },
      { label: 'Code Type', value: 'Learning / App control' },
      { label: 'Power', value: '12-24V options' },
      { label: 'MOQ', value: '100 pcs' },
      { label: 'OEM', value: 'Firmware / Packaging' },
    ],
  },
  {
    title: 'Accessories & Parts',
    description: 'Antennas, batteries, keypads, cables, and installation parts.',
    image: basePath + '/images/product-accessories.png',
    specs: [
      { label: 'Items', value: 'Antennas / Keypads / Batteries' },
      { label: 'Fitment', value: 'Model dependent' },
      { label: 'MOQ', value: 'By item' },
      { label: 'OEM', value: 'Neutral packaging' },
    ],
  },
  {
    title: 'OEM Custom RF Solutions',
    description: 'Custom frequency, PCB design, shell design, and system integration support.',
    image: basePath + '/images/product-oem.png',
    specs: [
      { label: 'Frequency', value: 'Custom target market' },
      { label: 'Code Type', value: 'Protocol tuning' },
      { label: 'MOQ', value: 'Project based' },
      { label: 'OEM', value: 'Shell / PCB / Manual' },
    ],
  },
];

export const workflowSteps = [
  {
    step: 1,
    title: 'Share Brand / Model Photos',
    description: 'Send clear photos of the remote, receiver, motor label, or system label.',
  },
  {
    step: 2,
    title: 'Confirm Frequency & Coding',
    description: 'Provide frequency, rolling code or fixed code, DIP settings, and region.',
  },
  {
    step: 3,
    title: 'Check IC / Chip / PCB',
    description: 'Share PCB photos or IC/chip markings when needed.',
  },
  {
    step: 4,
    title: 'Engineering Match or Develop',
    description: 'Our engineers match existing solutions or develop a compatible option.',
  },
  {
    step: 5,
    title: 'Sample Test',
    description: 'Test samples with your system to confirm function and signal range.',
  },
  {
    step: 6,
    title: 'Bulk Production & Private Label',
    description: 'Start mass production with custom branding, packaging, and quality control.',
  },
];

export const verificationFields = [
  { field: 'Brand / Model', description: 'Remote, receiver, or gate operator model number.' },
  { field: 'Frequency', description: 'For example 433.92 MHz, 868 MHz, or regional label information.' },
  { field: 'Remote Photos', description: 'Front and back photos of the original remote.' },
  { field: 'PCB Photo', description: 'PCB and IC/chip markings if available.' },
  { field: 'Receiver / Motor', description: 'Receiver board, motor label, or control box information.' },
  { field: 'Market Version', description: 'Country or market version to avoid regional mismatch.' },
  { field: 'Sample Quantity', description: 'Quantity needed for compatibility testing.' },
  { field: 'OEM Requirements', description: 'Logo, packaging, manual, label, or private-label needs.' },
];

export const applications = [
  { name: 'Sliding Gates', image: basePath + '/images/app-sliding-gate.jpg' },
  { name: 'Swing Gates', image: basePath + '/images/app-swing-gate.jpg' },
  { name: 'Garage Doors', image: basePath + '/images/app-garage-door.jpg' },
  { name: 'Roller Shutters', image: basePath + '/images/app-roller-shutter.jpg' },
  { name: 'Access Control', image: basePath + '/images/app-access-control.jpg' },
  { name: 'Commercial Entrances', image: basePath + '/images/app-commercial.jpg' },
  { name: 'Warehouses', image: basePath + '/images/app-warehouse.jpg' },
];

export const oemSteps = [
  { step: 1, title: 'Branding', description: 'Logo printing, custom design, and colors.' },
  { step: 2, title: 'Custom Frequency', description: 'Multi-frequency options to fit your target market.' },
  { step: 3, title: 'Housing Design', description: 'Custom shell shape, material, and color.' },
  { step: 4, title: 'Button Layout', description: 'Custom button number, icons, and functions.' },
  { step: 5, title: 'PCB Tuning', description: 'RF performance optimization and protocol tuning.' },
  { step: 6, title: 'Packaging', description: 'Box, blister, bag, or special packaging.' },
  { step: 7, title: 'Manual / Label', description: 'User manual and label in your language.' },
  { step: 8, title: 'Mass Production', description: 'Strict QC and on-time delivery worldwide.' },
];

export const factoryItems = [
  { name: 'SMT Production Line', image: basePath + '/images/factory-smt.webp' },
  { name: 'Assembly Workshop', image: basePath + '/images/factory-assembly.webp' },
  { name: 'Functional Testing', image: basePath + '/images/factory-testing.webp' },
  { name: 'Aging Test Room', image: basePath + '/images/factory-aging.webp' },
  { name: 'Engineering R&D', image: basePath + '/images/factory-rd.webp' },
  { name: 'Packaging Inspection', image: basePath + '/images/factory-packaging.webp' },
  { name: 'Warehouse Stock', image: basePath + '/images/factory-warehouse.webp' },
  { name: 'Loading & Shipment', image: basePath + '/images/factory-loading.webp' },
];

export const resources = [
  {
    title: 'How to Identify a Compatible Remote',
    description: 'Step-by-step guide to identify models, chips, and protocols.',
    image: basePath + '/images/article-identify.jpg',
  },
  {
    title: 'Rolling Code vs Fixed Code',
    description: 'Understand the difference and how it affects compatibility.',
    image: basePath + '/images/article-rolling-code.jpg',
  },
  {
    title: 'What Buyers Should Send Before RF Matching',
    description: 'Checklist of information and photos for faster matching.',
    image: basePath + '/images/article-checklist.jpg',
  },
  {
    title: 'When OEM Development Is Needed',
    description: 'Situations that require custom development and engineering support.',
    image: basePath + '/images/article-oem.jpg',
  },
];

export const faqs = [
  {
    question: 'Are these original brand products?',
    answer: 'No. We provide independent aftermarket compatible replacement solutions. Brand names are used only for compatibility reference.',
  },
  {
    question: 'Can all models be replaced?',
    answer: 'Not all. Compatibility depends on model, frequency, IC/chip, coding protocol, and regional version.',
  },
  {
    question: 'Can you print our brand or logo?',
    answer: 'Yes. We support OEM, private label, neutral packaging, custom manuals, and brand packaging.',
  },
  {
    question: 'Do you support sample testing?',
    answer: 'Yes. We recommend sample testing before bulk orders, especially for rolling code or regional systems.',
  },
  {
    question: 'What information do you need to check compatibility?',
    answer: 'Please send remote photos, PCB photos, model number, frequency, chip marking, receiver information, and target market.',
  },
  {
    question: 'Do you support international shipping?',
    answer: 'Yes. We support global shipping and can help prepare export packaging and product information.',
  },
];
