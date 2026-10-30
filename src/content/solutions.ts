/**
 * The six services, exactly as the owner listed them (OWNER_STATED, 2026-10-29): Website building, Mobile
 * application, Custom software (ERP & CRM), Business automation, Digital marketing (Meta Ads, SEO),
 * Enterprise platform. Capability lines for websites, mobile, software, automation and enterprise come from
 * the brochure (VERIFIED_FROM_BROCHURE); Digital marketing lines are EDITORIAL_PROPOSAL pending owner
 * confirmation. No prices are published (owner instruction): plans are named only. No outcomes are claimed.
 */

export type SolutionSlug = "web-development" | "mobile-apps" | "custom-software" | "business-automation" | "digital-marketing" | "enterprise-platforms";
export type PreviewKind = "web" | "mobile" | "software" | "automation" | "marketing" | "enterprise";

export type Solution = {
  slug: SolutionSlug;
  name: string;
  /** Label used in navigation and compact lists. */
  short: string;
  preview: PreviewKind;
  /** One-line pitch (home showcase, mega-menu). */
  pitch: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lede: string;
  /** Who usually needs this (buyer situations, not claims). */
  needs: string[];
  /** What it can include: brochure capability lines. */
  capabilities: string[];
  /** Questions that shape scope and price. */
  scopeQuestions: string[];
  faqs: { q: string; a: string }[];
  cta: string;
  /** Pricing track on /pricing, if the brochure prices it. */
  track?: "websites" | "software" | "enterprise";
  /** Enquiry form service value. */
  inquiry: string;
};

