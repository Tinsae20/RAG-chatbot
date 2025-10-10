import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "./db-config";
import { documents } from "./db-schema";
import { generateEmbedding } from "./embeddings";

export async function searchDocuments(
    query: string, 
    limit: number = 5, 
    threshold: number = 0.5
){
      const embedding = await generateEmbedding(query)

      const smililarity = sql<number> `1 - (${cosineDistance(
        documents.embedding,
        embedding
      )})`;

      const similarDocuments = await db.select({
        id: documents.id,
        content: documents.content,
        smililarity
      })
      .from(documents)
      .where(gt(smililarity, threshold))
      .orderBy(desc(smililarity))
      .limit(limit)

      return similarDocuments;
}
