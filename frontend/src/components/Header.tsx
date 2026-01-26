import { Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-main flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground group-hover:shadow-md transition-shadow">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">RepoPulse</span>
        </a>
        <nav>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
