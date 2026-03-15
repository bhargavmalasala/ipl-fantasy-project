import { match } from "assert";
import { db } from "../config/firebase.js";
import admin from "firebase-admin";

export const createMatch = async (req, res) => {
  try {
    const { matchNumber, date, entries } = req.body;
    const { year } = req.params;

    if (!matchNumber || !date || !entries || entries.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const seasonRef = db.collection("seasons").doc(year);
    const matchId = `match_${matchNumber.toString().padStart(2, "0")}`;
    const matchRef = seasonRef.collection("matches").doc(matchId);

    const existingMatch = await matchRef.get();
    if (existingMatch.exists) {
      return res.status(400).json({ message: "Match already exists" });
    }

    entries.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return a.rank - b.rank;
    });

    const winner = entries[0];

    const seasonDoc = await seasonRef.get();
    if (!seasonDoc.exists) {
      await seasonRef.set({ year: parseInt(year) });
    }

    await matchRef.set({
      matchNumber,
      date,
      winnerName: winner.name,
      winningPoints: winner.points,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const batch = db.batch();

    entries.forEach((entry) => {
      const entryRef = matchRef.collection("entries").doc();
      batch.set(entryRef, entry);
    });

    await batch.commit();

    return res.status(201).json({
      message: "Match created successfully",
      winner: winner.name,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// fetching leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const {year} = req.params;

    const matchesRef = db.collection("seasons").doc(year).collection("matches");

    const matchesSnapshot = await matchesRef.get();

    if (matchesSnapshot.empty) {
      return res.status(404).json({ message: "No matches found for this season" });
    }

    const leaderboard = {};

    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data();
      const winner = matchData.winnerName;

      //Count wins
      if(!leaderboard[winner]){
        leaderboard[winner] = { wins: 0, totalPoints: 0 };
      }
      leaderboard[winner].wins += 1;

      const entriesSnapshot = await matchDoc.ref.collection("entries").get();
      entriesSnapshot.forEach((entryDoc) => {
        const {name, points} = entryDoc.data();

        if(!leaderboard[name]){
          leaderboard[name] = { wins: 0, totalPoints: 0 };
        }
        leaderboard[name].totalPoints += points;
      });
    }

    //convert object to array 
    const result = Object.entries(leaderboard).map(([name, stats]) => ({
      name,
      wins: stats.wins,
      totalPoints: stats.totalPoints,
    }));

    //sort by wins and then points
    result.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.totalPoints - a.totalPoints;
    });

    return res.json(result);



  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
    
  }
}

// fetching seasons for dropdown
export const getSeasons = async (req, res) => {
  try {
    const snapshot = await db.collection("seasons").get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const seasons = snapshot.docs.map(doc => doc.id);

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

    const matchesSnapshot = await db.collection("seasons").doc(year).collection("matches").orderBy("matchNumber").get();

    const matches = [];
    
    for (const doc of matchesSnapshot.docs) {
      const matchData = doc.data();
      const entriesSnapshot = await doc.ref.collection("entries").get();
      const entries = entriesSnapshot.docs.map((e) => e.data());

      matches.push({
        id: doc.id, 
        ...matchData, 
        entries });
    }

    return res.json(matches);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching matches" });
  }
}

export const getPlayerProfile = async (req, res) => {
  try {
    const { year, name } = req.params;

    const matchesRef = db.collection("seasons").doc(year).collection("matches").orderBy("matchNumber");
    const matchesSnapshot = await matchesRef.get();

    let totalPoints = 0;
    let wins = 0;
    let bestScore = -Infinity;
    let worstScore = Infinity;

    const history = [];

    for (const matchDoc of matchesSnapshot.docs) {
      const matchData = matchDoc.data();

      const entriesSnapshot = await matchDoc.ref.collection("entries").get();
      const entry = entriesSnapshot.docs.map((e) => e.data()).find(e => e.name === name);

      if (!entry) continue;

      totalPoints += entry.points;
      if (entry.rank === 1) wins += 1;

      bestScore = Math.max(bestScore, entry.points);
      
      if (entry.points > 0){
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

    const avgPoints = matchesPlayed > 0 ? Math.round(totalPoints / matchesPlayed) : 0;
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
}

export const comparePlayers = async (req, res) => {
  const { year, player1, player2 } = req.params;

  const matchSnapshot = await db.collection("seasons").doc(year).collection("matches").orderBy("matchNumber").get();

  const history = [];

  for (const matchDoc of matchSnapshot.docs) {
    const matchData = matchDoc.data();
    const entriesSnapshot = await matchDoc.ref.collection("entries").get();
    const entries = entriesSnapshot.docs.map((d) => d.data());

    const p1 = entries.find(e => e.name === player1);
    const p2 = entries.find(e => e.name === player2);

    
    history.push({
      matchNumber: matchData.matchNumber,
      [player1]: p1 ? p1.points : 0,
      [player2]: p2 ? p2.points : 0,
      [`${player1}_rank`]: p1 ? p1.rank : 0,
      [`${player2}_rank`]: p2 ? p2.rank : 0,
    });
  }
  res.json(history);
}

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
        ...matchData
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