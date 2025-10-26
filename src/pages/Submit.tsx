import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";

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

const Submit = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !artworkFile || selectedCategories.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate IPFS upload and contract interaction
    toast.loading("Uploading to IPFS...");
    
    setTimeout(() => {
      toast.success("Artwork submitted successfully! Your entry is now encrypted on-chain.");
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gradient-cosmic">
              Submit Your Artwork
            </h1>
            <p className="text-muted-foreground">
              Share your creation with privacy-preserving voting powered by FHE
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label htmlFor="title" className="text-base">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter artwork title"
                className="mt-2 bg-background/50"
                required
              />
            </Card>

            {/* Description */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label htmlFor="description" className="text-base">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your artwork"
                className="mt-2 min-h-32 bg-background/50"
                required
              />
            </Card>

            {/* Artwork File */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label className="text-base">
                Artwork File <span className="text-destructive">*</span>
              </Label>
              <div className="mt-2 border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="artwork-file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="artwork-file" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {artworkFile ? artworkFile.name : "Click to upload your artwork"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: JPG, PNG, GIF, MP4 (Max 50MB)
                  </p>
                </label>
              </div>
            </Card>

            {/* Cover Image */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label className="text-base">Cover Image (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  id="cover-file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="cover-file" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {coverFile ? coverFile.name : "Upload a custom cover"}
                  </p>
                </label>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label className="text-base">
                Categories <span className="text-destructive">*</span>
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Select one or more categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Badge
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-gradient-primary shadow-glow" 
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  );
                })}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6 bg-gradient-card border-border/50">
              <Label className="text-base">Tags</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Add tags to help others discover your work
              </p>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Enter a tag"
                  className="bg-background/50"
                />
                <Button type="button" onClick={handleAddTag} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Submit Button */}
            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg"
            >
              Submit Artwork
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Submit;
