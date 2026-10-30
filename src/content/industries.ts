import type { SolutionSlug } from "./solutions";

/**
 * Business contexts drawn from brochure pp.3 and 6 (hotel/PMS, school/college, hospital/healthcare,
 * restaurant, billing, inventory, logistics, e-commerce). These are POSSIBLE solution areas, not
 * claimed client sectors. "Professional services" is an editorial extrapolation (marked).
 * Workstation modules are ILLUSTRATIVE_DEMO content.
 */
export type Industry = {
  id: string;
  name: string;
  brochure: string;
  context: string;
  systems: string[];
  /** Modules shown on the reconfiguring workstation, with a sample status line. */
  modules: { name: string; sample: string }[];
  solutions: SolutionSlug[];
  caution?: string;
  proposal?: boolean;
};

export const industries: Industry[] = [
  {
    id: "retail-ecommerce",
    name: "Retail & e-commerce",
    brochure: "E-commerce, payment solutions, billing & inventory (p.6)",
    context: "Products, orders and payments have to agree with the stock on the shelf and the numbers in the accounts.",
    systems: ["Online store with customer accounts", "Order and inventory management", "Payment gateway integration", "Sales reports"],
    modules: [
      { name: "Catalogue", sample: "214 products · 6 low stock" },
      { name: "Orders", sample: "18 to pack today" },
      { name: "Payments", sample: "Settlements reconciled" },
      { name: "Reports", sample: "Weekly sales by category" },
    ],
    solutions: ["web-development", "custom-software", "digital-marketing"],
  },
  {
    id: "hospitality",
    name: "Hospitality & restaurants",
    brochure: "Hotel / PMS, restaurant management (pp.3, 6)",
    context: "Rooms, tables and orders change by the minute, and front desk, kitchen and management need the same picture.",
    systems: ["Booking and availability", "Property / restaurant management", "Billing", "Guest communication"],
    modules: [
      { name: "Reservations", sample: "12 arrivals · 3 late check-outs" },
      { name: "Tables & orders", sample: "9 open orders" },
      { name: "Housekeeping", sample: "7 rooms to turn over" },
      { name: "Billing", sample: "Day close in progress" },
    ],
    solutions: ["custom-software", "mobile-apps", "web-development"],
  },
  {
    id: "education",
    name: "Education",
    brochure: "School / college management, education management (pp.3, 6)",
    context: "Admissions, timetables, fees and parent communication often live in separate registers and spreadsheets.",
    systems: ["Admissions and student records", "Fee billing", "Timetables and attendance", "Parent and student communication"],
    modules: [
      { name: "Admissions", sample: "26 applications to review" },
      { name: "Attendance", sample: "Grade 8 · 94% today" },
      { name: "Fees", sample: "Term invoices issued" },
      { name: "Messages", sample: "Circular scheduled for 4 pm" },
    ],
    solutions: ["custom-software", "mobile-apps"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    brochure: "Hospital / healthcare systems, healthcare management (pp.3, 6)",
    context: "Appointments, schedules and administrative workflows need to be dependable and access-controlled.",
    systems: ["Appointment scheduling", "Administrative workflows", "Billing", "Role-based access"],
    modules: [
      { name: "Appointments", sample: "OPD · 41 booked" },
      { name: "Schedules", sample: "Rota published for next week" },
      { name: "Billing", sample: "Pending insurance paperwork: 5" },
      { name: "Access", sample: "Roles reviewed monthly" },
    ],
    solutions: ["custom-software", "business-automation"],
    caution:
      "Healthcare software can carry legal and regulatory obligations. Any clinical-record or compliance requirement is defined in discovery; nothing here implies certification.",
  },
  {
    id: "logistics",
    name: "Logistics & inventory",
    brochure: "Logistics & inventory, inventory systems (pp.3, 6)",
    context: "Stock moves between vendors, warehouses and customers, and everyone asks where things are.",
    systems: ["Stock and warehouse management", "Vendor management", "Dispatch tracking", "Operational reporting"],
    modules: [
      { name: "Stock", sample: "3 SKUs below reorder level" },
      { name: "Vendors", sample: "2 purchase orders awaiting approval" },
      { name: "Dispatch", sample: "11 shipments in transit" },
      { name: "Visibility", sample: "Live status shared with customers" },
    ],
    solutions: ["custom-software", "business-automation", "mobile-apps"],
  },
  {
    id: "professional-services",
    name: "Professional services",
    brochure: "Editorial example built from CRM, billing and automation lines (p.6)",
    context: "Leads, proposals, approvals and invoices pass through many hands before work is delivered and paid.",
    systems: ["CRM and lead pipeline", "Proposal and approval workflow", "Billing", "Client portal"],
    modules: [
      { name: "Pipeline", sample: "8 leads awaiting first reply" },
      { name: "Approvals", sample: "2 proposals with a partner" },
      { name: "Billing", sample: "Retainers invoiced on the 1st" },
      { name: "Client portal", sample: "Documents shared securely" },
    ],
    solutions: ["custom-software", "business-automation", "digital-marketing"],
    proposal: true,
  },
];
