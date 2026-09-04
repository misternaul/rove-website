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
  stockQuantity: number; // 👉 New: Track live inventory stock per size!
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  priceFormatted: string;
  priceNumeric: number;
  isDiscountActive?: boolean; // 👉 New: Toggle discounts on/off
  discountedPriceFormatted?: string; // 👉 New: Formatted discount price (e.g. "PKR 1,999")
  discountedPriceNumeric?: number; // 👉 New: Numeric discount price for calculations
  frontImage: string; // Image 1 (Front View)
  backImage: string;  // Image 2 (Back / Alternate View)
  caption: string;
  sizes: SizeOption[]; // Each individual product/colorway controls its own sizes, measurements, and stock!
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

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  seoDescription: string;
  content: string; // Markdown or plain text
  coverImage: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  title: string;
  caption: string;
  aspect: string;
  tag: string;
  showOnHome: boolean; // 👉 New: Admin can toggle which Lookbook images appear on Homepage
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
    images: GalleryImage[];
  };
  journal: {
    badge: string;
    title: string;
    posts: JournalPost[];
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
    stockQuantity: 50,
  },
  {
    id: "L",
    name: "Large",
    details: "Chest: 21\" | Length: 28.5\" | Shoulder: 18\"",
    stockQuantity: 50,
  },
];

