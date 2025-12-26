import { expect } from "chai";
import { ethers } from "hardhat";
import { ArtContest } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ArtContest", function () {
  let artContest: ArtContest;
  let owner: HardhatEthersSigner;
  let artist1: HardhatEthersSigner;
  let artist2: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, artist1, artist2, voter1, voter2] = await ethers.getSigners();

    const ArtContestFactory = await ethers.getContractFactory("ArtContest");
    artContest = await ArtContestFactory.deploy();
    await artContest.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await artContest.getAddress()).to.be.properAddress;
    });

    it("Should initialize nextEntryId to 1", async function () {
      expect(await artContest.nextEntryId()).to.equal(1);
    });

    it("Should return empty entries array initially", async function () {
      const entries = await artContest.getAllEntries();
      expect(entries.length).to.equal(0);
    });
  });

  describe("Submit Entry", function () {
    const testEntry = {
      title: "Sunset Dreams",
      descriptionHash: "QmTestDescription123",
      fileHash: "QmTestFile456",
      tags: ["landscape", "sunset", "oil"],
      categories: ["painting", "nature"]
    };

    it("Should submit an entry successfully", async function () {
      const tx = await artContest.connect(artist1).submitEntry(
        testEntry.title,
        testEntry.descriptionHash,
        testEntry.fileHash,
        testEntry.tags,
        testEntry.categories
      );

      await expect(tx).to.emit(artContest, "EntrySubmitted")
        .withArgs(1, artist1.address, testEntry.title);
    });

    it("Should increment nextEntryId after submission", async function () {
      await artContest.connect(artist1).submitEntry(
        testEntry.title,
        testEntry.descriptionHash,
        testEntry.fileHash,
        testEntry.tags,
        testEntry.categories
      );

      expect(await artContest.nextEntryId()).to.equal(2);
    });

    it("Should store entry data correctly", async function () {
      await artContest.connect(artist1).submitEntry(
        testEntry.title,
        testEntry.descriptionHash,
        testEntry.fileHash,
        testEntry.tags,
        testEntry.categories
      );

      const entry = await artContest.getEntry(1);

      expect(entry.id).to.equal(1);
      expect(entry.contestant).to.equal(artist1.address);
      expect(entry.title).to.equal(testEntry.title);
      expect(entry.descriptionHash).to.equal(testEntry.descriptionHash);
      expect(entry.fileHash).to.equal(testEntry.fileHash);
      expect(entry.tags).to.deep.equal(testEntry.tags);
      expect(entry.categories).to.deep.equal(testEntry.categories);
    });

    it("Should add entry to getAllEntries", async function () {
      await artContest.connect(artist1).submitEntry(
        testEntry.title,
        testEntry.descriptionHash,
        testEntry.fileHash,
        testEntry.tags,
        testEntry.categories
      );

      const entries = await artContest.getAllEntries();
      expect(entries.length).to.equal(1);
      expect(entries[0]).to.equal(1n);
    });

    it("Should handle multiple submissions", async function () {
      await artContest.connect(artist1).submitEntry(
        "Entry 1", "hash1", "file1", ["tag1"], ["cat1"]
      );
      await artContest.connect(artist2).submitEntry(
        "Entry 2", "hash2", "file2", ["tag2"], ["cat2"]
      );

      const entries = await artContest.getAllEntries();
      expect(entries.length).to.equal(2);
      expect(await artContest.nextEntryId()).to.equal(3);
    });
  });

  describe("Get Entry", function () {
    it("Should revert for non-existent entry", async function () {
      await expect(artContest.getEntry(999))
        .to.be.revertedWith("Entry not found");
    });
  });

  describe("Score Entry", function () {
    beforeEach(async function () {
      await artContest.connect(artist1).submitEntry(
        "Test Art", "desc", "file", ["tag"], ["category"]
      );
    });

    it("Should emit EntryScored event", async function () {
      await expect(artContest.connect(voter1).scoreEntry(1))
        .to.emit(artContest, "EntryScored")
        .withArgs(1, voter1.address);
    });

    it("Should revert for non-existent entry", async function () {
      await expect(artContest.connect(voter1).scoreEntry(999))
        .to.be.revertedWith("Entry not found");
    });

    it("Should allow multiple scores from different voters", async function () {
      await expect(artContest.connect(voter1).scoreEntry(1)).to.not.be.reverted;
      await expect(artContest.connect(voter2).scoreEntry(1)).to.not.be.reverted;
    });
  });

  describe("Vote Entry", function () {
    beforeEach(async function () {
      await artContest.connect(artist1).submitEntry(
        "Test Art", "desc", "file", ["tag"], ["painting", "nature"]
      );
    });

    it("Should emit EntryVoted event for valid category", async function () {
      await expect(artContest.connect(voter1).voteEntry(1, "painting"))
        .to.emit(artContest, "EntryVoted")
        .withArgs(1, voter1.address, "painting");
    });

    it("Should revert for non-existent entry", async function () {
      await expect(artContest.connect(voter1).voteEntry(999, "painting"))
        .to.be.revertedWith("Entry not found");
    });

    it("Should revert for invalid category", async function () {
      await expect(artContest.connect(voter1).voteEntry(1, "sculpture"))
        .to.be.revertedWith("Entry does not belong to this category");
    });

    it("Should allow voting in multiple categories", async function () {
      await expect(artContest.connect(voter1).voteEntry(1, "painting")).to.not.be.reverted;
      await expect(artContest.connect(voter1).voteEntry(1, "nature")).to.not.be.reverted;
    });
  });

  describe("Get Category Votes", function () {
    it("Should return vote handle for category", async function () {
      await artContest.connect(artist1).submitEntry(
        "Test Art", "desc", "file", ["tag"], ["painting"]
      );

      // Vote first to initialize the category votes
      await artContest.connect(voter1).voteEntry(1, "painting");

      // This should not revert
      const votesHandle = await artContest.getCategoryVotes(1, "painting");
      expect(votesHandle).to.not.be.undefined;
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete contest workflow", async function () {
      // Artist submits entry
      await artContest.connect(artist1).submitEntry(
        "Masterpiece",
        "QmDescription",
        "QmArtwork",
        ["abstract", "modern"],
        ["digital", "abstract"]
      );

      // Multiple voters score the entry
      await artContest.connect(voter1).scoreEntry(1);
      await artContest.connect(voter2).scoreEntry(1);

      // Voters vote in categories
      await artContest.connect(voter1).voteEntry(1, "digital");
      await artContest.connect(voter2).voteEntry(1, "abstract");

      // Verify entry data
      const entry = await artContest.getEntry(1);
      expect(entry.title).to.equal("Masterpiece");
      expect(entry.contestant).to.equal(artist1.address);
    });

    it("Should handle multiple artists with multiple entries", async function () {
      // Artist 1 submits
      await artContest.connect(artist1).submitEntry(
        "Art 1", "hash1", "file1", ["tag1"], ["cat1"]
      );

      // Artist 2 submits
      await artContest.connect(artist2).submitEntry(
        "Art 2", "hash2", "file2", ["tag2"], ["cat2"]
      );

      // Verify entries
      const entries = await artContest.getAllEntries();
      expect(entries.length).to.equal(2);

      const entry1 = await artContest.getEntry(1);
      const entry2 = await artContest.getEntry(2);

      expect(entry1.contestant).to.equal(artist1.address);
      expect(entry2.contestant).to.equal(artist2.address);
    });
  });
});
