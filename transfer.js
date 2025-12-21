const { MongoClient } = require("mongodb");

const SOURCE_URI =
  "mongodb+srv://testuser:test1122@testastro.yb6oqe6.mongodb.net";

const DEST_URI =
  "mongodb+srv://astrovaaniofficial_db_user:Astrovaani%40123@cluster0.al4qxad.mongodb.net";

const DB_NAME = "astro";
const BATCH_SIZE = 1000;

async function transfer() {
  const sourceClient = new MongoClient(SOURCE_URI);
  const destClient = new MongoClient(DEST_URI);

  try {
    console.log("Connecting to source...");
    await sourceClient.connect();

    console.log("Connecting to destination...");
    await destClient.connect();

    const sourceDb = sourceClient.db(DB_NAME);
    const destDb = destClient.db(DB_NAME);

    const collections = await sourceDb.listCollections().toArray();

    console.log(`Found ${collections.length} collections`);

    for (const col of collections) {
      const name = col.name;
      console.log(`\n📦 Transferring collection: ${name}`);

      const sourceCol = sourceDb.collection(name);
      const destCol = destDb.collection(name);

      const cursor = sourceCol.find({});
      let batch = [];
      let total = 0;

      for await (const doc of cursor) {
        batch.push(doc);

        if (batch.length === BATCH_SIZE) {
          await destCol.insertMany(batch, { ordered: false });
          total += batch.length;
          batch = [];
        }
      }

      if (batch.length > 0) {
        await destCol.insertMany(batch, { ordered: false });
        total += batch.length;
      }

      console.log(`✅ ${name} transferred: ${total} documents`);
    }

    console.log("\n🎉 ALL collections transferred successfully");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await sourceClient.close();
    await destClient.close();
  }
}

transfer();
