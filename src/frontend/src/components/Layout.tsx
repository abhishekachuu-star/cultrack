import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clearSession, getSession } from "@/utils/session";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Shield,
  Trophy,
} from "lucide-react";

const roleBadgeClass: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  student: "bg-blue-100 text-blue-700 border-blue-200",
  teacher: "bg-green-100 text-green-700 border-green-200",
  judge: "bg-purple-100 text-purple-700 border-purple-200",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const session = getSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg festival-gradient flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">
              CulTrack
            </span>
          </Link>

          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {session.fullName}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${roleBadgeClass[session.role] ?? ""}`}
                >
                  {session.role}
                </Badge>
              </div>
              <nav className="flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/programs">
                    <ClipboardList className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Programs</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/scoreboard">
                    <Trophy className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Scores</span>
                  </Link>
                </Button>
                {session.role === "admin" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin">
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline ml-1">Admin</span>
                    </Link>
                  </Button>
                )}
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                data-ocid="dashboard.logout_button"
                className="border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button
                size="sm"
                className="festival-gradient text-white border-0"
                asChild
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
