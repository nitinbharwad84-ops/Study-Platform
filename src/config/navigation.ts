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
  requiredPermission?: import("@/lib/auth/permissions").PermissionKey;
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
        requiredPermission: "can_manage_users",
      },
      {
        title: "Approved Emails",
        href: "/admin/approved-emails",
        icon: MailPlus,
        requiredPermission: "can_manage_users",
      },
      {
        title: "Admins",
        href: "/admin/admins",
        icon: ShieldCheck,
        requiredPermission: "can_manage_admins",
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
        requiredPermission: "can_manage_subjects",
      },
      {
        title: "MCQ Content",
        href: "/admin/mcq-content",
        icon: Database,
        requiredPermission: "can_manage_content",
      },
      {
        title: "Long Answer Content",
        href: "/admin/long-answer-content",
        icon: FileArchive,
        badge: "Coming Soon",
        disabled: true,
        requiredPermission: "can_manage_content",
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
        requiredPermission: "can_manage_providers",
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        requiredPermission: "can_view_analytics",
      },
      {
        title: "Audit Logs",
        href: "/admin/audit",
        icon: ScrollText,
        requiredPermission: "can_view_audit_logs",
      },
      {
        title: "Password Resets",
        href: "/admin/password-resets",
        icon: KeyRound,
        requiredPermission: "can_approve_resets",
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
