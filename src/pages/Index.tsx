import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import { WalletConnect } from "@/components/WalletConnect";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
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
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient-cosmic animate-float">
            Discover Privacy-First Art
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore encrypted artworks with FHE-powered voting. Your votes remain private until revealed.
          </p>
        </div>

        {!walletAddress && (
          <div className="flex justify-center mb-8">
            <WalletConnect onConnected={setWalletAddress} />
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search artworks by title or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50 border-border/50 focus:border-primary/50"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              onClick={loadEntries}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          {showFilters && (
            <div className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <CategoryFilter
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                onClearAll={clearCategories}
              />
            </div>
          )}
        </div>

        {isLoading && (
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading artworks...</p>
          </Card>
        )}

        {error && !isLoading && (
          <Card className="p-8 text-center border-destructive/50">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadEntries} variant="outline">Retry</Button>
          </Card>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formatArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} {...artwork} />
              ))}
            </div>

            {formatArtworks.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground mb-4">
                  {entries.length === 0
                    ? "No artworks yet. Be the first to submit!"
                    : "No matching artworks found. Try adjusting your search criteria."}
                </p>
                {entries.length === 0 && (
                  <Button asChild>
                    <a href="/submit">Submit Artwork</a>
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {!isLoading && entries.length > 0 && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>{entries.length} total artworks | Showing {formatArtworks.length}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
