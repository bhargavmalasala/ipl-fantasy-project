import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import matchRoutes from "./routes/matchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { db } from "./config/firebase.js";

const app = express();   

app.use(cors()); 
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", matchRoutes);

app.get("/", (req, res) => {
  res.send("IPL Fantasy Tracker API Running");
});

//  Firestore test route
// app.get("/test-db", async (req, res) => {
//   try {
//     await db.collection("test").doc("ping").set({
//       message: "Firestore connected successfully",
//     });

//     res.send("Firestore connected!");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Connection failed");
//   }
// });




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});