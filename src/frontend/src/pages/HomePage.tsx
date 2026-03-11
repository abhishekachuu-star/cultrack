import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Star, Trophy, Users } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    color: "bg-primary/10 text-primary",
    title: "Program Registration",
    desc: "Students can browse ongoing cultural programs and book their slots instantly. Real-time slot availability tracking.",
  },
  {
    icon: Trophy,
    color: "bg-festival-purple/10 text-festival-purple",
    title: "Live Scoreboard",
    desc: "Watch scores update in real-time. Judges submit scores directly while participants and spectators follow live rankings.",
  },
  {
    icon: Users,
    color: "bg-festival-teal/10 text-festival-teal",
    title: "Role-Based Access",
    desc: "Separate portals for Admin, Students, Teachers, and Judges — each with the right tools and permissions.",
  },
];

const roles = [
  {
    role: "Admin",
    icon: "🛡️",
    color: "bg-red-50 border-red-200 text-red-700",
    desc: "Manage programs",
  },
  {
    role: "Student",
    icon: "🎓",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    desc: "Book slots",
  },
  {
    role: "Teacher",
    icon: "📚",
    color: "bg-green-50 border-green-200 text-green-700",
    desc: "Oversee events",
  },
  {
    role: "Judge",
    icon: "⚖️",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    desc: "Submit scores",
  },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full festival-gradient opacity-10 blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-festival-teal opacity-10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-festival-purple opacity-8 blur-3xl" />
          <div className="absolute top-20 right-10 text-primary/5 text-9xl font-display font-black select-none">
            ✦
          </div>
          <div className="absolute bottom-20 left-10 text-secondary/5 text-8xl font-display font-black select-none">
            ◈
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
              <Star className="w-3.5 h-3.5 fill-current" />
              College Cultural Festival Platform
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mb-6 animate-fade-up">
              Manage Your <span className="text-gradient">Cultural</span>
              <br />
              Festival with Ease
            </h1>

            <p
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              CulTrack brings together students, teachers, judges, and
              administrators in one seamless platform for college cultural
              events.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                size="lg"
                className="festival-gradient text-white border-0 shadow-festival hover:opacity-90 transition-opacity text-base px-8"
                asChild
                data-ocid="home.login_button"
              >
                <Link to="/login">
                  Login to Your Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/40 hover:bg-primary/5 text-foreground text-base px-8"
                asChild
                data-ocid="home.register_button"
              >
                <Link to="/register">Create an Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From program registration to live scoreboards — manage every
              aspect of your cultural festival.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-2xl p-6 shadow-card border border-border hover:shadow-festival transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">
              Built for Everyone
            </h2>
            <p className="text-muted-foreground">
              One platform, four roles — all working together.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {roles.map((r) => (
              <div
                key={r.role}
                className={`rounded-2xl p-5 border text-center ${r.color}`}
              >
                <div className="text-3xl mb-2">{r.icon}</div>
                <div className="font-display font-bold text-base">{r.role}</div>
                <div className="text-xs mt-1 opacity-75">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="festival-gradient text-white border-0 shadow-festival text-base px-8"
              asChild
            >
              <Link to="/register">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="h-2 festival-gradient" />
    </div>
  );
}
