// ============================================================================
// ROVE STUDIO CODEX — MAIN CONTENT & MULTI-DROP CONFIGURATION FILE
// ============================================================================
// Edit this file to instantly change any text, prices, measurements, or images
// across your live website! You can also manage everything visually via your
// /admin Dashboard once linked with Upstash Redis on Vercel!
// ============================================================================

export interface SizeOption {
  id: string;
  name: string;
  details: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  priceFormatted: string;
  priceNumeric: number;
  frontImage: string; // Image 1 (Front View)
  backImage: string;  // Image 2 (Back / Alternate View)
  caption: string;
  sizes: SizeOption[]; // 👉 Each individual product/colorway now controls its own sizes & measurements!
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface DropItem {
  id: string;
  badge: string;
  name: string;
  shortDescription: string;
  shippingNote: string;
  colors: ColorOption[]; // Can contain 1, 2, 3, or any number of items/products in this release!
  accordions: AccordionItem[];
  orderButtonText: string;
  secondaryActionText: string;
  guaranteeText: string;
}

export interface SiteConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logoText: string;
    logoIconImage: string;
    founderEmail: string;
    whatsappNumber: string; // Enter your full WhatsApp number with country code without + (e.g., "923001234567")
    web3formsAccessKey?: string; // Permanently configured free email service delivering directly to rovepresence@gmail.com!
    defaultCurrency: string;
  };
  nav: {
    links: { name: string; href: string }[];
    ctaText: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scrollText: string;
    specItems: { label: string; value: string }[];
    images: {
      leftFramed: { src: string; caption: string };
      rightFramed: { src: string; caption: string };
    };
  };
  manifesto: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    pillars: { title: string; subtitle: string }[];
  };
  // DYNAMIC MULTI-DROP CATALOG: Add as many current or future drops here as you want!
  drops: DropItem[];
  craft: {
    badge: string;
    title: string;
    description: string;
    quote: string;
    items: { title: string; subtitle: string; description: string; image: string }[];
  };
  gallery: {
    badge: string;
    title: string;
    images: { src: string; title: string; caption: string; aspect: string; tag: string }[];
  };
  waitlist: {
    badge: string;
    title: string;
    description: string;
    buttonText: string;
    privacyNote: string;
  };
  footer: {
    slogan: string;
    aboutText: string;
    copyrightText: string;
    instagramUrl: string;
    inquiries: { label: string; email: string }[];
  };
}

const standardTwoSizes: SizeOption[] = [
  {
    id: "M",
    name: "Medium",
    details: "Chest: 20\" | Length: 27.5\" | Shoulder: 17.5\"",
  },
  {
    id: "L",
    name: "Large",
    details: "Chest: 21\" | Length: 28.5\" | Shoulder: 18\"",
  },
];

