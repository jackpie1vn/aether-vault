import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Loader2, Crown, Sparkles, Shield, Star } from "lucide-react";
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
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-pulse" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center glow-accent">
              <Crown className="w-6 h-6 text-black" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/30 blur-lg rounded-full" />
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-secondary to-cyan-400 flex items-center justify-center">
              <Medal className="w-5 h-5 text-black" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center border border-muted-foreground/20">
            <span className="text-lg font-bold text-muted-foreground">{rank}</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen page-enter">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative text-center mb-16">
          {/* Floating decorative elements */}
          <div className="absolute top-0 left-20 w-24 h-24 rounded-full bg-accent/15 blur-3xl animate-float-slow" />
          <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative space-y-6">
            {/* Trophy icon with glow */}
            <div className="relative inline-block animate-bounce-in">
              <div className="absolute inset-0 bg-accent/40 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent via-yellow-500 to-orange-500 flex items-center justify-center glow-accent">
                <Trophy className="w-12 h-12 text-black animate-float" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black animate-fade-in-up">
              <span className="text-gradient-aurora">Art</span>
              <span className="text-white"> Leaderboard</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Discover top artworks with <span className="text-accent font-semibold">FHE-encrypted</span> voting scores
            </p>

            {/* Stats badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-accent/20 hover:border-accent/50 transition-all hover:scale-105">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm">{entries.length} Entries</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/20 hover:border-primary/50 transition-all hover:scale-105">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Private Votes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold mb-2">Browse by Category</h2>
            <p className="text-sm text-muted-foreground">
              Currently viewing: <span className="text-gradient-neon font-semibold">{selectedCategory}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {CATEGORIES.map((category, index) => {
              const isSelected = selectedCategory === category;
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`transition-all duration-300 hover:scale-105 btn-press btn-neon rounded-xl px-5 py-2 ${
                    isSelected
                      ? "bg-gradient-to-r from-primary via-purple-500 to-secondary border-0 glow-primary font-semibold"
                      : "glass-neon border-primary/20 hover:border-primary/50"
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                  onClick={() => {
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
          <Card className="max-w-4xl mx-auto p-20 text-center glass-neon border-primary/20 rounded-3xl animate-rainbow-pulse">
            <div className="relative inline-block">
              <Loader2 className="w-20 h-20 animate-spin mx-auto text-accent" />
              <div className="absolute inset-0 bg-accent/20 blur-2xl animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground mt-8 animate-pulse">Loading rankings...</p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="max-w-4xl mx-auto p-12 text-center border-destructive/50 glass-neon rounded-3xl animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center">
              <span className="text-3xl">!</span>
            </div>
            <p className="text-destructive mb-6 text-lg font-medium">{error}</p>
            <Button
              onClick={loadEntries}
              className="btn-press btn-neon hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-xl"
            >
              Try Again
            </Button>
          </Card>
        )}

        {/* Leaderboard List */}
        {!isLoading && !error && (
          <>
            {filteredEntries.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-5">
                {filteredEntries.map((entry, index) => (
                  <Card
                    key={entry.id.toString()}
                    className={`group relative p-6 glass-neon border-primary/10 hover:border-primary/40 transition-all duration-500 cursor-pointer hover:-translate-y-2 rounded-2xl overflow-hidden animate-fade-in-up ${
                      index === 0 ? "glow-accent" : index === 1 ? "glow-secondary" : index === 2 ? "glow-primary" : ""
                    }`}
                    style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                    onClick={() => window.location.href = `/artwork/${entry.id}`}
                  >
                    {/* Background gradient for top 3 */}
                    {index < 3 && (
                      <div className={`absolute inset-0 opacity-10 ${
                        index === 0 ? "bg-gradient-to-r from-accent/30 to-transparent" :
                        index === 1 ? "bg-gradient-to-r from-secondary/30 to-transparent" :
                        "bg-gradient-to-r from-primary/30 to-transparent"
                      }`} />
                    )}

                    <div className="relative flex items-center gap-6">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 flex items-center justify-center">
                        {getRankIcon(index + 1)}
                      </div>

                      {/* Artwork Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1.5 truncate group-hover:text-gradient-neon transition-all duration-300">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 font-mono">
                          by {formatAddress(entry.contestant)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:border-primary/40"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Votes (Encrypted) */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-secondary/30 group-hover:border-secondary/60 transition-all">
                          <Shield className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium text-secondary">Encrypted</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom gradient line animation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="max-w-4xl mx-auto p-20 text-center glass-neon rounded-3xl animate-fade-in">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground animate-pulse" />
                  </div>
                </div>
                <p className="text-2xl font-medium text-muted-foreground mb-4">
                  No artworks in "{selectedCategory}" yet
                </p>
                <p className="text-muted-foreground mb-8">
                  Be the first to submit art in this category!
                </p>
                <Button
                  asChild
                  className="btn-press btn-neon bg-gradient-to-r from-primary to-secondary rounded-xl px-8"
                >
                  <a href="/submit">Submit Artwork</a>
                </Button>
              </Card>
            )}
          </>
        )}

        {/* Privacy Notice */}
        {!isLoading && !error && filteredEntries.length > 0 && (
          <Card className="max-w-4xl mx-auto mt-12 p-8 glass-neon border-accent/20 rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="font-bold text-lg">About Privacy Rankings</h3>
            </div>
            <p className="text-sm text-center text-muted-foreground mb-3">
              Vote counts are encrypted using <span className="text-secondary font-medium">Fully Homomorphic Encryption (FHE)</span> and cannot be directly compared.
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Artworks are displayed in submission order. True rankings require authorized decryption.
              Click any artwork to view its encrypted metrics.
            </p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
