import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BarChart3, TrendingUp, Zap } from "lucide-react";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else if (data.session) {
      toast.success("Account created successfully!");
      navigate("/app");
    } else {
      toast.success("Check your email to confirm your account");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-lg font-semibold tracking-tight">DataLens</Link>
          <h1 className="text-2xl font-semibold mt-8 mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start analyzing your data in minutes</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface flex-col justify-center p-16">
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold tracking-tight mb-6">Automated analytics</h2>
          <div className="space-y-6">
            {[
              { icon: BarChart3, text: "Upload Excel, CSV, PDF or images — dashboards generated instantly" },
              { icon: TrendingUp, text: "AI assistant explains patterns and suggests next steps" },
              { icon: Zap, text: "Export, share, and collaborate on interactive dashboards" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded bg-background border flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
