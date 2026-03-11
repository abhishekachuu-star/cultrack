import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession } from "@/utils/session";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Shield, Star, Trophy } from "lucide-react";

const roleBadgeClass: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  student: "bg-blue-100 text-blue-700 border-blue-200",
  teacher: "bg-green-100 text-green-700 border-green-200",
  judge: "bg-purple-100 text-purple-700 border-purple-200",
};

const roleEmoji: Record<string, string> = {
  admin: "🛡️",
  student: "🎓",
  teacher: "📚",
  judge: "⚖️",
};

export default function DashboardPage() {
  const session = getSession();
  if (!session) return null;

  const cards = [
    {
      icon: ClipboardList,
      title: "Program Registration",
      desc: "Browse ongoing cultural programs and register for events you want to participate in.",
      href: "/programs",
      ocid: "dashboard.programs_link",
      color:
        "from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40",
      iconBg: "bg-primary/10 text-primary",
    },
    {
      icon: Trophy,
      title: "Live Scoreboard",
      desc: "Watch real-time scores and rankings for all cultural events as they happen.",
      href: "/scoreboard",
      ocid: "dashboard.scoreboard_link",
      color:
        "from-festival-purple/10 to-festival-purple/5 border-festival-purple/20 hover:border-festival-purple/40",
      iconBg: "bg-purple-100 text-purple-700",
    },
  ];

  if (session.role === "admin") {
    cards.push({
      icon: Shield,
      title: "Admin Panel",
      desc: "Create and manage programs, update statuses, and view all registrations.",
      href: "/admin",
      ocid: "dashboard.admin_link",
      color: "from-red-50 to-red-50/50 border-red-200 hover:border-red-300",
      iconBg: "bg-red-100 text-red-700",
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-3xl">{roleEmoji[session.role] ?? "👤"}</span>
          <h1 className="font-display font-black text-3xl sm:text-4xl">
            Welcome, {session.fullName.split(" ")[0]}!
          </h1>
          <Badge
            variant="outline"
            className={`text-sm capitalize px-3 py-1 ${roleBadgeClass[session.role] ?? ""}`}
          >
            {session.role}
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          {session.role === "admin" &&
            "Manage the festival, create programs, and oversee everything."}
          {session.role === "student" &&
            "Explore and register for cultural programs you love."}
          {session.role === "teacher" &&
            "View ongoing programs and monitor student participation."}
          {session.role === "judge" &&
            "Access scoreboards and submit your evaluations."}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.href as "/programs" | "/scoreboard" | "/admin"}
            data-ocid={card.ocid}
            className={`group bg-gradient-to-br ${card.color} rounded-2xl p-6 border transition-all hover:shadow-festival hover:-translate-y-0.5`}
          >
            <div
              className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}
            >
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">
              {card.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {card.desc}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Open <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick stats banner */}
      <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-primary fill-current" />
          <span className="font-display font-semibold text-sm">
            Festival Season 2026
          </span>
        </div>
        <p className="text-muted-foreground text-sm">
          The college cultural festival is in full swing. Explore programs,
          check live scores, and celebrate talent!
        </p>
      </div>
    </div>
  );
}
