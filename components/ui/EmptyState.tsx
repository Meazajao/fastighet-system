import Link from "next/link";
import { Inbox, Search, Ticket, Users } from "lucide-react";

interface EmptyStateProps {
  icon?: "ticket" | "users" | "search" | "inbox";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const icons = {
  ticket: Ticket,
  users: Users,
  search: Search,
  inbox: Inbox,
};

export default function EmptyState({ icon = "inbox", title, description, action }: EmptyStateProps) {
  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center py-16 px-8 text-center gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "#f3f0ff" }}
      >
        <Icon size={28} color="#5e35b1" />
      </div>
      <div>
        <h3 className="text-[16px] font-bold text-text-primary m-0 mb-2 tracking-[-0.3px]">
          {title}
        </h3>
        <p className="text-[13px] text-text-muted m-0 max-w-[320px] leading-[1.6]">
          {description}
        </p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="mt-1 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold no-underline hover:opacity-90 transition-opacity"
          style={{
            background: "linear-gradient(135deg, #5e35b1, #7c4dff)",
            boxShadow: "0 4px 12px rgba(94,53,177,0.3)",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}