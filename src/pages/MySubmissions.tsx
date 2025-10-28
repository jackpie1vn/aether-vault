import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";
import EncryptedBadge from "@/components/artwork/EncryptedBadge";
import { Layers, Loader2 } from "lucide-react";
import { getAllEntries, type ContestEntry } from "@/utils/contract";
import { toast } from "sonner";

const MySubmissions = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [myEntries, setMyEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalScores, setTotalScores] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState<number | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Load user artworks
  useEffect(() => {
    if (walletAddress) {
      loadMyEntries();
    }
  }, [walletAddress]);

  const loadMyEntries = async () => {
    setIsLoading(true);
    setError("");

    try {
      const allEntries = await getAllEntries();

      // Filter current user's artworks
      const userEntries = allEntries.filter(
        (entry) => entry.contestant.toLowerCase() === walletAddress.toLowerCase()
      );

      setMyEntries(userEntries);

      if (userEntries.length === 0) {
        toast.info("You haven't submitted any artworks yet");
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to load submissions";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Format for ArtworkCard
  const formatArtworks = myEntries.map((entry) => ({
    id: entry.id.toString(),
    title: entry.title,
    coverUrl: entry.fileHash, // Use IPFS file hash
    tags: entry.tags,
    category: entry.categories[0] || "Uncategorized",
    submittedAt: new Date(Number(entry.timestamp) * 1000).toISOString(),
  }));

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Layers className="w-8 h-8 text-primary-glow" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-gradient-cosmic">
            My Submissions
          </h1>
          <p className="text-muted-foreground">
            View your submitted artworks and their encrypted metrics
          </p>
        </div>

        {/* Wallet connection */}
        {!walletAddress ? (
          <div className="max-w-md mx-auto mb-8">
            <p className="text-center text-muted-foreground mb-4">
              Connect your wallet to view your submissions
            </p>
            <WalletConnect onConnected={setWalletAddress} />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Submissions</p>
                <p className="text-3xl font-bold text-gradient-primary">
                  {isLoading ? "..." : myEntries.length}
                </p>
              </Card>
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Scores</p>
                <div className="flex flex-col items-center gap-2">
                  <EncryptedBadge encrypted label="Scores" />
                  <p className="text-xs text-muted-foreground">
                    View individual artwork details to see encrypted scores
                  </p>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-2">Total Votes</p>
                <div className="flex flex-col items-center gap-2">
                  <EncryptedBadge encrypted label="Votes" />
                  <p className="text-xs text-muted-foreground">
                    View individual artwork details to see encrypted votes
                  </p>
                </div>
              </Card>
            </div>

            {/* Loading state */}
            {isLoading && (
              <Card className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading your submissions...</p>
              </Card>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <Card className="p-8 text-center border-destructive/50">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={loadMyEntries} variant="outline">
                  Retry
                </Button>
              </Card>
            )}

            {/* Artworks Grid */}
            {!isLoading && !error && (
              <>
                {formatArtworks.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {formatArtworks.map((artwork) => (
                        <ArtworkCard key={artwork.id} {...artwork} encrypted={false} />
                      ))}
                    </div>

                    {/* Privacy Notice */}
                    <Card className="max-w-4xl mx-auto mt-8 p-6 bg-primary/5 border-primary/20">
                      <h3 className="font-semibold mb-2 text-center">🔒 About Encrypted Metrics</h3>
                      <p className="text-sm text-center text-muted-foreground mb-3">
                        Due to FHE (Fully Homomorphic Encryption), scores and votes are stored as encrypted values on the blockchain.
                      </p>
                      <p className="text-xs text-center text-muted-foreground">
                        <strong>Why can't I see totals?</strong> Each artwork's scores and votes are separately encrypted and cannot be directly aggregated.
                        Click on individual artworks to view their encrypted metrics. Only authorized users (you, as the artwork owner) can decrypt these values.
                      </p>
                    </Card>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xl text-muted-foreground mb-4">
                      You haven't submitted any artworks yet.
                    </p>
                    <Button asChild>
                      <a href="/submit">Submit your first artwork →</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MySubmissions;