export const solutions: Solution[] = [
  {
    slug: "web-development",
    name: "Website Building",
    short: "Websites",
    preview: "web",
    pitch: "A digital presence built to be useful, credible and ready to grow.",
    metaTitle: "Website & E-commerce Development",
    metaDescription:
      "Business websites, e-commerce stores and web applications: responsive design, enquiry and booking flows, content management and integrations, in Basic, Standard and Premium plans.",
    h1: "Websites that make the right first impression, and support what comes next.",
    lede: "From a focused five-page site to an online store or a web application with its own backend: structured around what your customers need to find, do and ask.",
    needs: [
      "You need a credible online presence that explains what you offer.",
      "Enquiries arrive by phone and message, and you want a clearer path to contact or book.",
      "You want to sell online with products, orders, customer accounts and stock in one place.",
      "Your site has outgrown pages and needs logins, dashboards or connected data.",
    ],
    capabilities: [
      "Responsive design",
      "Contact, enquiry and booking forms",
      "WhatsApp / call integration",
      "Business email setup",
      "SEO optimisation",
      "Analytics integration",
      "Dynamic content and API integration",
      "User login and management",
      "Complete e-commerce: products, orders, customer accounts, inventory",
      "Reports & analytics",
    ],
    scopeQuestions: [
      "How many pages, and who will update them after launch?",
      "Do visitors only read, or also book, buy, register or log in?",
      "Which systems should the site talk to (payments, email, CRM, inventory)?",
      "Do you have brand assets, copy and photography, or do they need creating?",
    ],
    faqs: [
      {
        q: "Which website plan is right for us?",
        a: "Start from what visitors must be able to do. We will recommend Basic, Standard or Premium once we understand your pages, features and integrations, and confirm the details in a written proposal.",
      },
      {
        q: "Are domain, hosting and third-party fees included?",
        a: "Not assumed. What is included is set out in the proposal for your project.",
      },
      {
        q: "Can the site grow into a web application later?",
        a: "Yes, if it is planned for. We will say early whether your roadmap needs an application foundation from the start.",
      },
    ],
    cta: "Discuss a website",
    track: "websites",
    inquiry: "website",
  },
  {
    slug: "mobile-apps",
    name: "Mobile Applications",
    short: "Mobile apps",
    preview: "mobile",
    pitch: "Focused experiences for people on the move.",
    metaTitle: "Android & iOS App Development",
    metaDescription:
      "Android and iOS applications planned around one or two core journeys: user flows, interface design, backend and API integration, notifications and release preparation.",
    h1: "Mobile applications designed for the way people actually use them.",
    lede: "An app earns its place on a phone by doing one job well. We plan the journey first, then the screens, the backend it depends on and the release.",
    needs: [
      "Customers want to book, order or manage an account from their phone.",
      "Field or front-line teams rely on paper, photos and phone calls.",
      "An existing app is hard to change or hard to use.",
      "You are unsure whether you need a native app, a cross-platform app or a web app.",
    ],
    capabilities: [
      "Android applications",
      "iOS applications",
      "User accounts and authentication",
      "Notifications",
      "Backend and API integration",
      "Admin dashboard for the team behind the app",
      "Analytics",
    ],
    scopeQuestions: [
      "Which one or two journeys must work perfectly on day one?",
      "Android, iOS or both, and does it need to work offline?",
      "What does the app read from or write to (bookings, orders, records)?",
      "Who manages content and users behind the app?",
    ],
    faqs: [
      {
        q: "How is a mobile app scoped?",
        a: "By journeys, platforms and the backend the app depends on, rather than by screen count. You receive a written proposal once the core journeys are agreed.",
      },
      {
        q: "Native or cross-platform?",
        a: "Cross-platform suits most business apps; some features need native code. We recommend based on features, budget and who will maintain it, and explain the trade-off.",
      },
    ],
    cta: "Plan a mobile app",
    track: "software",
    inquiry: "mobile",
  },
  {
    slug: "custom-software",
    name: "Custom Software: ERP & CRM",
    short: "Custom software",
    preview: "software",
    pitch: "Systems shaped around your processes, not the other way around.",
    metaTitle: "Custom Business Software, ERP & CRM",
    metaDescription:
      "Custom business applications, CRM and ERP modules, billing, inventory and employee management with role-based access, dashboards and integrations.",
    h1: "Software that follows your business, not a template.",
    lede: "When spreadsheets and disconnected tools hold the business together, a custom application gives orders, customers, stock, billing and people one shared source of truth.",
    needs: [
      "Operations run on spreadsheets, email threads and copy-paste.",
      "Different teams keep different versions of the same customer or order.",
      "Off-the-shelf software forces your process into its shape.",
      "Reporting means assembling numbers by hand.",
    ],
    capabilities: [
      "Web application with custom backend",
      "Database architecture",
      "Admin dashboards",
      "User management and role-based access",
      "Customer, employee and vendor management",
      "Inventory, billing & finance modules",
      "CRM / ERP modules",
      "Workflow automation",
      "Reports & analytics",
      "Payment and API integrations",
      "Cloud deployment, backup & recovery",
    ],
    scopeQuestions: [
      "Which process costs the most time today, and who touches it?",
      "Which records (customers, products, orders, staff) must be shared between teams?",
      "Which existing tools must stay, and exchange data with the new system?",
      "How many users, in how many roles?",
    ],
    faqs: [
      {
        q: "Do we need ERP, CRM or both?",
        a: "CRM centres on customers, enquiries and follow-up; ERP on stock, billing, purchasing and people. Many businesses need parts of both on one data model, and we usually start with the module that removes the most manual work.",
      },
      {
        q: "Can we start with one module?",
        a: "Yes. Starting with the module that removes the most manual work, then adding others on the same data model, is often the safer path.",
      },
    ],
    cta: "Map your workflow",
    track: "software",
    inquiry: "custom-software",
  },
  {
    slug: "business-automation",
    name: "Business Automation",
    short: "Automation",
    preview: "automation",
    pitch: "Repetitive work handled automatically, with people in control.",
    metaTitle: "Business Automation & Workflow Automation",
    metaDescription:
      "Business workflow automation with review points: request intake, routing, approvals, reminders, document handling and reports, with AI-assisted steps where they genuinely help.",
    h1: "Automation with a clear job to do.",
    lede: "Good automation is specific: a named task, a defined input, rules that decide, a person who checks what matters, and a record of what happened.",
    needs: [
      "The same requests are sorted, copied and forwarded by hand every day.",
      "Approvals wait in inboxes and nobody can see where a request is.",
      "Reminders, follow-ups and reports depend on someone remembering.",
      "You want to use AI, but need it to be checkable and safe.",
    ],
    capabilities: [
      "Business workflow automation",
      "Approval and review steps",
      "Notifications and reminders",
      "AI-assisted steps where inputs are messy",
      "Business analytics",
      "API & third-party integrations",
    ],
    scopeQuestions: [
      "What exact task should be automated, and how often does it happen?",
      "Where must a person stay in the loop?",
      "What data is available, and who may it be shared with?",
      "How will we know the automation is working, and what happens when it is unsure?",
    ],
    faqs: [
      {
        q: "Do we need AI or just automation?",
        a: "Often rules are enough. We use AI where inputs are messy (free text, documents) and keep a human decision wherever errors would matter.",
      },
      {
        q: "How do you start?",
        a: "With a pilot on one workflow and a clear way to check results before anything runs unattended.",
      },
    ],
    cta: "Explore an automation",
    inquiry: "business-automation",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    short: "Digital marketing",
    preview: "marketing",
    pitch: "Meta Ads and SEO that bring the right people to what you have built.",
    metaTitle: "Digital Marketing: Meta Ads & SEO",
    metaDescription:
      "Meta Ads (Facebook and Instagram) campaign planning and management, conversion tracking, and search engine optimisation for business websites, with plain reporting.",
    h1: "Be found by the people already looking for you.",
    lede: "A good website or app still needs visitors. We plan Meta Ads campaigns and search optimisation around the customers you want and the actions that matter to your business, then report plainly on what is happening.",
    needs: [
      "Your website exists, but few of the right people find it.",
      "You have tried boosting posts without knowing what worked.",
      "You want enquiries or bookings, not just likes and impressions.",
      "Search results show competitors before you for what you offer.",
    ],
    capabilities: [
      "Meta Ads (Facebook & Instagram) campaign planning and management",
      "Audience targeting and retargeting",
      "Ad creative coordination",
      "Pixel and conversion tracking",
      "Technical and on-page SEO",
      "Local search visibility",
      "Plain monthly reporting",
    ],
    scopeQuestions: [
      "Who is the customer, and what should they do: call, book, buy or enquire?",
      "Which locations and languages matter?",
      "Is the website ready to measure enquiries and purchases?",
      "What has been tried before, and what was learned?",
    ],
    faqs: [
      {
        q: "Do you guarantee rankings or results?",
        a: "No. Nobody can honestly guarantee search rankings or ad results. We agree goals and measures with you, set up tracking so results are visible, and adjust based on what the numbers show.",
      },
      {
        q: "Who pays for the advertising itself?",
        a: "Advertising spend is paid to the platform and is separate from our service. How it is managed is agreed in the proposal.",
      },
    ],
    cta: "Plan your marketing",
    inquiry: "digital-marketing",
  },
  {
    slug: "enterprise-platforms",
    name: "Enterprise Platforms",
    short: "Enterprise",
    preview: "enterprise",
    pitch: "Coordinated technology for more demanding organisations.",
    metaTitle: "Enterprise Platform Development",
    metaDescription:
      "Enterprise platforms combining web and mobile applications, custom backend, CRM/ERP, automation, analytics, security, backup and long-term maintenance.",
    h1: "Technology built for organisations with more moving parts.",
    lede: "When several departments, applications and data sources must work as one, the architecture matters as much as the screens. We plan the layers, then build them in phases.",
    needs: [
      "Departments run separate systems that should share customers, products or people.",
      "Growth has made access control, auditing and reporting harder.",
      "You need web, mobile and internal applications on one backend.",
      "You want a long-term technology partner rather than a one-off build.",
    ],
    capabilities: [
      "Website, web application and mobile app",
      "Custom backend and database",
      "Database maintenance",
      "Cloud infrastructure",
      "CRM / ERP",
      "AI / ML",
      "Automation and analytics",
      "Security, backup & recovery",
      "API ecosystem",
      "Technical support and long-term maintenance",
    ],
    scopeQuestions: [
      "Which departments and roles use the platform, and how many people?",
      "Which existing systems stay, which are replaced, and in what order?",
      "What are the security, audit and data-residency expectations?",
      "What level of support and maintenance is needed after launch?",
    ],
    faqs: [
      {
        q: "What separates an enterprise platform from a large website?",
        a: "A large website is one product. An enterprise platform combines several applications, a shared backend, integrations and long-term support across departments.",
      },
      {
        q: "Is a dedicated tech team available?",
        a: "It can be arranged for larger platforms. Terms are agreed in the proposal.",
      },
    ],
    cta: "Discuss enterprise scope",
    track: "enterprise",
    inquiry: "enterprise",
  },
];

