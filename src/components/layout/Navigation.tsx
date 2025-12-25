import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Search, PlusCircle, User, Trophy, Layers, Wallet, Zap } from "lucide-react";
import { getProviderAndSigner } from "@/utils/contract";

const Navigation = () => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setWalletAddress('');
        } else {
          setWalletAddress(accounts[0]);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      }
    } catch (err) {
      console.error('Failed to check wallet connection:', err);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask wallet!');
      return;
    }

    setIsConnecting(true);

    try {
      const { address } = await getProviderAndSigner();
      setWalletAddress(address);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <nav className="sticky top-0 z-50 glass-neon border-b border-primary/10">
      {/* Animated gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] animate-gradient-border" />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150 animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 p-2 rounded-xl border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                <Sparkles className="w-7 h-7 text-primary group-hover:text-accent transition-all duration-300 group-hover:rotate-12" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gradient-aurora tracking-tight">VeilArt</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">Privacy-First Gallery</span>
            </div>
          </Link>

          <div className="flex items-center space-x-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className={`gap-2 btn-press btn-neon transition-all duration-300 hover:scale-105 rounded-xl ${
                  isActive("/") ? "bg-gradient-to-r from-primary to-pink-500 glow-primary" : "hover:bg-primary/10"
                }`}
              >
                <Search className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline font-medium">Explore</span>
              </Button>
            </Link>

            <Link to="/submit">
              <Button
                variant={isActive("/submit") ? "default" : "ghost"}
                size="sm"
                className={`gap-2 btn-press btn-neon transition-all duration-300 hover:scale-105 rounded-xl ${
                  isActive("/submit") ? "bg-gradient-to-r from-secondary to-cyan-400 glow-secondary" : "hover:bg-secondary/10"
                }`}
              >
                <PlusCircle className="w-4 h-4 transition-transform duration-300 hover:rotate-90" />
                <span className="hidden sm:inline font-medium">Submit</span>
              </Button>
            </Link>

            <Link to="/my-submissions">
              <Button
                variant={isActive("/my-submissions") ? "default" : "ghost"}
                size="sm"
                className={`gap-2 btn-press btn-neon transition-all duration-300 hover:scale-105 rounded-xl ${
                  isActive("/my-submissions") ? "bg-gradient-to-r from-purple-500 to-violet-500 glow-purple" : "hover:bg-purple-500/10"
                }`}
              >
                <Layers className="w-4 h-4 transition-transform duration-300" />
                <span className="hidden sm:inline font-medium">My Works</span>
              </Button>
            </Link>

            <Link to="/leaderboard">
              <Button
                variant={isActive("/leaderboard") ? "default" : "ghost"}
                size="sm"
                className={`gap-2 btn-press btn-neon transition-all duration-300 hover:scale-105 rounded-xl ${
                  isActive("/leaderboard") ? "bg-gradient-to-r from-accent to-yellow-400 text-black glow-accent" : "hover:bg-accent/10"
                }`}
              >
                <Trophy className="w-4 h-4 transition-transform duration-300 hover:scale-110" />
                <span className="hidden sm:inline font-medium">Leaderboard</span>
              </Button>
            </Link>

            {walletAddress ? (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 ml-4 glass-neon rounded-xl transition-all duration-300 hover:scale-105 border-secondary/50 hover:border-secondary hover:glow-secondary"
              >
                <Wallet className="w-4 h-4 text-secondary" />
                <span className="hidden sm:inline text-secondary font-mono text-xs">{formatAddress(walletAddress)}</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={connectWallet}
                disabled={isConnecting}
                className="gap-2 ml-4 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-[length:200%_100%] hover:bg-right transition-all duration-500 hover:scale-105 glow-primary hover:glow-neon btn-press btn-neon rounded-xl font-semibold"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
