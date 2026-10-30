/**
 * The seven stages from brochure p.7 (VERIFIED_FROM_BROCHURE: names and order).
 * Activities and "typical deliverable" are EDITORIAL_PROPOSAL, described as typical and subject to
 * the proposal for each project, never as contractual guarantees.
 */
export type Stage = {
  id: string;
  name: string;
  summary: string;
  activities: string[];
  deliverable: string;
  /** Which artefact the stage stage displays. */
  artefact: "brief" | "wireframe" | "interface" | "integration" | "checklist" | "monitor" | "roadmap";
  you: string;
};

export const stages: Stage[] = [
  {
    id: "discover",
    name: "Discover",
    summary: "Understand the goals, the people involved and the systems already in place.",
    activities: ["Goals and success criteria", "Users and stakeholders", "Existing tools, data and constraints"],
    deliverable: "Brief and requirements map",
    artefact: "brief",
    you: "Share context and introduce the people who do the work.",
  },
  {
    id: "design",
    name: "Design",
    summary: "Shape user flows, information structure and interface concepts you can react to.",
    activities: ["User flows", "Information structure", "Interface concepts"],
    deliverable: "Experience direction or prototype",
    artefact: "wireframe",
    you: "Review flows and screens, and test them with real users where possible.",
  },
  {
    id: "develop",
    name: "Develop",
    summary: "Build components, data models and business rules in reviewable increments.",
    activities: ["Interface components", "Data models", "Business rules"],
    deliverable: "Working increments to review",
    artefact: "interface",
    you: "Try each increment and raise what feels wrong early.",
  },
  {
    id: "integrate",
    name: "Integrate",
    summary: "Connect applications, databases and third-party services where the project needs it.",
    activities: ["APIs and third-party services", "Data migration", "End-to-end testing"],
    deliverable: "Tested integrations, where scoped",
    artefact: "integration",
    you: "Arrange access to the systems that need connecting.",
  },
  {
    id: "deploy",
    name: "Deploy",
    summary: "Release carefully and confirm everything works where it will actually run.",
    activities: ["Release plan", "Validation in production", "Handover of access"],
    deliverable: "Release checklist and operational handoff",
    artefact: "checklist",
    you: "Confirm go-live timing and who receives access.",
  },
  {
    id: "maintain",
    name: "Maintain",
    summary: "Monitor, support and update the product if a support arrangement is agreed.",
    activities: ["Monitoring", "Updates and fixes", "Support requests"],
    deliverable: "Agreed support plan",
    artefact: "monitor",
    you: "Report issues and share how people are using it.",
  },
  {
    id: "scale",
    name: "Scale",
    summary: "Plan the next modules, users or capacity as the business changes.",
    activities: ["Usage review", "New modules and integrations", "Capacity planning"],
    deliverable: "Prioritised roadmap",
    artefact: "roadmap",
    you: "Decide which improvement matters most next.",
  },
];
