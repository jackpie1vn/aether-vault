import Navigation from "@/components/layout/Navigation";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { Card } from "@/components/ui/card";
import EncryptedBadge from "@/components/artwork/EncryptedBadge";
import { Layers } from "lucide-react";

const MOCK_MY_ARTWORKS = [
  {
    id: "1",
    title: "My Cosmic Dreams",
    coverUrl: "/placeholder.svg",
    tags: ["abstract", "digital", "space"],
    category: "Digital Art",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "3",
    title: "My Neural Networks",
    coverUrl: "/placeholder.svg",
    tags: ["ai", "generative", "patterns"],
    category: "Generative",
    submittedAt: "2024-01-13T09:15:00Z",
  },
];

const MySubmissions = () => {
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

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="p-6 bg-gradient-card border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Submissions</p>
            <p className="text-3xl font-bold text-gradient-primary">{MOCK_MY_ARTWORKS.length}</p>
          </Card>
          <Card className="p-6 bg-gradient-card border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Scores</p>
            <div className="flex justify-center">
              <EncryptedBadge value={42} encrypted={false} />
            </div>
          </Card>
          <Card className="p-6 bg-gradient-card border-border/50 text-center">
            <p className="text-sm text-muted-foreground mb-2">Total Votes</p>
            <div className="flex justify-center">
              <EncryptedBadge value={18} encrypted={false} label="Votes" />
            </div>
          </Card>
        </div>

        {/* Artworks Grid */}
        {MOCK_MY_ARTWORKS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_MY_ARTWORKS.map((artwork) => (
              <ArtworkCard key={artwork.id} {...artwork} encrypted={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              You haven't submitted any artworks yet.
            </p>
            <a 
              href="/submit"
              className="text-primary hover:text-primary-glow transition-colors underline"
            >
              Submit your first artwork →
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default MySubmissions;
