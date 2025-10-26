import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Search, PlusCircle, User, Trophy, Layers } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-2xl font-bold text-gradient-cosmic">VeilArt</span>
          </Link>

          <div className="flex items-center space-x-1">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Explore</span>
              </Button>
            </Link>

            <Link to="/submit">
              <Button 
                variant={isActive("/submit") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Submit</span>
              </Button>
            </Link>

            <Link to="/my-submissions">
              <Button 
                variant={isActive("/my-submissions") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">My Works</span>
              </Button>
            </Link>

            <Link to="/leaderboard">
              <Button 
                variant={isActive("/leaderboard") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Button>
            </Link>

            <Button 
              size="sm"
              className="gap-2 ml-4 bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
