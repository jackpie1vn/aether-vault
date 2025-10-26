import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";
import EncryptedBadge from "@/components/artwork/EncryptedBadge";

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

const MOCK_LEADERBOARD = [
  { id: "1", title: "Cosmic Dreams", artist: "0x1234...5678", votes: 42, rank: 1 },
  { id: "2", title: "Neural Networks", artist: "0x8765...4321", votes: 38, rank: 2 },
  { id: "3", title: "Digital Shadows", artist: "0x9876...1234", votes: 35, rank: 3 },
  { id: "4", title: "Quantum Leap", artist: "0x5432...8765", votes: 28, rank: 4 },
  { id: "5", title: "Fractal Infinity", artist: "0x2468...1357", votes: 22, rank: 5 },
];

const Leaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("Digital Art");

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
          <h2 className="text-sm font-semibold text-foreground/80 mb-4 text-center">
            Select Category
          </h2>
          <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <Badge
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all text-sm px-4 py-2 ${
                    isSelected 
                      ? "bg-gradient-primary shadow-glow" 
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {MOCK_LEADERBOARD.map((entry, index) => (
            <Card 
              key={entry.id}
              className={`p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all ${
                index < 3 ? "shadow-glow" : ""
              }`}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Artwork Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1 truncate">
                    {entry.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    by {entry.artist}
                  </p>
                </div>

                {/* Votes */}
                <div className="flex-shrink-0">
                  <EncryptedBadge 
                    value={entry.votes} 
                    encrypted={false}
                    label="Votes"
                    className="text-lg"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Privacy Notice */}
        <Card className="max-w-4xl mx-auto mt-8 p-6 bg-primary/5 border-primary/20">
          <p className="text-sm text-center text-muted-foreground">
            🔒 Vote counts are decrypted locally for authorized users. 
            Rankings shown here are based on your decryption permissions.
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
