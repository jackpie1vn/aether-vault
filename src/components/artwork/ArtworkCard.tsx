import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Eye } from "lucide-react";
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
      <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // 如果 IPFS 加载失败，回退到 placeholder
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {encrypted && (
            <div className="absolute top-3 right-3 bg-primary/20 backdrop-blur-sm rounded-full p-2 border border-primary/30">
              <Lock className="w-4 h-4 text-primary-glow" />
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            <span>{new Date(submittedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs border-primary/30 text-primary-glow"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Encrypted Scores
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ArtworkCard;
