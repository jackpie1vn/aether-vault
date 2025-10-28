/**
 * 加密数据显示组件
 * 用于解密和显示链上加密的评分和投票数据
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { decryptHandle, getCategoryVotesHandle, CONTRACT_ADDRESS } from '@/utils/contract';

interface EncryptedDataDisplayProps {
  label: string;
  handle: bigint;
  userAddress?: string;
  canDecrypt?: boolean;
}

export function EncryptedDataDisplay({
  label,
  handle,
  userAddress,
  canDecrypt = false
}: EncryptedDataDisplayProps) {
  const [decryptedValue, setDecryptedValue] = useState<number | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDecrypt = async () => {
    if (!userAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!canDecrypt) {
      toast.error('You do not have permission to decrypt this data');
      return;
    }

    setIsDecrypting(true);

    try {
      const value = await decryptHandle(handle, CONTRACT_ADDRESS, userAddress);
      setDecryptedValue(value);
      setIsVisible(true);
      toast.success('Data decrypted successfully');
    } catch (error) {
      console.error('Decryption error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to decrypt data'
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        {decryptedValue !== null ? (
          <Unlock className="w-4 h-4 text-green-500" />
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground" />
        )}
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">
            {decryptedValue !== null
              ? isVisible
                ? `Value: ${decryptedValue}`
                : '••••••'
              : 'Encrypted on-chain'}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {decryptedValue !== null ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleDecrypt}
            disabled={!canDecrypt || isDecrypting}
          >
            {isDecrypting ? 'Decrypting...' : 'Decrypt'}
          </Button>
        )}
      </div>
    </div>
  );
}

interface CategoryVotesDisplayProps {
  entryId: number | bigint;
  categories: string[];
  userAddress?: string;
  isContestant?: boolean;
}

/**
 * 显示作品在各类别的投票数（加密）
 */
export function CategoryVotesDisplay({
  entryId,
  categories,
  userAddress,
  isContestant = false
}: CategoryVotesDisplayProps) {
  const [votesHandles, setVotesHandles] = useState<Map<string, bigint>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadVotesHandles();
  }, [entryId, categories]);

  const loadVotesHandles = async () => {
    setIsLoading(true);
    const handles = new Map<string, bigint>();

    try {
      for (const category of categories) {
        const handle = await getCategoryVotesHandle(entryId, category);
        handles.set(category, handle);
      }
      setVotesHandles(handles);
    } catch (error) {
      console.error('Failed to load votes handles:', error);
      toast.error('Failed to load voting data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Votes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Votes</CardTitle>
        <p className="text-sm text-muted-foreground">
          {isContestant
            ? 'As the contestant, you can decrypt vote counts'
            : 'Vote counts are encrypted on-chain'}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const handle = votesHandles.get(category);
          if (!handle) return null;

          return (
            <EncryptedDataDisplay
              key={category}
              label={category}
              handle={handle}
              userAddress={userAddress}
              canDecrypt={isContestant}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
