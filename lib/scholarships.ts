export const scholarshipCategories = [
  "All opportunities",
  "STEM",
  "Leadership",
  "Creative",
  "Research",
] as const;

export type ScholarshipCategory = (typeof scholarshipCategories)[number];

export type Scholarship = {
  slug: string;
  title: string;
  provider: string;
  category: Exclude<ScholarshipCategory, "All opportunities">;
  award: string;
  deadline: string;
  location: string;
  summary: string;
  eligibility: string;
  initials: string;
  theme: string;
};

export const scholarships: Scholarship[] = [
  {
    slug: "bright-minds-stem",
    title: "Bright Minds STEM Scholarship",
    provider: "Mwangaza Education Fund",
    category: "STEM",
    award: "Up to KSh 120,000",
    deadline: "30 Nov 2026",
    location: "Kenya",
    summary: "A boost for curious students ready to turn big STEM ideas into real-world change.",
    eligibility: "Kenyan students entering or currently pursuing an undergraduate STEM degree.",
    initials: "BM",
    theme: "from-[#d9eccb] to-[#b5d59c]",
  },
  {
    slug: "next-generation-leaders",
    title: "Next Generation Leaders Award",
    provider: "The Jirani Initiative",
    category: "Leadership",
    award: "KSh 85,000",
    deadline: "15 Dec 2026",
    location: "East Africa",
    summary: "For young community builders who are already showing up and making a difference.",
    eligibility: "East African students aged 18–25 with a community project or leadership role.",
    initials: "JL",
    theme: "from-[#f4dbb9] to-[#eabc8a]",
  },
  {
    slug: "future-coders-grant",
    title: "Future Coders Grant",
    provider: "Code for Tomorrow",
    category: "STEM",
    award: "Up to KSh 60,000",
    deadline: "10 Jan 2027",
    location: "East Africa",
    summary: "Helping aspiring developers access the training, equipment, and education they need.",
    eligibility: "East African students studying computer science, software engineering, or IT.",
    initials: "CT",
    theme: "from-[#c9def4] to-[#9cbee5]",
  },
  {
    slug: "creative-voices-bursary",
    title: "Creative Voices Bursary",
    provider: "Imani Arts Collective",
    category: "Creative",
    award: "KSh 50,000",
    deadline: "31 Jan 2027",
    location: "Kenya",
    summary: "Backing the next generation of storytellers, designers, and cultural changemakers.",
    eligibility: "Kenyan students enrolled in design, film, music, visual arts, or communications.",
    initials: "IA",
    theme: "from-[#f0cbd2] to-[#e2a8b8]",
  },
  {
    slug: "community-research-fellowship",
    title: "Community Research Fellowship",
    provider: "Open Horizons Foundation",
    category: "Research",
    award: "Up to KSh 100,000",
    deadline: "15 Feb 2027",
    location: "East Africa",
    summary: "A little funding and a lot of encouragement for research rooted in local communities.",
    eligibility: "Undergraduate and postgraduate students conducting community-led research.",
    initials: "OH",
    theme: "from-[#e2d3f1] to-[#cbb3e3]",
  },
  {
    slug: "first-in-family-scholarship",
    title: "First in the Family Scholarship",
    provider: "Pamoja Student Trust",
    category: "Leadership",
    award: "Up to KSh 90,000",
    deadline: "28 Feb 2027",
    location: "Kenya",
    summary: "Making the path to higher education a little more possible for first-generation students.",
    eligibility: "Kenyan undergraduate applicants who will be the first in their family to attend university.",
    initials: "PT",
    theme: "from-[#f1e6ae] to-[#e4cf79]",
  },
];
