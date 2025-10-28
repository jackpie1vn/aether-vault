/**
 * 艺术作品操作组件
 * 支持评分和投票功能
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { scoreEntry, voteForEntry } from '@/utils/contract';

interface ArtworkActionsProps {
  entryId: number | bigint;
  categories: string[];
  walletAddress?: string;
}

export function ArtworkActions({ entryId, categories, walletAddress }: ArtworkActionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isScoring, setIsScoring] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleScore = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsScoring(true);

    try {
      toast.loading('Submitting score...', { id: 'score' });
      const txHash = await scoreEntry(entryId);

      toast.success(
        `Score submitted successfully! Transaction: ${txHash.slice(0, 10)}...`,
        { id: 'score' }
      );
    } catch (error) {
      console.error('Score error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit score',
        { id: 'score' }
      );
    } finally {
      setIsScoring(false);
    }
  };

  const handleVote = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }

    setIsVoting(true);

    try {
      toast.loading('Submitting vote...', { id: 'vote' });
      const txHash = await voteForEntry(entryId, selectedCategory);

      toast.success(
        `Vote submitted successfully for ${selectedCategory}! Transaction: ${txHash.slice(0, 10)}...`,
        { id: 'vote' }
      );
      setSelectedCategory('');
    } catch (error) {
      console.error('Vote error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit vote',
        { id: 'vote' }
      );
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Button */}
        <div>
          <Button
            onClick={handleScore}
            disabled={!walletAddress || isScoring}
            className="w-full"
            variant="outline"
          >
            <Heart className="w-4 h-4 mr-2" />
            {isScoring ? 'Submitting...' : 'Score This Artwork'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            All scores are encrypted on-chain using FHE
          </p>
        </div>

        {/* Vote by Category */}
        <div className="space-y-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category to vote" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleVote}
            disabled={!walletAddress || !selectedCategory || isVoting}
            className="w-full"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            {isVoting ? 'Submitting...' : 'Vote'}
          </Button>
          <p className="text-xs text-muted-foreground">
            Vote for this artwork in your selected category
          </p>
        </div>

        {!walletAddress && (
          <p className="text-sm text-muted-foreground text-center py-2 border-t">
            Connect your wallet to score and vote
          </p>
        )}
      </CardContent>
    </Card>
  );
}
