import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoginUser, useRegisterUser } from "@/hooks/useQueries";
import { setSession } from "@/utils/session";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const registerMutation = useRegisterUser();
  const loginMutation = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !password || !role) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const result = await registerMutation.mutateAsync({
        username,
        password,
        fullName,
        role,
      });
      if (result.ok) {
        // Auto-login
        const loginResult = await loginMutation.mutateAsync({
          username,
          password,
        });
        if (loginResult.ok) {
          setSession({
            userId: loginResult.userId.toString(),
            role: loginResult.role.toLowerCase(),
            fullName: loginResult.fullName,
          });
          toast.success(`Welcome, ${fullName}! Account created successfully.`);
          navigate({ to: "/dashboard" });
        }
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  const isPending = registerMutation.isPending || loginMutation.isPending;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-3xl shadow-festival border border-border overflow-hidden">
          <div className="h-2 festival-gradient" />

          <div className="p-8">
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
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Join the festival platform today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    className="mt-1.5"
                    data-ocid="register.role_select"
                  >
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">🎓 Student</SelectItem>
                    <SelectItem value="teacher">📚 Teacher</SelectItem>
                    <SelectItem value="judge">⚖️ Judge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                  data-ocid="register.fullname_input"
                />
              </div>

              <div>
                <Label htmlFor="regUsername" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="regUsername"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5"
                  data-ocid="register.username_input"
                />
              </div>

              <div>
                <Label htmlFor="regPassword" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="regPassword"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    data-ocid="register.password_input"
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
                disabled={isPending}
                data-ocid="register.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
