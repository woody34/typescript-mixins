import { MongoClient } from "$mongo";

export const client = new MongoClient();
await client.connect(
  "mongodb://localhost:27017/test",
);

const database = client.database();

export function disconnect(): void {
  client.close();
}

export default database;
