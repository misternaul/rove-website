// ============================================================================
// ROVE STUDIO CODEX — MAIN CONTENT & CONFIGURATION FILE
// ============================================================================
// Edit this file to instantly change any text, prices, images, or settings
// across your live website! When you save and push to GitHub, Vercel will
// automatically re-build and publish your updates within seconds.
// ============================================================================

export const siteContent = {
  // --------------------------------------------------------------------------
  // 1. GENERAL BRAND & SEO SETTINGS
  // --------------------------------------------------------------------------
  brand: {
    name: "ROVE",
    tagline: "Less Noise. More Presence.",
    description:
      "An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction.",
    logoText: "ROVE",
    logoIconImage: "/images/logo-icon.jpg",
    founderEmail: "orders@rovepresence.com", // Your admin email to receive orders! (Configured in /api/order)
    defaultCurrency: "PKR",
  },

  // --------------------------------------------------------------------------
  // 2. NAVIGATION BAR
  // --------------------------------------------------------------------------
  nav: {
    links: [
      { name: "Manifesto", href: "#manifesto" },
      { name: "The Polo", href: "#showcase" },
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
    subtitle:
      "A discipline of perspective. Everyday foundational essentials engineered with uncompromised comfort, durability, and quiet architectural presence.",
    ctaPrimary: "Explore The Polo",
    ctaSecondary: "Read The Manifesto",
    scrollText: "Scroll For Specification",
    specItems: [
      { label: "Edition", value: "Drop 001: The Rove Polo" },
      { label: "Composition", value: "200 GSM Premium PK Cotton" },
      { label: "Palette", value: "Obsidian Black / Sand Dune" },
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
    paragraph2:
      "Stripped of excess, every stitch is calibrated to ground your movement and elevate your poise with quiet strength.",
    quote:
      "“It is not merely apparel; it is a discipline of perspective. Less noise. More presence.”",
    pillars: [
      { title: "Calm", subtitle: "Clarity in mind" },
      { title: "Perspective", subtitle: "Stay grounded" },
      { title: "Direction", subtitle: "Move with purpose" },
      { title: "Presence", subtitle: "Quiet confidence" },
    ],
  },

  // --------------------------------------------------------------------------
  // 5. PRODUCT SHOWCASE (THE POLO) & PKR PRICING
  // --------------------------------------------------------------------------
  product: {
    badge: "Release 001 — Direct Allocation",
    name: "The Rove Horizon Polo",
    // YOU CAN EDIT THE PKR PRICE RIGHT HERE:
    priceFormatted: "PKR 14,500",
    priceNumeric: 14500,
    shippingNote: "Complimentary Express Courier Nationwide in Pakistan",
    shortDescription:
      "Engineered from luxury heavyweight 200 GSM PK cotton. Features bespoke laser-engraved matte black buttons, reinforced neck structure to prevent collar sag, and our signature asymmetrical right-sleeve three-line gold embroidery.",
    
    // Editable Colors and associated Image Paths
    colors: [
      {
        id: "black",
        name: "Jet Black Obsidian",
        hex: "#0D0D0D",
        frontImage: "/images/polo-black-front.jpg",
        backImage: "/images/polo-black-back.jpg",
        caption: "Deep obsidian canvas with high-density gold horizon embroidery.",
      },
      {
        id: "sand",
        name: "Sand Beige Dune",
        hex: "#CDBFA6",
        frontImage: "/images/polo-sand-front.jpg",
        backImage: "/images/polo-sand-back.jpg",
        caption: "Tactile embossed texture inspired by wind-swept desert dunes.",
      },
    ],

    // Editable Sizing (Add or adjust sizes here!)
    sizes: [
      { id: "S / M", name: "Small / Medium", details: "Chest: 40\" | Length: 28\" | Shoulder: 17.5\"" },
      { id: "M / L", name: "Medium / Large", details: "Chest: 42.5\" | Length: 29.5\" | Shoulder: 18.5\"" },
      { id: "L / XL", name: "Large / X-Large", details: "Chest: 45\" | Length: 31\" | Shoulder: 19.5\"" },
    ],

    orderButtonText: "Place Direct Order",
    secondaryActionText: "Reserve Allocation Spot",
    guaranteeText: "Verified Cash on Delivery (COD) & Direct Fulfillment across Pakistan. Easy size exchange policy.",
    
    // Accordion Technical Specifications
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

  // --------------------------------------------------------------------------
  // 6. CRAFT & ARCHITECTURAL DETAILS SECTION
  // --------------------------------------------------------------------------
  craft: {
    badge: "Uncompromising Craftsmanship",
    title: "An Anatomy of Quiet Poise",
    description:
      "Every millimeter of the Rove Polo is deliberately calculated. From bespoke matte hardware to signature right-sleeve gold embroidery, explore the tactile hallmarks that separate ephemeral trends from everyday heirlooms.",
    quote:
      "“We reject decorative chatter. Every gold thread and piped contour exists solely to enhance durability, structure, and the quiet assurance of the individual wearing it.”",
    items: [
      {
        title: "Three-Line Sleeve Signature",
        subtitle: "Right Arm Distinction",
        description:
          "Three bold gold lines meticulously embroidered exclusively on the right sleeve. An asymmetrical hallmark of intent and elevated presence.",
        image: "/images/detail-black-sleeve.jpg",
      },
      {
        title: "Slowing Dune Texture",
        subtitle: "Tactile Embossment",
        description:
          "A sophisticated, subtle embossed pattern inspired by wind-swept sand dunes. Visible when catching natural light, deeply felt in everyday wearing quality.",
        image: "/images/detail-sand-texture.jpg",
      },
      {
        title: "Matte Black Engraved Button",
        subtitle: "Custom Bespoke Hardware",
        description:
          "Custom matte black tactile buttons laser-engraved with the ROVE insignia. Set above reinforced woven neck tape designed to prevent collar droop over years of wear.",
        image: "/images/detail-black-button.jpg",
      },
      {
        title: "Gold Shoulder Piping",
        subtitle: "Architectural Lines",
        description:
          "Precision gold piping running gracefully from the collar edge along the shoulder seam—imbuing a regular fit with sharp, athletic architecture.",
        image: "/images/detail-sand-piping.jpg",
      },
      {
        title: "Horizon Mark Embroidery",
        subtitle: "Left Chest Insignia",
        description:
          "High-density gold embroidery on the left chest. The rising R emerging above the horizon line symbolizes perspective, confidence, and quiet momentum.",
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
    badge: "Drop 001 — Private Allocation",
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
    aboutText:
      "An independent label dedicated to everyday essentials engineered with calm, clarity, and uncompromising distinction.",
    copyrightText: `© ${new Date().getFullYear()} ROVE Presence. Crafted with intention for everyday essentials. All rights reserved.`,
    instagramUrl: "https://instagram.com",
    inquiries: [
      { label: "Press & Editorial", email: "press@rovepresence.com" },
      { label: "Client Services", email: "support@rovepresence.com" },
      { label: "Bespoke Fitting", email: "concierge@rovepresence.com" },
    ],
  },
};
