import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Calendar,
  ClipboardCheck,
  User,
  Bell,
  LogOut,
  Home,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface StudentSidebarProps {
  studentName: string;
  studentInitials: string;
  admissionNumber: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSignOut: () => void;
}

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "results", label: "Results", icon: BookOpen },
  { id: "fees", label: "Fee Statement", icon: CreditCard },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "exams", label: "Exam Booking", icon: ClipboardCheck },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "profile", label: "My Profile", icon: User },
];

export function StudentSidebar({
  studentName,
  studentInitials,
  admissionNumber,
  activeTab,
  onTabChange,
  onSignOut,
}: StudentSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-6 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-display text-lg font-semibold text-primary">UniPortal</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">{studentInitials}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{studentName}</p>
            <p className="text-xs text-muted-foreground">{admissionNumber}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setMobileOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-md border"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebar}
      </aside>
    </>
  );
}
