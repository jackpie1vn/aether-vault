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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Artwork not found
  if (!entry) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Artwork Not Found</h1>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
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
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-gradient-card border-border/50">
              <img
                src={imageUrl}
                alt={entry.title}
                className="w-full aspect-square object-cover"
                onError={(e) => {
                  // Fallback to placeholder if IPFS load fails
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </Card>

            {/* Encrypted data display */}
            <CategoryVotesDisplay
              entryId={entry.id}
              categories={entry.categories}
              userAddress={walletAddress}
              isContestant={entry.contestant.toLowerCase() === walletAddress.toLowerCase()}
            />
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-gradient-cosmic">
                {entry.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(entry.timestamp)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {formatAddress(entry.contestant)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {entry.categories.map((cat) => (
                  <Badge key={cat} className="bg-gradient-primary">{cat}</Badge>
                ))}
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-primary/30">{tag}</Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Description Hash</h2>
              <p className="text-muted-foreground leading-relaxed font-mono text-sm break-all">
                {entry.descriptionHash}
              </p>
            </div>

            <Separator />

            {/* Wallet connection */}
            {!walletAddress && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your wallet to rate and vote for this artwork
                </p>
                <WalletConnect onConnected={setWalletAddress} />
              </div>
            )}

            {/* Rating and voting component */}
            {walletAddress && (
              <ArtworkActions
                entryId={entry.id}
                categories={entry.categories}
                walletAddress={walletAddress}
              />
            )}

            {/* IPFS Link */}
            <Button
              variant="outline"
              className="w-full gap-2"
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
