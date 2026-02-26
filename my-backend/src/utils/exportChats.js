// const { MongoClient } = require("mongodb");
// const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// const uri =
//   "mongodb+srv://Dave:Dave123@aihr.nfqznpo.mongodb.net/?retryWrites=true&w=majority&appName=AIHR";

// async function exportChatData() {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db("test");
//     const collection = db.collection("chatsessions");

//     // ====== Export sessions.csv ======
//     const sessionsCursor = collection.find(
//       {},
//       {
//         projection: {
//           _id: 0,
//           session_id: 1,
//           user_id: 1,
//           topic: 1,
//           genre: 1,
//           status: 1,
//           createdAt: 1,
//           lastUpdatedAt: 1,
//         },
//       }
//     );

//     const sessions = await sessionsCursor.toArray();
//     const sessionsCsvWriter = createCsvWriter({
//       path: "sessions.csv",
//       header: [
//         { id: "session_id", title: "session_id" },
//         { id: "user_id", title: "user_id" },
//         { id: "topic", title: "topic" },
//         { id: "genre", title: "genre" },
//         { id: "status", title: "status" },
//         { id: "createdAt", title: "createdAt" },
//         { id: "lastUpdatedAt", title: "lastUpdatedAt" },
//       ],
//     });
//     await sessionsCsvWriter.writeRecords(sessions);
//     console.log("sessions.csv exported!");

//     // ====== Export messages.csv ======
//     const messagesCursor = collection.aggregate([
//       { $unwind: "$messages" },
//       {
//         $project: {
//           _id: 0,
//           session_id: 1,
//           from: "$messages.from",
//           message: "$messages.message",
//           time: "$messages.time",
//           message_id: "$messages._id",
//         },
//       },
//     ]);

//     const messages = await messagesCursor.toArray();
//     const messagesCsvWriter = createCsvWriter({
//       path: "messages.csv",
//       header: [
//         { id: "session_id", title: "session_id" },
//         { id: "from", title: "from" },
//         { id: "message", title: "message" },
//         { id: "time", title: "time" },
//         { id: "message_id", title: "message_id" },
//       ],
//     });
//     await messagesCsvWriter.writeRecords(messages);
//     console.log("messages.csv exported!");

//     console.log(
//       "✅ Export complete! Two CSV files created: sessions.csv & messages.csv"
//     );
//   } catch (err) {
//     console.error("Error:", err);
//   } finally {
//     await client.close();
//   }
// }

// exportChatData();
