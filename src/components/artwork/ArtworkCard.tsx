import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye, Sparkles, Shield } from "lucide-react";
import { getIPFSImageUrl } from "@/utils/ipfs";

interface ArtworkCardProps {
  id: string;
  title: string;
  coverUrl: string;
  tags: string[];
  category: string;
  submittedAt: string;
  encrypted?: boolean;
}

const ArtworkCard = ({
  id,
  title,
  coverUrl,
  tags,
  category,
  submittedAt,
  encrypted = true
}: ArtworkCardProps) => {
  // 使用 IPFS URL 或回退到 placeholder
  const imageUrl = getIPFSImageUrl(coverUrl);

  return (
    <Link to={`/artwork/${id}`}>
      <Card className="group relative overflow-hidden glass-neon border-primary/10 hover:border-primary/40 transition-all duration-500 ease-out rounded-2xl card-reveal">
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent animate-gradient-border opacity-50" />
        </div>

        <div className="relative aspect-square overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

          {/* Neon shimmer overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out" />

          {encrypted && (
            <div className="absolute top-4 right-4 glass-neon rounded-xl p-2.5 border border-primary/40 transition-all duration-300 group-hover:border-primary group-hover:scale-110 group-hover:glow-primary">
              <Lock className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-12" />
            </div>
          )}

          {/* Category badge on image */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-gradient-to-r from-secondary/90 to-cyan-500/90 text-white border-0 backdrop-blur-sm text-xs font-medium px-3 py-1">
              {category}
            </Badge>
          </div>

          {/* View overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-gradient-to-r from-primary to-purple-500 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 glow-primary">
              <Eye className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        <div className="relative p-5 space-y-4 bg-gradient-to-b from-transparent to-primary/5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg group-hover:text-gradient-neon transition-all duration-300 line-clamp-1 flex-1">
              {title}
            </h3>
            <Sparkles className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-primary/30 text-primary bg-primary/10 transition-all duration-300 hover:bg-primary/30 hover:scale-105 hover:border-primary/60"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                #{tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs border-muted-foreground/30 bg-muted/50 transition-all duration-300">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-primary/10 group-hover:border-primary/30 transition-colors duration-300">
            <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
                <Shield className="w-3.5 h-3.5 text-secondary" />
                <span className="font-medium">FHE Protected</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{new Date(submittedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Bottom gradient line animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-2xl" />
      </Card>
    </Link>
  );
};

export default ArtworkCard;
