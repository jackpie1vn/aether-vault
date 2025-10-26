import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data
const MOCK_ARTWORKS = [
  {
    id: "1",
    title: "Cosmic Dreams",
    coverUrl: "/placeholder.svg",
    tags: ["abstract", "digital", "space"],
    category: "Digital Art",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Encrypted Memories",
    coverUrl: "/placeholder.svg",
    tags: ["photography", "noir", "urban"],
    category: "Photography",
    submittedAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "3",
    title: "Neural Networks",
    coverUrl: "/placeholder.svg",
    tags: ["ai", "generative", "patterns"],
    category: "Generative",
    submittedAt: "2024-01-13T09:15:00Z",
  },
  {
    id: "4",
    title: "Quantum Leap",
    coverUrl: "/placeholder.svg",
    tags: ["3d", "sci-fi", "animation"],
    category: "3D Art",
    submittedAt: "2024-01-12T14:45:00Z",
  },
  {
    id: "5",
    title: "Digital Shadows",
    coverUrl: "/placeholder.svg",
    tags: ["illustration", "dark", "moody"],
    category: "Illustration",
    submittedAt: "2024-01-11T11:00:00Z",
  },
  {
    id: "6",
    title: "Fractal Infinity",
    coverUrl: "/placeholder.svg",
    tags: ["abstract", "mathematical", "colorful"],
    category: "Abstract",
    submittedAt: "2024-01-10T16:30:00Z",
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredArtworks = MOCK_ARTWORKS.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artwork.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(artwork.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient-cosmic animate-float">
            Discover Privacy-First Art
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore encrypted artworks with FHE-powered voting. Your votes remain private until revealed.
          </p>
        </div>

        {/* Search and Filters */}
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

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} {...artwork} />
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              No artworks found. Try adjusting your search or filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
