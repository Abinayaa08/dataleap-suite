import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Upload, MessageSquare, Zap, ArrowRight, Layout, Brain, Download } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-14 px-6 gap-8">
          <Link to="/" className="text-lg font-semibold tracking-tight mr-auto">Power AI</Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Button asChild size="sm">
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            Turn raw data into
            <br />
            actionable dashboards
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            Upload your files. Get a full analytical dashboard in seconds. Ask questions, get insights, export results.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/signup">Start for free <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="border rounded-lg bg-surface overflow-hidden">
            <div className="border-b px-4 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
              <div className="w-2.5 h-2.5 rounded-full bg-border" />
            </div>
            <div className="p-6 grid grid-cols-4 gap-4">
              {["Revenue", "Users", "Growth", "Retention"].map((label, i) => (
                <div key={label} className="bg-background rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-semibold mt-1">{["$124K", "8,421", "+24%", "92%"][i]}</p>
                </div>
              ))}
              <div className="col-span-2 bg-background rounded-lg border p-4 h-40 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div key={i} className="flex-1 bg-foreground/10 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
              <div className="col-span-2 bg-background rounded-lg border p-4 h-40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-8 border-foreground/10 border-t-foreground/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Upload, title: "Upload", desc: "Drag and drop Excel, CSV, PDF, images, or text files." },
              { icon: Brain, title: "Process", desc: "System merges, aligns, and detects relationships automatically." },
              { icon: Layout, title: "Visualize", desc: "Full-screen dashboard generated instantly with KPIs and charts." },
              { icon: MessageSquare, title: "Ask", desc: "Embedded assistant explains patterns and modifies the dashboard." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-medium mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: BarChart3, title: "Smart Charts", desc: "Bar, line, pie charts auto-generated from your data." },
            { icon: Zap, title: "Real-time Filters", desc: "Filter by month, quarter, year. Everything updates instantly." },
            { icon: Download, title: "Export & Share", desc: "Download dashboards or share interactive links." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border rounded-lg p-6 hover:bg-secondary/50 transition-colors">
              <Icon className="h-5 w-5 mb-3 text-muted-foreground" />
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center border rounded-lg p-12 bg-surface">
          <h2 className="text-2xl font-semibold mb-3">Ready to analyze your data?</h2>
          <p className="text-muted-foreground mb-6">No setup required. Upload files and get insights in seconds.</p>
          <Button asChild size="lg">
            <Link to="/signup">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 Power AI</span>
          <div className="flex gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
