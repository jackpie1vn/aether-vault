import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import EncryptedBadge from "@/components/artwork/EncryptedBadge";
import { getAllEntries, type ContestEntry } from "@/utils/contract";
import { toast } from "sonner";

const CATEGORIES = [
  "Digital Art",
  "Photography",
  "3D Art",
  "Illustration",
  "Generative",
  "Animation",
  "Mixed Media",
  "Abstract"
];

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("Digital Art");
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all artworks
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    setError("");

    try {
      const allEntries = await getAllEntries();
      setEntries(allEntries);
    } catch (err) {
      console.error("Failed to load entries:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to load entries";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Format address
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Filter entries by selected category
  const filteredEntries = entries.filter((entry) =>
    entry.categories.includes(selectedCategory)
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-accent" />;
      case 2:
        return <Medal className="w-6 h-6 text-secondary" />;
      case 3:
        return <Award className="w-6 h-6 text-primary" />;
      default:
        return <span className="text-xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <Trophy className="w-8 h-8 text-accent animate-float" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-gradient-cosmic">
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top artworks by category with encrypted voting
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-foreground/80 mb-2 text-center">
            Select Category
          </h2>
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Currently viewing: <span className="text-primary font-semibold">{selectedCategory}</span>
          </p>
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`transition-all ${
                    isSelected
                      ? "bg-gradient-primary shadow-glow"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    console.log('Clicked category:', category);
                    setSelectedCategory(category);
                  }}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="max-w-4xl mx-auto p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading artworks...</p>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="max-w-4xl mx-auto p-8 text-center border-destructive/50">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadEntries} variant="outline">
              Retry
            </Button>
          </Card>
        )}

        {/* Leaderboard List */}
        {!isLoading && !error && (
          <>
            {filteredEntries.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-4">
                {filteredEntries.map((entry, index) => (
                  <Card
                    key={entry.id.toString()}
                    className={`p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all cursor-pointer ${
                      index < 3 ? "shadow-glow" : ""
                    }`}
                    onClick={() => window.location.href = `/artwork/${entry.id}`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Artwork Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-1 truncate">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          by {formatAddress(entry.contestant)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Votes (Encrypted) */}
                      <div className="flex-shrink-0">
                        <EncryptedBadge
                          encrypted={true}
                          label="Votes"
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-4xl mx-auto p-12 text-center">
                <p className="text-xl text-muted-foreground mb-4">
                  No artworks in "{selectedCategory}" category yet
                </p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different category or submit an artwork in this category
                </p>
              </Card>
            )}
          </>
        )}

        {/* Privacy Notice */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <Card className="max-w-4xl mx-auto mt-8 p-6 bg-primary/5 border-primary/20">
            <h3 className="font-semibold mb-2 text-center">🔒 About Rankings</h3>
            <p className="text-sm text-center text-muted-foreground mb-2">
              Vote counts are encrypted using FHE (Fully Homomorphic Encryption) and cannot be directly compared.
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Artworks are shown in submission order, not by vote count. True rankings require decryption,
              which is only available to authorized users. Click on any artwork to view its encrypted metrics.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
