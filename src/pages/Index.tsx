import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import { WalletConnect } from "@/components/WalletConnect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, Loader2, Sparkles, Shield, Eye, Zap, Star, PlusCircle } from "lucide-react";
import { getAllEntries, type ContestEntry } from "@/utils/contract";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  // 合约数据状态
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // 加载所有作品
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setIsLoading(true);
    setError("");

    try {
      const allEntries = await getAllEntries();
      setEntries(allEntries);

      if (allEntries.length === 0) {
        toast.info("No artworks submitted yet. Be the first!");
      }
    } catch (err) {
      console.error("Failed to load artworks:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to load artworks";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearCategories = () => {
    setSelectedCategories([]);
  };

  // 过滤作品
  const filteredArtworks = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategories.length === 0 ||
      entry.categories.some(cat => selectedCategories.includes(cat));

    return matchesSearch && matchesCategory;
  });

  // 转换为 ArtworkCard 所需格式
  const formatArtworks = filteredArtworks.map(entry => ({
    id: entry.id.toString(),
    title: entry.title,
    coverUrl: entry.fileHash, // 使用 IPFS 文件哈希
    tags: entry.tags,
    category: entry.categories[0] || "Uncategorized",
    submittedAt: new Date(Number(entry.timestamp) * 1000).toISOString(),
  }));

  return (
    <div className="min-h-screen page-enter">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Vibrant Aurora Style */}
        <div className="relative text-center mb-20 py-12">
          {/* Floating decorative elements */}
          <div className="absolute top-0 left-10 w-20 h-20 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-secondary/15 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/3 w-24 h-24 rounded-full bg-accent/10 blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />

          {/* Main hero content */}
          <div className="relative space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-neon border border-primary/30 animate-bounce-in">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gradient-neon">Powered by FHE Technology</span>
              <Shield className="w-4 h-4 text-secondary" />
            </div>

            {/* Main title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight animate-fade-in-up">
              <span className="text-gradient-aurora">Discover</span>
              <br />
              <span className="relative inline-block">
                <span className="text-gradient-neon">Privacy-First</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-gradient-border" />
              </span>
              <br />
              <span className="text-white">Art Gallery</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Explore encrypted artworks with <span className="text-secondary font-semibold">homomorphic encryption</span>.
              <br className="hidden md:block" />
              Your votes remain <span className="text-primary font-semibold">completely private</span> until revealed.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-primary/20 hover:border-primary/50 transition-all hover:scale-105">
                <Eye className="w-4 h-4 text-primary" />
                <span className="text-sm">Private Voting</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-secondary/20 hover:border-secondary/50 transition-all hover:scale-105">
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-sm">Encrypted Scores</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-accent/20 hover:border-accent/50 transition-all hover:scale-105">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm">On-Chain Art</span>
              </div>
            </div>
          </div>
        </div>

        {!walletAddress && (
          <div className="flex justify-center mb-12 animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <WalletConnect onConnected={setWalletAddress} />
          </div>
        )}

        {/* Search Section - Neon Glass Style */}
        <div className="max-w-4xl mx-auto mb-12 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary" />
              <Input
                placeholder="Search artworks by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 glass-neon border-primary/20 focus:border-primary/60 focus:glow-primary transition-all duration-300 rounded-2xl text-base"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 h-14 px-6 glass-neon rounded-2xl transition-all duration-300 hover:scale-105 btn-press btn-neon ${
                showFilters ? "border-secondary glow-secondary" : "border-primary/20 hover:border-primary/50"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            <Button
              variant="outline"
              onClick={loadEntries}
              disabled={isLoading}
              className="gap-2 h-14 px-6 glass-neon border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:scale-105 btn-press btn-neon rounded-2xl"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4" />}
              <span className="hidden sm:inline">{isLoading ? "Loading" : "Refresh"}</span>
            </Button>
          </div>

          {showFilters && (
            <div className="glass-neon rounded-2xl p-6 border border-primary/20 animate-scale-in shadow-2xl">
              <CategoryFilter
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
              />
            </div>
          )}
        </div>

        {/* Loading State - Neon Style */}
        {isLoading && (
          <Card className="p-20 text-center glass-neon border-primary/20 rounded-3xl animate-rainbow-pulse">
            <div className="relative inline-block">
              <Loader2 className="w-20 h-20 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground mt-8 animate-pulse">Loading artworks...</p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="p-12 text-center border-destructive/50 glass-neon rounded-3xl animate-scale-in">
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

        {/* Artworks Grid with staggered animations */}
        {!isLoading && !error && (
          <>
            {/* Section header */}
            {formatArtworks.length > 0 && (
              <div className="flex items-center justify-between mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold">
                  <span className="text-gradient-primary">Featured</span> Artworks
                </h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>{formatArtworks.length} pieces</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formatArtworks.map((artwork, index) => (
                <div
                  key={artwork.id}
                  className="animate-fade-in-up hover-lift-neon"
                  style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                >
                  <ArtworkCard {...artwork} />
                </div>
              ))}
            </div>

            {formatArtworks.length === 0 && (
              <div className="text-center py-32 animate-fade-in">
                <div className="relative inline-block mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-primary/10 blur-3xl" />
                </div>
                <p className="text-2xl font-medium text-muted-foreground mb-3">
                  {entries.length === 0
                    ? "No artworks yet"
                    : "No matching artworks found"}
                </p>
                <p className="text-muted-foreground mb-8">
                  {entries.length === 0
                    ? "Be the first to showcase your encrypted art!"
                    : "Try adjusting your search criteria"}
                </p>
                {entries.length === 0 && (
                  <Button
                    asChild
                    className="btn-press btn-neon hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary via-purple-500 to-secondary rounded-xl px-8 py-6 text-lg font-semibold glow-primary hover:glow-neon"
                  >
                    <a href="/submit">
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Submit Your Artwork
                    </a>
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Stats Footer - Neon Style */}
        {!isLoading && entries.length > 0 && (
          <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center gap-4 px-8 py-4 glass-neon rounded-full border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-pink-500 animate-pulse" />
                <span className="text-sm font-medium">{entries.length} Total</span>
              </div>
              <div className="w-px h-4 bg-border/50" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-secondary to-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <span className="text-sm font-medium">{formatArtworks.length} Showing</span>
              </div>
              <div className="w-px h-4 bg-border/50" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">FHE Protected</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