export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug);

/** The four categories on the protected home hero, with the labels from the approved design. */
export const heroCategories: { slug: SolutionSlug; label: string; tagline: string }[] = [
  { slug: "web-development", label: "Websites", tagline: "Modern & scalable web experiences" },
  { slug: "mobile-apps", label: "Mobile Apps", tagline: "Engaging and user-friendly apps" },
  { slug: "custom-software", label: "Business Software", tagline: "Custom systems for real growth" },
  { slug: "business-automation", label: "Business Automation", tagline: "Smarter workflows, less manual work" },
  { slug: "digital-marketing", label: "Digital Marketing", tagline: "Meta Ads and SEO that bring the right people" },
  { slug: "enterprise-platforms", label: "Enterprise Platforms", tagline: "Departments working as one" },
];

/** The owner's service list (OWNER_STATED 2026-10-29), with what each covers. */
export const serviceList: { name: string; solution: SolutionSlug; covers: string }[] = [
  { name: "Website Building", solution: "web-development", covers: "Business websites, e-commerce and web applications" },
  { name: "Mobile Applications", solution: "mobile-apps", covers: "Android and iOS apps with the backend they depend on" },
  { name: "Custom Software: ERP & CRM", solution: "custom-software", covers: "Customers, stock, billing and people in one system" },
  { name: "Business Automation", solution: "business-automation", covers: "Workflows, approvals and reminders that run themselves" },
  { name: "Digital Marketing", solution: "digital-marketing", covers: "Meta Ads and SEO" },
  { name: "Enterprise Platforms", solution: "enterprise-platforms", covers: "Several departments and applications as one" },
];

