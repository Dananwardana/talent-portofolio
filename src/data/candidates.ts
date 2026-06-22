export type Candidate = {
  id: string;
  name: string;
  role: string;
  tags: string[];
  img: string;
  location: string;
  skill: string;
  experience: string;
  education: string;
  project: string;
  certification: string;
  activity: string;
};

export const CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Aldifa Zahrotul Aufar",
    role: "Frontend Developer",
    tags: ["open to work", "react"],
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    location: "Surakarta, Indonesia",
    skill: "React, TypeScript, TailwindCSS, Next.js",
    experience: "3 years · Frontend Developer at Datasea Solutions",
    education: "B.Sc Computer Science · Sebelas Maret University (3.98 GPA)",
    project: "24 projects · TalentZ UI, Inventory Dashboard, E-commerce SPA",
    certification: "7 certs · Meta Frontend, Google UX, AWS Cloud Practitioner",
    activity: "Active contributor · 120 GitHub stars · 5 talks",
  },
  {
    id: "2",
    name: "Danan Emwe",
    role: "UI/UX Designer",
    tags: ["open to work", "figma"],
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    location: "Yogyakarta, Indonesia",
    skill: "Figma, Framer, Webflow, Protopie, Adobe XD",
    experience: "4 years · Senior Designer at Studio Kavi",
    education: "B.Des Visual Communication · ISI Yogyakarta (3.75 GPA)",
    project: "31 projects · Banking app redesign, SaaS dashboard, Retail kiosk",
    certification: "5 certs · NN/g UX Master, Interaction Design Foundation",
    activity: "Dribbble 8k followers · Mentor at ADPList",
  },
  {
    id: "3",
    name: "Dodik Rima",
    role: "Backend Engineer",
    tags: ["open to work", "node.js"],
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
    location: "Bandung, Indonesia",
    skill: "Node.js, PostgreSQL, Redis, Docker, Go",
    experience: "5 years · Backend Lead at Fintek ID",
    education: "B.Sc Informatics · ITB (3.62 GPA)",
    project: "18 projects · Payment gateway, Realtime chat, Microservices",
    certification: "6 certs · AWS SA, Kubernetes CKA, MongoDB Pro",
    activity: "Open source maintainer · 2k npm downloads/week",
  },
  {
    id: "4",
    name: "Arimanyu RZ",
    role: "Full Stack Developer",
    tags: ["open to work", "react"],
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    location: "Jakarta, Indonesia",
    skill: "React, Node.js, GraphQL, Prisma, AWS",
    experience: "4 years · Full Stack at Tokopedia",
    education: "B.Sc Computer Science · Universitas Indonesia (3.80 GPA)",
    project: "22 projects · Marketplace, CRM, Logistics tracker",
    certification: "4 certs · AWS Developer, MongoDB, Scrum Master",
    activity: "Tech blogger · 50+ articles on Medium",
  },
  {
    id: "5",
    name: "Sarah Kim",
    role: "Data Scientist",
    tags: ["fresh grad", "python"],
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    location: "Surabaya, Indonesia",
    skill: "Python, Pandas, PyTorch, SQL, Tableau",
    experience: "1 year · ML Intern at Gojek",
    education: "M.Sc Data Science · NUS (3.90 GPA)",
    project: "12 projects · Demand forecasting, Churn model, NLP classifier",
    certification: "3 certs · Google Data Analytics, DeepLearning.AI",
    activity: "Kaggle Expert · 2 competition silver medals",
  },
  {
    id: "6",
    name: "Marco Tani",
    role: "Mobile Developer",
    tags: ["intern", "flutter"],
    img: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200",
    location: "Denpasar, Indonesia",
    skill: "Flutter, Dart, Kotlin, Swift, Firebase",
    experience: "1 year · Mobile Intern at Tiket.com",
    education: "B.Sc Software Engineering · Udayana University (3.55 GPA)",
    project: "9 projects · Travel app, Habit tracker, POS mobile",
    certification: "2 certs · Google Associate Android, Flutter Bootcamp",
    activity: "Indie hacker · 3 apps on Play Store",
  },
];

export const COMPARE_ROWS: { key: keyof Candidate; label: string }[] = [
  { key: "skill", label: "Skill" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "project", label: "Project" },
  { key: "certification", label: "Certification" },
  { key: "activity", label: "Activity" },
];
