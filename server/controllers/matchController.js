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