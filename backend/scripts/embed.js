import { Mentor } from '../models/index.js';
import { getEmbedding } from '../services/ai.service.js';

const preEmbed = async () => {
  try {
    const mentors = await Mentor.findAll();
    console.log(`Found ${mentors.length} mentors to process...`);

    for (const mentor of mentors) {
      const mentorText = `
        ROLE: Expert Mentor.
        EXPERT SUBJECT: ${mentor.mentor_subject}.
        TOPICS OF EXPERTISE: ${mentor.mentor_topics}.
        YEARS OF EXPERIENCE: ${mentor.mentor_experience}.
      `.trim();
      
      console.log(`Embedding ${mentor.mentor_id}...`);
      const vector = await getEmbedding(mentorText);

      await mentor.update({ mentor_embedding: vector });
    }

    console.log("✅ All mentors pre-embedded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Pre-embedding failed:", error);
    process.exit(1);
  }
};

preEmbed();