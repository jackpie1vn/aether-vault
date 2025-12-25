import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WalletConnect } from "@/components/WalletConnect";
import { ArtworkActions } from "@/components/ArtworkActions";
import { CategoryVotesDisplay } from "@/components/EncryptedDataDisplay";
import { Loader2, ExternalLink, Calendar, User } from "lucide-react";
import { getEntryDetails, type ContestEntry } from "@/utils/contract";
import { getIPFSImageUrl } from "@/utils/ipfs";
import { toast } from "sonner";

const ArtworkDetail = () => {
  const { id } = useParams();
  const [entry, setEntry] = useState<ContestEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");

  // Load artwork details
  useEffect(() => {
    if (id) {
      loadEntry(BigInt(id));
    }
  }, [id]);

  const loadEntry = async (entryId: bigint) => {
    setIsLoading(true);
    try {
      const data = await getEntryDetails(entryId);
      setEntry(data);
    } catch (err) {
      toast.error("Failed to load artwork");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center animate-pulse-glow p-8 rounded-2xl glass">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading artwork...</p>
        </div>
      </div>
    );
  }

  // Artwork not found
  if (!entry) {
    return (
      <div className="min-h-screen page-enter">
        <Navigation />
        <main className="container mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-6 text-gradient-cosmic">Artwork Not Found</h1>
            <Button asChild className="btn-press hover:scale-105 transition-all duration-300">
              <a href="/">Back to Home</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  // Get IPFS image URL
  const imageUrl = getIPFSImageUrl(entry.fileHash);

  return (
    <div className="min-h-screen page-enter">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Artwork Image */}
          <div className="space-y-6 animate-fade-in-up">
            <Card className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-500 group rounded-2xl">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={imageUrl}
                  alt={entry.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if IPFS load fails
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </Card>

            {/* Encrypted data display */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CategoryVotesDisplay
                entryId={entry.id}
                categories={entry.categories}
                userAddress={walletAddress}
                isContestant={entry.contestant.toLowerCase() === walletAddress.toLowerCase()}
              />
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-cosmic leading-tight">
                {entry.title}
              </h1>
              <div className="flex items-center gap-5 text-sm text-muted-foreground mb-5">
                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full transition-colors duration-300 hover:text-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(entry.timestamp)}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full transition-colors duration-300 hover:text-foreground">
                  <User className="w-4 h-4" />
                  {formatAddress(entry.contestant)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {entry.categories.map((cat, index) => (
                  <Badge key={cat} className="bg-gradient-to-r from-primary to-secondary transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 0.05}s` }}>{cat}</Badge>
                ))}
                {entry.tags.map((tag, index) => (
                  <Badge key={tag} variant="outline" className="border-primary/30 transition-all duration-300 hover:bg-primary/10 hover:scale-105" style={{ animationDelay: `${(entry.categories.length + index) * 0.05}s` }}>{tag}</Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-border/50" />

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold mb-3">Description Hash</h2>
              <div className="p-4 glass rounded-xl">
                <p className="text-muted-foreground leading-relaxed font-mono text-sm break-all">
                  {entry.descriptionHash}
                </p>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Wallet connection */}
            {!walletAddress && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to rate and vote for this artwork
                </p>
                <WalletConnect onConnected={setWalletAddress} />
              </div>
            )}

            {/* Rating and voting component */}
            {walletAddress && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                <ArtworkActions
                  entryId={entry.id}
                  categories={entry.categories}
                  walletAddress={walletAddress}
                />
              </div>
            )}

            {/* IPFS Link */}
            <Button
              variant="outline"
              className="w-full gap-2 h-12 glass hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] btn-press rounded-xl animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
              onClick={() => window.open(`https://ipfs.io/ipfs/${entry.fileHash}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
              View on IPFS
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArtworkDetail;