export const siteContent: SiteConfig = {
  // --------------------------------------------------------------------------
  // 1. GENERAL BRAND, EMAIL & WHATSAPP SETTINGS
  // --------------------------------------------------------------------------
  brand: {
    name: "ROVE",
    tagline: "Less Noise. More Presence.",
    description: "An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction.",
    logoText: "ROVE",
    logoIconImage: "/images/logo-icon.jpg",
    founderEmail: "rovepresence@gmail.com",
    whatsappNumber: "923000000000", // 👉 REPLACE THIS with your real WhatsApp number (e.g. 923001234567)
    web3formsAccessKey: "b0a8ee37-de57-4314-acee-4c65d60c8580", // Permanently embedded Web3Forms access key for rovepresence@gmail.com!
    defaultCurrency: "PKR",
  },

  // --------------------------------------------------------------------------
  // 2. NAVIGATION BAR
  // --------------------------------------------------------------------------
  nav: {
    links: [
      { name: "Manifesto", href: "#manifesto" },
      { name: "Releases & Drops", href: "#showcase" },
      { name: "Craftsmanship", href: "#craft" },
      { name: "Lookbook", href: "#gallery" },
      { name: "Allocation & Orders", href: "#waitlist" },
    ],
    ctaText: "Order Allocation",
  },

  // --------------------------------------------------------------------------
  // 3. HERO SECTION
  // --------------------------------------------------------------------------
  hero: {
    badge: "Drop 001 — Essential Edition",
    titleLine1: "LESS NOISE.",
    titleLine2: "MORE PRESENCE.",
    subtitle: "A discipline of perspective. Everyday foundational essentials engineered with uncompromised comfort, durability, and quiet architectural presence.",
    ctaPrimary: "Explore Releases",
    ctaSecondary: "Read The Manifesto",
    scrollText: "Scroll For Specification",
    specItems: [
      { label: "Current Release", value: "Drop 001: The Rove Polo" },
      { label: "Valuation Range", value: "PKR 2,299 — PKR 2,499" },
      { label: "Sizing Grading", value: "Medium & Large Custom Fit" },
    ],
    images: {
      leftFramed: {
        src: "/images/editorial-rocks.jpg",
        caption: "Drop 001 Editorial — Obsidian Solitude",
      },
      rightFramed: {
        src: "/images/editorial-wardrobe.jpg",
        caption: "Drop 001 Sanctuary — Quiet Confidence",
      },
    },
  },

  // --------------------------------------------------------------------------
  // 4. BRAND MANIFESTO SECTION
  // --------------------------------------------------------------------------
  manifesto: {
    title: "The Rove Manifesto",
    paragraph1:
      "ROVE is built on a singular belief: true luxury has no need to shout. We craft foundational everyday garments with uncompromised intent—where comfort meets durability, and subtlety commands attention.",
    paragraph2: "Stripped of excess, every stitch is calibrated to ground your movement and elevate your poise with quiet strength.",
    quote: "“It is not merely apparel; it is a discipline of perspective. Less noise. More presence.”",
    pillars: [
      { title: "Calm", subtitle: "Clarity in mind" },
      { title: "Perspective", subtitle: "Stay grounded" },
      { title: "Direction", subtitle: "Move with purpose" },
      { title: "Presence", subtitle: "Quiet confidence" },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. MULTI-DROP CATALOG (ADD CURRENT & FUTURE DROPS HERE OR VIA /admin)
  // --------------------------------------------------------------------------
  drops: [
    {
      id: "drop-001",
      badge: "Release 001 — Direct Allocation",
      name: "The Rove Horizon Polo",
      shippingNote: "Complimentary Express Courier Nationwide in Pakistan",
      shortDescription:
        "Engineered from luxury heavyweight 200 GSM PK cotton. Features bespoke laser-engraved matte black buttons, reinforced neck structure to prevent collar sag, and our signature asymmetrical right-sleeve three-line gold embroidery.",
      
      // Each drop can now contain any number of products/items, each with 2 photos, custom price, and specific size options!
      colors: [
        {
          id: "black",
          name: "Jet Black Obsidian",
          hex: "#0D0D0D",
          priceFormatted: "PKR 2,299",
          priceNumeric: 2299,
          frontImage: "/images/polo-black-front.jpg", // Image 1
          backImage: "/images/polo-black-back.jpg",   // Image 2
          caption: "Deep obsidian canvas with high-density gold horizon embroidery.",
          sizes: JSON.parse(JSON.stringify(standardTwoSizes)), // Exact measurements for Medium and Large!
        },
        {
          id: "sand",
          name: "Sand Beige Dune",
          hex: "#CDBFA6",
          priceFormatted: "PKR 2,499",
          priceNumeric: 2499,
          frontImage: "/images/polo-sand-front.jpg", // Image 1
          backImage: "/images/polo-sand-back.jpg",   // Image 2
          caption: "Tactile embossed texture inspired by wind-swept desert dunes.",
          sizes: JSON.parse(JSON.stringify(standardTwoSizes)), // Exact measurements for Medium and Large!
        },
      ],

      orderButtonText: "Place Direct Order",
      secondaryActionText: "Reserve Allocation Spot",
      guaranteeText: "Verified Cash on Delivery (COD) & Direct Studio Fulfillment across Pakistan.",

      accordions: [
        {
          id: "materials",
          title: "Fabric composition & structural feel",
          content:
            "Authored in premium 200 GSM PK structural cotton. Breathable enough for peak daytime heat while maintaining architectural poise. Pre-shrunk via enzyme bio-wash to ensure permanent sizing durability after repeated washing.",
        },
        {
          id: "hallmarks",
          title: "Signature hallmarks & embroidery",
          content:
            "Features our hallmark Horizon Rising 'R' logo embroidered in high-density metallic gold on the left chest. The right sleeve carries three distinct parallel gold bars—an asymmetrical signature of quiet distinction.",
        },
        {
          id: "care",
          title: "Garment care & protection codex",
          content:
            "Machine wash cold inside out with mild detergents on a gentle cycle. Hang dry in shade to protect natural structural elasticity and gold thread luster. Do not iron directly over embossed embroidery or engraved buttons.",
        },
      ],
    },
  ],

  // --------------------------------------------------------------------------
  // 6. CRAFT & ARCHITECTURAL DETAILS SECTION
  // --------------------------------------------------------------------------
  craft: {
    badge: "Uncompromising Craftsmanship",
    title: "An Anatomy of Quiet Poise",
    description:
      "Every millimeter of the Rove Polo is deliberately calculated. From bespoke matte hardware to signature right-sleeve gold embroidery, explore the tactile hallmarks that separate ephemeral trends from everyday heirlooms.",
    quote: "“We reject decorative chatter. Every gold thread and piped contour exists solely to enhance durability, structure, and the quiet assurance of the individual wearing it.”",
    items: [
      {
        title: "Three-Line Sleeve Signature",
        subtitle: "Right Arm Distinction",
        description: "Three bold gold lines meticulously embroidered exclusively on the right sleeve. An asymmetrical hallmark of intent and elevated presence.",
        image: "/images/detail-black-sleeve.jpg",
      },
      {
        title: "Slowing Dune Texture",
        subtitle: "Tactile Embossment",
        description: "A sophisticated, subtle embossed pattern inspired by wind-swept sand dunes. Visible when catching natural light, deeply felt in everyday wearing quality.",
        image: "/images/detail-sand-texture.jpg",
      },
      {
        title: "Matte Black Engraved Button",
        subtitle: "Custom Bespoke Hardware",
        description: "Custom matte black tactile buttons laser-engraved with the ROVE insignia. Set above reinforced woven neck tape designed to prevent collar droop over years of wear.",
        image: "/images/detail-black-button.jpg",
      },
      {
        title: "Gold Shoulder Piping",
        subtitle: "Architectural Lines",
        description: "Precision gold piping running gracefully from the collar edge along the shoulder seam—imbuing a regular fit with sharp, athletic architecture.",
        image: "/images/detail-sand-piping.jpg",
      },
      {
        title: "Horizon Mark Embroidery",
        subtitle: "Left Chest Insignia",
        description: "High-density gold embroidery on the left chest. The rising R emerging above the horizon line symbolizes perspective, confidence, and quiet momentum.",
        image: "/images/detail-black-logo.jpg",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 7. LOOKBOOK / GALLERY STRIP
  // --------------------------------------------------------------------------
  gallery: {
    badge: "Visual Compendium",
    title: "The Drop 001 Lookbook",
    images: [
      {
        src: "/images/editorial-rocks.jpg",
        title: "Obsidian on Dark Rock",
        caption: "Drop 001 Editorial — Jet Black Edition",
        aspect: "aspect-[3/4]",
        tag: "Editorial Campaign",
      },
      {
        src: "/images/editorial-wardrobe.jpg",
        title: "Sanctuary of Quiet Strength",
        caption: "Wardrobe Framing — Nothing More. Nothing Less.",
        aspect: "aspect-[3/4]",
        tag: "Lifestyle Portrait",
      },
      {
        src: "/images/spec-black.jpg",
        title: "Anatomy of Jet Black",
        caption: "Technical Blueprint & Hallmark Embroidery",
        aspect: "aspect-[2/3]",
        tag: "Specification Sheet",
      },
      {
        src: "/images/spec-sand.jpg",
        title: "Anatomy of Sand Dune",
        caption: "Embossed Texture & Shoulder Architecture",
        aspect: "aspect-[2/3]",
        tag: "Specification Sheet",
      },
      {
        src: "/images/brand-identity.jpg",
        title: "The Horizon Principle",
        caption: "Rove Brand Values & Typography Systems",
        aspect: "aspect-[2/3]",
        tag: "Brand Codex",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 8. ALLOCATION WAITLIST & NEWSLETTER SECTION
  // --------------------------------------------------------------------------
  waitlist: {
    badge: "Drop 001 & Future Releases",
    title: "Join The Private Allocation List",
    description:
      "Our productions are intentional and limited. Register your email to gain priority notification and secure access before future seasonal releases open to the public.",
    buttonText: "Request Access",
    privacyNote: "Strictly zero spam. Private data architecture. Unsubscribe anytime.",
  },

  // --------------------------------------------------------------------------
  // 9. FOOTER SECTION
  // --------------------------------------------------------------------------
  footer: {
    slogan: "Less Noise. More Presence.",
    aboutText: "An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction.",
    copyrightText: `© ${new Date().getFullYear()} ROVE Presence. Crafted with intention for everyday essentials. All rights reserved.`,
    instagramUrl: "https://instagram.com",
    inquiries: [
      { label: "Press & Editorial", email: "press@rovepresence.com" },
      { label: "Client Services", email: "support@rovepresence.com" },
      { label: "Bespoke Fitting", email: "concierge@rovepresence.com" },
    ],
  },
};
