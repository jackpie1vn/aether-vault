import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Search, PlusCircle, User, Trophy, Layers, Wallet } from "lucide-react";
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

            {walletAddress ? (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 ml-4"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">{formatAddress(walletAddress)}</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={connectWallet}
                disabled={isConnecting}
                className="gap-2 ml-4 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
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
