import { db } from "../config/firebase.js";
import admin from "firebase-admin";

const loadEntriesByMatchId = async (matchDocs) => {
  const entriesResults = await Promise.all(
    matchDocs.map(async (matchDoc) => {
      const entriesSnapshot = await matchDoc.ref.collection("entries").get();
      return [
        matchDoc.id,
        entriesSnapshot.docs.map((entryDoc) => entryDoc.data()),
      ];
    }),
  );

  return new Map(entriesResults);
};

const sortByLeaderboardRank = (a, b) => {
  if (b.wins !== a.wins) return b.wins - a.wins;
  if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
  return a.name.localeCompare(b.name);
};

export const createMatch = async (req, res) => {
  try {
    const { matchNumber, matchName, date, entries } = req.body;
    const { year } = req.params;

    if (!matchNumber || !date || !entries || entries.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const seasonRef = db.collection("seasons").doc(year);
    const matchId = `match_${matchNumber.toString().padStart(2, "0")}`;
    const matchRef = seasonRef.collection("matches").doc(matchId);

    const existingMatch = await matchRef.get();

    const normalizedEntries = entries.map((entry) => ({
      name: entry.name,
      points: Number(entry.points) || 0,
      rank: Number(entry.rank) || 0,
    }));

    let finalEntries = [...normalizedEntries];

    if (existingMatch.exists) {
      const existingEntriesSnapshot = await matchRef
        .collection("entries")
        .get();
      const existingEntriesByName = new Map();

      existingEntriesSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!data?.name) return;

        existingEntriesByName.set(data.name, {
          ref: doc.ref,
          name: data.name,
          points: Number(data.points) || 0,
          rank: Number(data.rank) || 0,
        });
      });

      const mergeBatch = db.batch();

      normalizedEntries.forEach((entry) => {
        const existingEntry = existingEntriesByName.get(entry.name);

        if (!existingEntry) {
          const newEntryRef = matchRef.collection("entries").doc();
          mergeBatch.set(newEntryRef, entry);
          return;
        }

        if (
          existingEntry.points !== entry.points ||
          existingEntry.rank !== entry.rank
        ) {
          mergeBatch.set(existingEntry.ref, entry, { merge: true });
        }

        existingEntriesByName.delete(entry.name);
      });

      await mergeBatch.commit();

      finalEntries = [
        ...normalizedEntries,
        ...Array.from(existingEntriesByName.values()).map((entry) => ({
          name: entry.name,
          points: entry.points,
          rank: entry.rank,
        })),
      ];
    } else {
      const batch = db.batch();

      normalizedEntries.forEach((entry) => {
        const entryRef = matchRef.collection("entries").doc();
        batch.set(entryRef, entry);
      });

      await batch.commit();
    }

    // Rank 0 means did not play. Winner is decided among played players.
    const rankedEntries = finalEntries
      .filter((entry) => entry.rank > 0)
      .sort((a, b) => {
        if (a.rank !== b.rank) return a.rank - b.rank;
        return b.points - a.points;
      });

    const fallbackEntries = [...finalEntries].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.rank - b.rank;
    });

    const winner = rankedEntries[0] || fallbackEntries[0];

    const seasonDoc = await seasonRef.get();
    if (!seasonDoc.exists) {
      await seasonRef.set({ year: parseInt(year) });
    }

    await matchRef.set({
      matchNumber,
      matchName,
      date,
      winnerName: winner?.name || "",
      winningPoints: winner?.points || 0,
      createdAt: existingMatch.exists
        ? existingMatch.data()?.createdAt ||
          admin.firestore.FieldValue.serverTimestamp()
        : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(existingMatch.exists ? 200 : 201).json({
      message: existingMatch.exists
        ? "Match updated successfully"
        : "Match created successfully",
      winner: winner?.name || "",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// fetching leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { year } = req.params;

    const matchesRef = db.collection("seasons").doc(year).collection("matches");

    const matchesSnapshot = await matchesRef.get();

    if (matchesSnapshot.empty) {
      return res
        .status(404)
        .json({ message: "No matches found for this season" });
    }

    const matchDocs = matchesSnapshot.docs;
    const entriesByMatchId = await loadEntriesByMatchId(matchDocs);
    const leaderboard = {};

    for (const matchDoc of matchDocs) {
      const matchData = matchDoc.data();
      const winner = matchData.winnerName;

      // Count wins from match-level winner field.
      if (winner) {
        if (!leaderboard[winner]) {
          leaderboard[winner] = { wins: 0, totalPoints: 0 };
        }
        leaderboard[winner].wins += 1;
      }

      const entries = entriesByMatchId.get(matchDoc.id) || [];
      entries.forEach((entry) => {
        const { name, points } = entry;
        const normalizedPoints = Number(points);

        if (!name || Number.isNaN(normalizedPoints)) {
          return;
        }

        if (!leaderboard[name]) {
          leaderboard[name] = { wins: 0, totalPoints: 0 };
        }
        leaderboard[name].totalPoints += normalizedPoints;
      });
    }

    //convert object to array
    const result = Object.entries(leaderboard).map(([name, stats]) => ({
      name,
      wins: stats.wins,
      totalPoints: stats.totalPoints,
    }));

    // sort by the same rank rules used across analytics/caps
    result.sort(sortByLeaderboardRank);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// fetching seasons for dropdown
export const getSeasons = async (req, res) => {
  try {
    const snapshot = await db.collection("seasons").get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const seasons = snapshot.docs.map((doc) => doc.id);

    // Sort descending (latest first)
    seasons.sort((a, b) => b - a);

    return res.json(seasons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get Matches
export const getMatches = async (req, res) => {
  try {
    const { year } = req.params;

    const matchesSnapshot = await db
      .collection("seasons")
      .doc(year)
      .collection("matches")
      .orderBy("matchNumber")
      .get();

    const matchDocs = matchesSnapshot.docs;
    const entriesByMatchId = await loadEntriesByMatchId(matchDocs);

    const matches = matchDocs.map((doc) => {
      const matchData = doc.data();
      const entries = entriesByMatchId.get(doc.id) || [];

      return {
        id: doc.id,
        ...matchData,
        entries,
      };
    });

    return res.json(matches);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching matches" });
  }
};

export const getPlayerProfile = async (req, res) => {
  try {
    const { year, name } = req.params;

    const matchesRef = db
      .collection("seasons")
      .doc(year)
      .collection("matches")
      .orderBy("matchNumber");
    const matchesSnapshot = await matchesRef.get();
    const matchDocs = matchesSnapshot.docs;
    const entriesByMatchId = await loadEntriesByMatchId(matchDocs);

    let totalPoints = 0;
    let wins = 0;
    let bestScore = -Infinity;
    let worstScore = Infinity;

    const history = [];

    for (const matchDoc of matchDocs) {
      const matchData = matchDoc.data();

      const entries = entriesByMatchId.get(matchDoc.id) || [];
      const entry = entries.find((e) => e.name === name);

      if (!entry) continue;

      totalPoints += entry.points;
      if (entry.rank === 1) wins += 1;

      bestScore = Math.max(bestScore, entry.points);

      if (entry.points > 0) {
        worstScore = Math.min(worstScore, entry.points);
      }

      history.push({
        matchNumber: matchData.matchNumber,
        points: entry.points,
        rank: entry.rank,
      });
    }
    if (worstScore === Infinity) worstScore = 0;
    const matchesPlayed = history.length;

    const avgPoints =
      matchesPlayed > 0 ? Math.round(totalPoints / matchesPlayed) : 0;
    return res.json({
      name,
      wins,
      matchesPlayed,
      totalPoints,
      avgPoints,
      bestScore,
      worstScore,
      history,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching player profile" });
  }
};

export const comparePlayers = async (req, res) => {
  const { year, player1, player2 } = req.params;

  const matchSnapshot = await db
    .collection("seasons")
    .doc(year)
    .collection("matches")
    .orderBy("matchNumber")
    .get();
  const matchDocs = matchSnapshot.docs;
  const entriesByMatchId = await loadEntriesByMatchId(matchDocs);

  const history = [];

  for (const matchDoc of matchDocs) {
    const matchData = matchDoc.data();
    const entries = entriesByMatchId.get(matchDoc.id) || [];

    const p1 = entries.find((e) => e.name === player1);
    const p2 = entries.find((e) => e.name === player2);

    history.push({
      matchNumber: matchData.matchNumber,
      [player1]: p1 ? p1.points : 0,
      [player2]: p2 ? p2.points : 0,
      [`${player1}_rank`]: p1 ? p1.rank : 0,
      [`${player2}_rank`]: p2 ? p2.rank : 0,
    });
  }
  res.json(history);
};

export const getAllMatches = async (req, res) => {
  try {
    const { year } = req.params;

    const matchesSnapshot = await db
      .collection("seasons")
      .doc(year)
      .collection("matches")
      .orderBy("matchNumber")
      .get();

    const matches = [];

    for (const doc of matchesSnapshot.docs) {
      const matchData = doc.data();

      matches.push({
        id: doc.id,
        ...matchData,
      });
    }

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching matches" });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const { year, matchId } = req.params;

    await db
      .collection("seasons")
      .doc(year)
      .collection("matches")
      .doc(matchId)
      .delete();

    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getSeasonCaps = async (req, res) => {
  try {
    const { year } = req.params;

    const matchesSnapshot = await db
      .collection("seasons")
      .doc(year)
      .collection("matches")
      .get();
    const matchDocs = matchesSnapshot.docs;
    const entriesByMatchId = await loadEntriesByMatchId(matchDocs);

    const playerStats = {};

    let highestScore = { player: "", points: 0 };
    let lowestScore = { player: "", points: Infinity };

    // Entries are stored in each match's subcollection, not inside the match document.
    for (const matchDoc of matchDocs) {
      const matchData = matchDoc.data();
      const winnerName = matchData?.winnerName;

      if (winnerName) {
        if (!playerStats[winnerName]) {
          playerStats[winnerName] = {
            totalPoints: 0,
            matches: 0,
            wins: 0,
          };
        }
        playerStats[winnerName].wins += 1;
      }

      const entries = entriesByMatchId.get(matchDoc.id) || [];
      entries.forEach((entry) => {
        const { name, points } = entry;
        const normalizedPoints = Number(points);

        if (!name || Number.isNaN(normalizedPoints)) {
          return;
        }

        if (!playerStats[name]) {
          playerStats[name] = {
            totalPoints: 0,
            matches: 0,
            wins: 0,
          };
        }

        playerStats[name].totalPoints += normalizedPoints;
        playerStats[name].matches += 1;

        if (normalizedPoints > highestScore.points) {
          highestScore = { player: name, points: normalizedPoints };
        }

        if (normalizedPoints > 0 && normalizedPoints < lowestScore.points) {
          lowestScore = { player: name, points: normalizedPoints };
        }
      });
    }

    let orangeCap = { player: "", points: 0 };
    let blueCap = { player: "", wins: 0 };
    let yellowCap = { player: "", avg: 0 };

    const leaderboardRows = Object.keys(playerStats)
      .map((player) => ({
        name: player,
        wins: playerStats[player].wins,
        totalPoints: playerStats[player].totalPoints,
      }))
      .sort(sortByLeaderboardRank);

    if (leaderboardRows.length > 0) {
      blueCap = {
        player: leaderboardRows[0].name,
        wins: leaderboardRows[0].wins,
      };
    }

    Object.keys(playerStats).forEach((player) => {
      const stats = playerStats[player];
      const avg = stats.totalPoints / stats.matches;

      if (stats.totalPoints > orangeCap.points) {
        orangeCap = { player, points: stats.totalPoints };
      }

      if (avg > Number(yellowCap.avg)) {
        yellowCap = { player, avg: avg.toFixed(2) };
      }
    });

    if (lowestScore.points === Infinity) {
      lowestScore = { player: "", points: 0 };
    }

    res.json({
      orangeCap,
      redCap: highestScore,
      blackCap: lowestScore,
      blueCap,
      yellowCap,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching season caps" });
  }
};
