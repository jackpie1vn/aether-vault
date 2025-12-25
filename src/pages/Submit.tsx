import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Sparkles, Shield, Image, FileText, Tag, Layers, Zap } from "lucide-react";
import { toast } from "sonner";
import { submitEntry } from "@/utils/contract";
import { uploadToIPFS, uploadTextToIPFS } from "@/utils/ipfs";

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
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!title || !description || !artworkFile || selectedCategories.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload to IPFS
      toast.loading("Uploading description to IPFS...", { id: "upload-desc" });
      const descriptionResult = await uploadTextToIPFS(description);
      toast.success(`Description uploaded: ${descriptionResult.hash.substring(0, 10)}...`, { id: "upload-desc" });

      toast.loading("Uploading artwork to IPFS...", { id: "upload-file" });
      const fileResult = await uploadToIPFS(artworkFile);
      toast.success(`Artwork uploaded: ${fileResult.hash.substring(0, 10)}...`, { id: "upload-file" });

      const descriptionHash = descriptionResult.hash;
      const fileHash = fileResult.hash;

      // 2. Submit to smart contract
      toast.loading("Submitting to blockchain...", { id: "submit" });

      const result = await submitEntry(
        title,
        descriptionHash,
        fileHash,
        tags,
        selectedCategories
      );

      toast.success(
        `Artwork submitted successfully! Entry ID: ${result.entryId}`,
        { id: "submit" }
      );

      // Reset form
      setTitle("");
      setDescription("");
      setTags([]);
      setSelectedCategories([]);
      setArtworkFile(null);
      setCoverFile(null);

    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit artwork",
        { id: "submit" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-enter">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="relative text-center mb-16">
            {/* Floating decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-primary/10 blur-3xl animate-float-slow" />
            <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />

            <div className="relative space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-neon border border-secondary/30 animate-bounce-in">
                <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
                <span className="text-sm font-medium">Privacy-Preserving Submission</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black animate-fade-in-up">
                <span className="text-gradient-aurora">Submit Your</span>
                <br />
                <span className="text-white">Masterpiece</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Share your creation with <span className="text-secondary font-semibold">FHE-powered</span> privacy voting.
                Your art, your rules.
              </p>

              {/* Feature indicators */}
              <div className="flex flex-wrap justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-primary/20">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium">Encrypted Storage</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-secondary/20">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span className="text-xs font-medium">IPFS Hosting</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-accent/20">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium">On-Chain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Connection */}
          {!walletAddress && (
            <div className="flex justify-center mb-12 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <WalletConnect onConnected={setWalletAddress} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <Card className="p-6 glass-neon border-primary/10 hover:border-primary/30 transition-all duration-300 animate-fade-in-up rounded-2xl group" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <Label htmlFor="title" className="text-lg font-semibold">
                  Title <span className="text-primary">*</span>
                </Label>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your artwork title..."
                className="glass border-primary/20 h-14 text-lg transition-all duration-300 focus:border-primary/60 focus:glow-primary rounded-xl"
                required
              />
            </Card>

            {/* Description */}
            <Card className="p-6 glass-neon border-secondary/10 hover:border-secondary/30 transition-all duration-300 animate-fade-in-up rounded-2xl group" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description <span className="text-secondary">*</span>
                </Label>
              </div>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story behind your artwork..."
                className="glass border-secondary/20 min-h-36 text-base transition-all duration-300 focus:border-secondary/60 focus:glow-secondary rounded-xl"
                required
              />
            </Card>

            {/* Artwork File */}
            <Card className="p-6 glass-neon border-accent/10 hover:border-accent/30 transition-all duration-300 animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Image className="w-5 h-5 text-accent" />
                </div>
                <Label className="text-lg font-semibold">
                  Artwork File <span className="text-accent">*</span>
                </Label>
              </div>
              <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 group cursor-pointer ${
                artworkFile
                  ? "border-accent/50 bg-accent/10"
                  : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"
              }`}>
                <input
                  type="file"
                  id="artwork-file"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => setArtworkFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="artwork-file" className="cursor-pointer block">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    artworkFile
                      ? "bg-accent/20"
                      : "bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30"
                  }`}>
                    <Upload className={`w-10 h-10 transition-all duration-300 ${
                      artworkFile ? "text-accent" : "text-primary group-hover:scale-110"
                    }`} />
                  </div>
                  <p className={`text-base font-medium mb-2 transition-colors duration-300 ${
                    artworkFile ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {artworkFile ? artworkFile.name : "Drop your masterpiece here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF, MP4 up to 50MB
                  </p>
                </label>
              </div>
            </Card>

            {/* Cover Image */}
            <Card className="p-6 glass-neon border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Image className="w-5 h-5 text-purple-400" />
                </div>
                <Label className="text-lg font-semibold">Cover Image <span className="text-muted-foreground text-sm">(Optional)</span></Label>
              </div>
              <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 group cursor-pointer ${
                coverFile
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/5"
              }`}>
                <input
                  type="file"
                  id="cover-file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="cover-file" className="cursor-pointer block">
                  <Upload className={`w-10 h-10 mx-auto mb-2 transition-all duration-300 ${
                    coverFile ? "text-purple-400" : "text-purple-400/60 group-hover:text-purple-400 group-hover:scale-110"
                  }`} />
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {coverFile ? coverFile.name : "Upload a custom cover"}
                  </p>
                </label>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-6 glass-neon border-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300 animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <Label className="text-lg font-semibold">
                  Categories <span className="text-cyan-400">*</span>
                </Label>
              </div>
              <p className="text-sm text-muted-foreground mb-5 ml-12">
                Select one or more categories for your artwork
              </p>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((category, index) => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <Badge
                      key={category}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 py-2 px-4 text-sm rounded-xl ${
                        isSelected
                          ? "bg-gradient-to-r from-primary via-purple-500 to-secondary border-0 glow-primary text-white font-medium"
                          : "border-primary/30 hover:border-primary/60 hover:bg-primary/10"
                      }`}
                      style={{ animationDelay: `${index * 0.03}s` }}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  );
                })}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6 glass-neon border-pink-500/10 hover:border-pink-500/30 transition-all duration-300 animate-fade-in-up rounded-2xl" style={{ animationDelay: '0.35s' }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Tag className="w-5 h-5 text-pink-400" />
                </div>
                <Label className="text-lg font-semibold">Tags</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-5 ml-12">
                Add tags to help others discover your work
              </p>
              <div className="flex gap-3 mb-5">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Enter a tag..."
                  className="glass border-pink-500/20 h-12 transition-all duration-300 focus:border-pink-500/60 rounded-xl flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="h-12 w-12 btn-press bg-gradient-to-r from-pink-500 to-primary hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={tag}
                    className="gap-2 pr-2 py-1.5 px-3 animate-scale-in bg-gradient-to-r from-pink-500/20 to-primary/20 border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 rounded-lg"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors duration-200 p-0.5 rounded-full hover:bg-destructive/20"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary via-purple-500 to-secondary bg-[length:200%_100%] hover:bg-right transition-all duration-500 text-lg h-16 btn-press btn-neon glow-primary hover:glow-neon animate-fade-in-up rounded-2xl font-bold tracking-wide"
              style={{ animationDelay: '0.4s' }}
              disabled={!walletAddress || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting to Blockchain...
                </span>
              ) : walletAddress ? (
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Submit Artwork
                </span>
              ) : (
                "Connect Wallet to Submit"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Submit;
