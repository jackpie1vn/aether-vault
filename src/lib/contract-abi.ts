/**
 * ArtContest 合约 ABI
 * 从 contract/veil.sol 生成
 */

export const ART_CONTEST_ABI = [
  // Events
  "event EntrySubmitted(uint256 indexed entryId, address indexed contestant, string title)",
  "event EntryScored(uint256 indexed entryId, address indexed judge)",
  "event EntryVoted(uint256 indexed entryId, address indexed judge, string category)",

  // Read Functions
  "function nextEntryId() view returns (uint256)",
  "function getEntry(uint256 entryId) view returns (uint256 id, address contestant, string title, string descriptionHash, string fileHash, string[] tags, string[] categories, uint64 timestamp, uint256 scoresHandle)",
  "function getAllEntries() view returns (uint256[] ids)",
  "function getCategoryVotes(uint256 entryId, string category) view returns (uint256 votesHandle)",

  // Write Functions
  "function submitEntry(string title, string descriptionHash, string fileHash, string[] tags, string[] categories) returns (uint256 entryId)",
  "function scoreEntry(uint256 entryId)",
  "function voteEntry(uint256 entryId, string category)"
] as const;

export type ContestEntry = {
  id: bigint;
  contestant: string;
  title: string;
  descriptionHash: string;
  fileHash: string;
  tags: string[];
  categories: string[];
  timestamp: bigint;
  scoresHandle: bigint;
};
