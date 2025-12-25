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
    <div className="min-h-screen page-enter">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse-glow">
            <Layers className="w-10 h-10 text-primary-glow animate-float" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient-cosmic animate-fade-in-up">
            My Submissions
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            View your submitted artworks and their encrypted metrics
          </p>
        </div>

        {/* Wallet connection */}
        {!walletAddress ? (
          <div className="max-w-md mx-auto mb-10 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <p className="text-center text-muted-foreground mb-5">
              Connect your wallet to view your submissions
            </p>
            <WalletConnect onConnected={setWalletAddress} />
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-14 max-w-4xl mx-auto">
              <Card className="p-6 bg-gradient-card border-border/50 text-center hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.1s' }}>
                <p className="text-sm text-muted-foreground mb-3">Total Submissions</p>
                <p className="text-4xl font-bold text-gradient-primary">
                  {isLoading ? "..." : myEntries.length}
                </p>
              </Card>
              <Card className="p-6 bg-gradient-card border-border/50 text-center hover:border-secondary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.15s' }}>
                <p className="text-sm text-muted-foreground mb-3">Total Scores</p>
                <div className="flex flex-col items-center gap-3">
                  <EncryptedBadge encrypted label="Scores" />
                  <p className="text-xs text-muted-foreground">
                    View individual artwork details to see encrypted scores
                  </p>
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card border-border/50 text-center hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.2s' }}>
                <p className="text-sm text-muted-foreground mb-3">Total Votes</p>
                <div className="flex flex-col items-center gap-3">
                  <EncryptedBadge encrypted label="Votes" />
                  <p className="text-xs text-muted-foreground">
                    View individual artwork details to see encrypted votes
                  </p>
                </div>
              </Card>
            </div>

            {/* Loading state */}
            {isLoading && (
              <Card className="p-16 text-center glass border-border/30 rounded-2xl animate-pulse-glow">
                <Loader2 className="w-16 h-16 animate-spin mx-auto mb-6 text-primary" />
                <p className="text-lg text-muted-foreground">Loading your submissions...</p>
              </Card>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <Card className="p-10 text-center border-destructive/50 glass rounded-2xl animate-scale-in">
                <p className="text-destructive mb-6 text-lg">{error}</p>
                <Button onClick={loadMyEntries} variant="outline" className="btn-press hover:scale-105 transition-all duration-300">
                  Retry
                </Button>
              </Card>
            )}

            {/* Artworks Grid */}
            {!isLoading && !error && (
              <>
                {formatArtworks.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {formatArtworks.map((artwork, index) => (
                        <div
                          key={artwork.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                        >
                          <ArtworkCard {...artwork} encrypted={false} />
                        </div>
                      ))}
                    </div>

                    {/* Privacy Notice */}
                    <Card className="max-w-4xl mx-auto mt-12 p-8 bg-primary/5 border-primary/20 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <h3 className="font-semibold mb-3 text-center text-lg">About Encrypted Metrics</h3>
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
                  <div className="text-center py-24 animate-fade-in">
                    <p className="text-2xl text-muted-foreground mb-6">
                      You haven't submitted any artworks yet.
                    </p>
                    <Button asChild className="btn-press hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30">
                      <a href="/submit">Submit your first artwork</a>
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
