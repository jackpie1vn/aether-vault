import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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

interface CategoryFilterProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  onClearAll: () => void;
}

const CategoryFilter = ({ 
  selectedCategories, 
  onToggleCategory, 
  onClearAll 
}: CategoryFilterProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground/80">Categories</h3>
        {selectedCategories.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="h-auto py-1 px-2 text-xs"
          >
            <X className="w-3 h-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Badge
              key={category}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "bg-gradient-primary border-primary shadow-glow" 
                  : "border-border/50 hover:border-primary/50"
              }`}
              onClick={() => onToggleCategory(category)}
            >
              {category}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
