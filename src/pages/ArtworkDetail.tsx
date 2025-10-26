import { useParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EncryptedBadge from "@/components/artwork/EncryptedBadge";
import { Star, Vote, ExternalLink, Calendar, User } from "lucide-react";
import { toast } from "sonner";

const ArtworkDetail = () => {
  const { id } = useParams();

  const handleScore = () => {
    toast.success("Score submitted! Your rating is encrypted on-chain.");
  };

  const handleVote = (category: string) => {
    toast.success(`Vote for "${category}" submitted! Your vote is encrypted.`);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Artwork Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-gradient-card border-border/50">
              <img
                src="/placeholder.svg"
                alt="Cosmic Dreams"
                className="w-full aspect-square object-cover"
              />
            </Card>
            
            <Card className="p-6 bg-card/30 backdrop-blur-sm border-border/50 space-y-4">
              <h3 className="font-semibold text-lg">Encrypted Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Total Scores</p>
                  <EncryptedBadge label="Scores" encrypted />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Category Votes</p>
                  <EncryptedBadge label="Votes" encrypted />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect with an authorized wallet to decrypt and view actual values.
              </p>
            </Card>
          </div>

          {/* Artwork Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-gradient-cosmic">
                Cosmic Dreams
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Jan 15, 2024
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  0x1234...5678
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-gradient-primary">Digital Art</Badge>
                <Badge variant="outline" className="border-primary/30">abstract</Badge>
                <Badge variant="outline" className="border-primary/30">digital</Badge>
                <Badge variant="outline" className="border-primary/30">space</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                A mesmerizing exploration of cosmic phenomena through digital art. 
                This piece combines abstract elements with space-inspired themes, 
                creating a dreamlike visualization of the universe. The encryption 
                ensures that all ratings and votes remain private until the reveal phase.
              </p>
            </div>

            <Separator />

            {/* Rating Section */}
            <Card className="p-6 bg-gradient-card border-border/50 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Rate This Artwork
              </h2>
              <p className="text-sm text-muted-foreground">
                Submit an encrypted score. Your rating will be protected by FHE encryption.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <Button
                    key={score}
                    variant="outline"
                    size="lg"
                    className="flex-1 hover:bg-primary/20 hover:border-primary transition-all"
                    onClick={handleScore}
                  >
                    {score}⭐
                  </Button>
                ))}
              </div>
            </Card>

            {/* Voting Section */}
            <Card className="p-6 bg-gradient-card border-border/50 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Vote className="w-5 h-5 text-secondary" />
                Vote by Category
              </h2>
              <p className="text-sm text-muted-foreground">
                Choose categories that best represent this artwork. Votes are encrypted.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["Digital Art", "Abstract", "Space", "Experimental"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="hover:bg-secondary/20 hover:border-secondary transition-all"
                    onClick={() => handleVote(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            {/* IPFS Link */}
            <Button variant="outline" className="w-full gap-2">
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