export const siteContent: SiteConfig = {
  // --------------------------------------------------------------------------
  // 1. GENERAL BRAND, EMAIL & WHATSAPP SETTINGS
  // --------------------------------------------------------------------------
  brand: {
    name: "ROVE",
    tagline: "Less Noise. More Presence.",
    description: "An independent luxury apparel studio dedicated to everyday foundational attire, engineered with architectural calm, enduring structural resilience, and quiet distinction.",
    logoText: "ROVE",
    logoIconImage: "/images/logo-icon.jpg",
    founderEmail: "rovepresence@gmail.com",
    whatsappNumber: "923346758496", // Your verified Studio WhatsApp number
    web3formsAccessKey: "b0a8ee37-de57-4314-acee-4c65d60c8580", // Permanently embedded Web3Forms access key for rovepresence@gmail.com!
    defaultCurrency: "PKR",
  },

  // --------------------------------------------------------------------------
  // 2. NAVIGATION BAR
  // --------------------------------------------------------------------------
  nav: {
    links: [
      { name: "Manifesto", href: "/#manifesto" },
      { name: "Shop", href: "/shop" },
      { name: "Craftsmanship", href: "/craftsmanship" },
      { name: "Lookbook", href: "/lookbook" },
      { name: "Journal", href: "/journal" },
    ],
    ctaText: "Order Allocation",
  },

  // --------------------------------------------------------------------------
  // 3. HERO SECTION
  // --------------------------------------------------------------------------
  hero: {
    badge: "Release 001 — Essential Edition",
    titleLine1: "LESS NOISE.",
    titleLine2: "MORE PRESENCE.",
    subtitle: "A discipline of quiet confidence. Foundational everyday attire engineered with uncompromising structural comfort, enduring resilience, and effortless architectural poise.",
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
        src: "/images/editorial-rocks.png",
        caption: "Drop 001 Editorial — Obsidian Solitude",
      },
      rightFramed: {
        src: "/images/editorial-wardrobe.png",
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
      "ROVE is built upon a singular, unwavering philosophy: true luxury has no need to shout. We craft foundational everyday garments with deliberate architectural intent—where uncompromised tactile comfort meets enduring resilience, and understated minimalism commands undivided attention.",
    paragraph2: "Stripped of superfluous decoration and ephemeral noise, every stitch is precisely calibrated to structure your silhouette, ground your daily motion, and accompany your pursuits with quiet composure.",
    quote: "“It is not merely apparel; it is a discipline of perspective. Less noise. More presence.”",
    pillars: [
      { title: "Calm", subtitle: "Clarity of mind" },
      { title: "Perspective", subtitle: "Grounded presence" },
      { title: "Direction", subtitle: "Intentional movement" },
      { title: "Presence", subtitle: "Quiet composure" },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. MULTI-DROP CATALOG (ADD CURRENT & FUTURE DROPS HERE OR VIA /admin)
  // --------------------------------------------------------------------------
  drops: [
    {
      id: "drop-001",
      badge: "Release 001 — Direct Studio Allocation",
      name: "The Rove Horizon Polo",
      shippingNote: "Complimentary Express Courier Nationwide Across Pakistan",
      shortDescription:
        "Authored from heavyweight 200 GSM bespoke structured PK cotton. Designed with reinforced structural collar geometry to permanently resist sagging, custom matte hardware, and our signature asymmetrical right-sleeve metallic gold embroidery.",
      
      colors: [
        {
          id: "black",
          name: "Jet Black Obsidian",
          hex: "#0D0D0D",
          priceFormatted: "PKR 2,299",
          priceNumeric: 2299,
          isDiscountActive: false,
          discountedPriceFormatted: "PKR 1,999",
          discountedPriceNumeric: 1999,
          frontImage: "/images/polo-black-front.png", // Image 1
          backImage: "/images/polo-black-back.png",   // Image 2
          caption: "Deep obsidian tactile cotton with high-density metallic gold horizon embroidery.",
          sizes: JSON.parse(JSON.stringify(standardTwoSizes)), // Exact measurements for Medium and Large!
        },
        {
          id: "sand",
          name: "Sand Beige Dune",
          hex: "#CDBFA6",
          priceFormatted: "PKR 2,499",
          priceNumeric: 2499,
          isDiscountActive: false,
          discountedPriceFormatted: "PKR 2,199",
          discountedPriceNumeric: 2199,
          frontImage: "/images/polo-sand-front.png", // Image 1
          backImage: "/images/polo-sand-back.png",   // Image 2
          caption: "Earthy tactile tone inspired by architectural desert minerals and warm sandstone.",
          sizes: JSON.parse(JSON.stringify(standardTwoSizes)), // Exact measurements for Medium and Large!
        },
      ],

      orderButtonText: "Add to Cart Allocation", // Changed text for the Cart flow
      secondaryActionText: "Reserve Allocation Spot",
      guaranteeText: "Verified Cash on Delivery (COD) & Priority Direct Studio Fulfillment across all cities in Pakistan.",

      accordions: [
        {
          id: "materials",
          title: "Fabric composition & structural feel",
          content:
            "Authored in premium 200 GSM structural PK cotton. Engineered to remain naturally breathable through peak daytime warmth while holding a sharp, architectural drape. Pre-shrunk via organic enzyme bio-wash to guarantee permanent structural sizing after repeated wear.",
        },
        {
          id: "hallmarks",
          title: "Signature hallmarks & embroidery",
          content:
            "Showcases our hallmark Horizon Rising 'R' logo embroidered in high-density metallic gold thread on the left chest. The right sleeve carries three bold parallel gold bars—an unmistakable, asymmetrical emblem of quiet distinction.",
        },
        {
          id: "care",
          title: "Garment care & protection codex",
          content:
            "Machine wash cold inside out with gentle detergents on a delicate cycle. Hang dry in shade to preserve natural fiber resilience and metallic gold luster. Do not iron directly over raised embroidery or hardware.",
        },
      ],
    },
  ],

  // --------------------------------------------------------------------------
  // 6. CRAFT & ARCHITECTURAL DETAILS SECTION
  // --------------------------------------------------------------------------
  craft: {
    badge: "Architectural Hallmarks & Detail",
    title: "An Anatomy of Quiet Poise",
    description:
      "Every millimeter of the Rove Polo is calculated with intentional precision. From structured rib-knit collar architecture to our hallmark metallic gold threadwork, discover the tangible execution that elevates everyday attire into enduring essentials.",
    quote: "“We reject decorative chatter. Every gold thread and piped contour exists solely to enhance durability, form structure, and amplify the quiet assurance of the individual wearing it.”",
    items: [
      {
        title: "Three-Line Sleeve Signature",
        subtitle: "Right Arm Distinction",
        description: "Three parallel metallic gold bars meticulously embroidered on the right sleeve. An asymmetrical architectural hallmark of unwavering focus and elevated presence.",
        image: "/images/detail-black-sleeve.png",
      },
      {
        title: "Back Wordmark Embroidery",
        subtitle: "Tactile Embossment",
        description: "High-density gold wordmark precisely positioned below the rear neckline. A subtle, permanent hallmark of structural integrity and modern minimalism.",
        image: "/images/detail-back-wordmark.png",
      },
      {
        title: "Horizon Mark Insignia",
        subtitle: "Left Chest Emblem",
        description: "High-density gold embroidery resting on the left chest. The rising R emerging above the horizon line embodies grounded clarity, self-assurance, and steady momentum.",
        image: "/images/detail-sand-logo.png",
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
        id: "img-1",
        src: "/images/editorial-rocks.png",
        title: "Obsidian on Mineral Rock",
        caption: "Drop 001 Editorial Campaign — Jet Black Edition",
        aspect: "aspect-[3/4]",
        tag: "Editorial Campaign",
        showOnHome: true,
      },
      {
        id: "img-2",
        src: "/images/editorial-wardrobe.png",
        title: "Sanctuary of Quiet Strength",
        caption: "Architectural Wardrobe Framing — Nothing More, Nothing Less",
        aspect: "aspect-[3/4]",
        tag: "Lifestyle Portrait",
        showOnHome: true,
      },
      {
        id: "img-3",
        src: "/images/editorial-detail.png",
        title: "Textile Architecture",
        caption: "Embossed Weave Structure & Engineered Shoulder Seams",
        aspect: "aspect-[3/4]",
        tag: "Macro Texture",
        showOnHome: true,
      },
      {
        id: "img-4",
        src: "/images/editorial-acessories.png",
        title: "The Horizon Principle",
        caption: "Rove Design Systems & Minimalist Brand Codex",
        aspect: "aspect-[3/4]",
        tag: "Design Codex",
        showOnHome: false,
      },
      {
        id: "img-5",
        src: "/images/editorial-packaging.png",
        title: "Bespoke Studio Presentation",
        caption: "Elevated Unboxing Experience & Sustainable Protection",
        aspect: "aspect-[3/4]",
        tag: "Studio Packaging",
        showOnHome: false,
      },
    ],
  },
  
  // --------------------------------------------------------------------------
  // 8. JOURNAL / BLOG POSTS
  // --------------------------------------------------------------------------
  journal: {
    badge: "ROVE Journal",
    title: "Design Philosophy & Studio Notes",
    posts: [
      {
        id: "post-1",
        slug: "the-art-of-less-noise",
        title: "The Art of Less Noise: Engineering the Everyday Uniform",
        date: "October 14, 2026",
        seoDescription: "An exploration into Rove's design philosophy and why we believe true luxury doesn't need to shout.",
        content: "We founded ROVE on a singular premise: the modern wardrobe is too loud. Fast fashion creates a relentless cycle of consumption and disposable design, while logomania turns individuals into walking billboards.\n\nOur approach is different. We believe in clothing as architecture—a quiet, structural foundation that allows the individual wearing it to be the focal point, not the garment itself.\n\nBy prioritizing uncompromised fabrics, obsessive stitching techniques, and a timeless silhouette, we are engineering everyday uniforms meant to be worn, lived in, and relied upon.",
        coverImage: "/images/editorial-rocks.png",
      }
    ],
  },

  // --------------------------------------------------------------------------
  // 8. ALLOCATION WAITLIST & NEWSLETTER SECTION
  // --------------------------------------------------------------------------
  waitlist: {
    badge: "Drop 001 & Future Studio Releases",
    title: "Join The Private Allocation List",
    description:
      "Our production runs are intentional, highly disciplined, and strictly limited in number. Register your email to secure priority notice and guaranteed early allocation access before future seasonal releases open to the public.",
    buttonText: "Request Access",
    privacyNote: "Strictly zero spam. Encrypted studio data architecture. Unsubscribe anytime.",
  },

  // --------------------------------------------------------------------------
  // 9. FOOTER SECTION
  // --------------------------------------------------------------------------
  footer: {
    slogan: "Less Noise. More Presence.",
    aboutText: "An independent luxury apparel label dedicated to foundational everyday attire, engineered with architectural calm, structural clarity, and uncompromising distinction.",
    copyrightText: `© ${new Date().getFullYear()} ROVE Presence. Engineered with intention for everyday essentials. All rights reserved.`,
    instagramUrl: "https://instagram.com/rovepresence",
    inquiries: [
      { label: "Press & Editorial", email: "rovepresence@gmail.com" },
      { label: "Client Services", email: "rovepresence@gmail.com" },
      { label: "Bespoke Fitting", email: "rovepresence@gmail.com" },
    ],
  },
};
