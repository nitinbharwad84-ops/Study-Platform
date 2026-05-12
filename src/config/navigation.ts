import {
  LayoutDashboard,
  FileQuestion,
  History,
  MessageSquare,
  MessagesSquare,
  FileText,
  Settings,
  Users,
  MailPlus,
  ShieldCheck,
  BookOpen,
  Database,
  FileArchive,
  Cpu,
  BarChart3,
  ScrollText,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const studentNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MCQ Exams",
    items: [
      {
        title: "Start Exam",
        href: "/mcq",
        icon: FileQuestion,
      },
      {
        title: "Exam History",
        href: "/mcq/history",
        icon: History,
      },
    ],
  },
  {
    label: "AI Learning",
    items: [
      {
        title: "AI Chat",
        href: "/chat",
        icon: MessageSquare,
        badge: "Coming Soon",
        disabled: true,
      },
      {
        title: "Chat History",
        href: "/chat/history",
        icon: MessagesSquare,
        badge: "Coming Soon",
        disabled: true,
      },
    ],
  },
  {
    label: "Subjective",
    items: [
      {
        title: "Long Answer",
        href: "/long-answer",
        icon: FileText,
        badge: "Coming Soon",
        disabled: true,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export const adminNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Approved Emails",
        href: "/admin/approved-emails",
        icon: MailPlus,
      },
      {
        title: "Admins",
        href: "/admin/admins",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Content",
    items: [
      {
        title: "Subjects",
        href: "/admin/subjects",
        icon: BookOpen,
      },
      {
        title: "MCQ Content",
        href: "/admin/mcq-content",
        icon: Database,
      },
      {
        title: "Long Answer Content",
        href: "/admin/long-answer-content",
        icon: FileArchive,
        badge: "Coming Soon",
        disabled: true,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "AI Providers",
        href: "/admin/providers",
        icon: Cpu,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Audit Logs",
        href: "/admin/audit",
        icon: ScrollText,
      },
      {
        title: "Password Resets",
        href: "/admin/password-resets",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];
