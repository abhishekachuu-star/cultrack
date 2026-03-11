import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginUser } from "@/hooks/useQueries";
import { setSession } from "@/utils/session";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ROLES = ["admin", "student", "teacher", "judge"] as const;

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const loginMutation = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const result = await loginMutation.mutateAsync({ username, password });
      if (result.ok) {
        if (result.role.toLowerCase() !== role.toLowerCase()) {
          toast.error(
            `This account is registered as ${result.role}, not ${role}`,
          );
          return;
        }
        setSession({
          userId: result.userId.toString(),
          role: result.role.toLowerCase(),
          fullName: result.fullName,
        });
        toast.success(`Welcome back, ${result.fullName}!`);
        navigate({ to: "/dashboard" });
      } else {
        toast.error("Invalid username or password");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card rounded-3xl shadow-festival border border-border overflow-hidden">
          {/* Header strip */}
          <div className="h-2 festival-gradient" />

          <div className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl festival-gradient flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-black text-2xl text-gradient">
                  CulTrack
                </h1>
                <p className="text-xs text-muted-foreground">
                  Cultural Festival Management
                </p>
              </div>
            </div>

            <h2 className="font-display font-bold text-xl mb-1">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Select your role and sign in to continue
            </p>

            {/* Role Tabs */}
            <div className="mb-6">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 block">
                Your Role
              </Label>
              <Tabs
                value={role}
                onValueChange={setRole}
                data-ocid="login.role_select"
              >
                <TabsList className="grid grid-cols-4 w-full h-auto p-1">
                  {ROLES.map((r) => (
                    <TabsTrigger
                      key={r}
                      value={r}
                      className="capitalize text-xs py-2 data-[state=active]:festival-gradient data-[state=active]:text-white"
                    >
                      {r}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5"
                  data-ocid="login.username_input"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-ocid="login.password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full festival-gradient text-white border-0 shadow-festival hover:opacity-90 h-11 font-semibold"
                disabled={loginMutation.isPending}
                data-ocid="login.submit_button"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
