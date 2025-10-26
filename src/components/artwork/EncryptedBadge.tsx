import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface EncryptedBadgeProps {
  value?: number | string;
  encrypted?: boolean;
  label?: string;
  className?: string;
}

const EncryptedBadge = ({ 
  value, 
  encrypted = true, 
  label = "Score",
  className = "" 
}: EncryptedBadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`gap-2 cursor-help ${className}`}
          >
            {encrypted ? (
              <>
                <Lock className="w-3 h-3 text-primary-glow animate-glow" />
                <span className="font-mono">••••</span>
                <EyeOff className="w-3 h-3 text-muted-foreground" />
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 text-secondary-glow" />
                <span className="font-mono font-semibold">{value}</span>
                <Eye className="w-3 h-3 text-secondary-glow" />
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {encrypted 
              ? `${label} is encrypted. Connect with authorized wallet to decrypt.` 
              : `Decrypted ${label}: ${value}`
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default EncryptedBadge;