/** Brochure p.3: Website → Web App → Mobile App → Business Software → AI → Enterprise Platform. */
export const evolution: { id: string; label: string; solution: SolutionSlug; problem: string; example: string; capabilities: string[] }[] = [
  {
    id: "website",
    label: "Website",
    solution: "web-development",
    problem: "People can't find a clear, credible explanation of what you offer.",
    example: "A responsive site with services, enquiry form and WhatsApp/call contact.",
    capabilities: ["Responsive pages", "Contact & enquiry forms", "SEO & analytics"],
  },
  {
    id: "web-app",
    label: "Web app",
    solution: "web-development",
    problem: "Visitors need to do things, not just read: book, register, track.",
    example: "Logins, bookings and an admin view on a custom backend.",
    capabilities: ["User accounts", "Booking system", "Custom backend"],
  },
  {
    id: "mobile",
    label: "Mobile app",
    solution: "mobile-apps",
    problem: "Customers or staff need it in their pocket, often on the move.",
    example: "An Android/iOS app for one core journey, sharing the same data.",
    capabilities: ["Android & iOS", "Notifications", "API integration"],
  },
  {
    id: "business-software",
    label: "Business software",
    solution: "custom-software",
    problem: "Operations depend on spreadsheets and re-keyed data.",
    example: "Customers, stock, billing and staff in one role-based system.",
    capabilities: ["CRM / ERP modules", "Dashboards", "Role-based access"],
  },
  {
    id: "ai",
    label: "Business automation",
    solution: "business-automation",
    problem: "Repetitive sorting, routing and approvals consume the day.",
    example: "Requests classified and routed automatically, with a person approving.",
    capabilities: ["Workflow automation", "Approvals", "Audit trail"],
  },
  {
    id: "enterprise",
    label: "Enterprise platform",
    solution: "enterprise-platforms",
    problem: "Many departments and systems must behave as one organisation.",
    example: "Web, mobile and internal apps on one backend with shared security.",
    capabilities: ["API ecosystem", "Cloud infrastructure", "Long-term maintenance"],
  },
];
