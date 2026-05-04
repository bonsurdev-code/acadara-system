import { getEmbedding } from "./ai.service.js";
import { cosineSimilarity } from "../utils/similarity.js";
import { Mentor, User, Match, Mentee, Session } from "../models/index.js";
import { Op } from 'sequelize';
import crypto from 'crypto';

export const matchMentorsFromProfile = async (menteeId) => {
  // Fetch the pre-calculated embedding for the mentee
  const mentee = await Mentee.findOne({ 
    where: { mentee_id: menteeId },
    attributes: ['mentee_embedding', 'mentee_subject', 'mentee_description']
  });

  if (!mentee || !mentee.mentee_embedding) {
    throw new Error("Mentee profile not indexed for AI matching. Please update your profile.");
  }

  // Pull all mentors who have pre-calculated embeddings
  const mentors = await Mentor.findAll({
    where: { mentor_embedding: { [Op.ne]: null } },
    include: [{
        model: User, 
        as: 'user', 
        attributes: ['usr_name', 'usr_email']
    }]
  });

  // Local Cosine Similarity (Vector vs Vector)
  const recommendations = mentors.map(mentor => {
    const score = cosineSimilarity(mentee.mentee_embedding, mentor.mentor_embedding);
    const textSnapshot = `Subject: ${mentee.mentee_subject}. Goal: ${mentee.mentee_description}.`;

    return {
      match_id: crypto.randomUUID(),
      mentee_id: menteeId,
      mentor_id: mentor.mentor_id,
      text_embedded: textSnapshot,
      similarity_score: score,
      status: 'pending',
      Mentor: mentor
    };
  });

  return recommendations.sort((a, b) => b.similarity_score - a.similarity_score);
};

export const createMatchRequest = async (matchData) => {
    return await Match.create({
        match_id: matchData.match_id,
        mentee_id: matchData.mentee_id,
        mentor_id: matchData.mentor_id,
        text_embedded: matchData.text_embedded,
        similarity_score: matchData.similarity_score,
        status: 'pending'
    });
};

export const getMatchesByMentee = async (menteeId) => {
  return await Match.findAll({
    where: { mentee_id: menteeId },
    include: [
      {
        model: Mentor,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['usr_name', 'usr_email']
          }
        ],
        attributes: ['mentor_subject', 'mentor_topics', 'mentor_experience']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const getMatchesByMentor = async (mentorId) => {
  return await Match.findAll({
    where: { mentor_id: mentorId },
    include: [
      {
        model: Mentee,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['usr_name', 'usr_email']
          }
        ],
        attributes: ['mentee_subject', 'mentee_description', 'mentee_lvl']
      },
      {
        // ADD THIS: Include the sessions for each match
        model: Session,
        as: 'sessions', 
        separate: true, // This allows us to order the nested association
        order: [['createdAt', 'DESC']]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

export const updateMatchStatus = async (match_id, mentor_id, status, match_metadata) => {
  const match = await Match.findOne({ where: { match_id, mentor_id } });
  if (!match) throw new Error("Match request not found or unauthorized");

  await match.update({ status, match_metadata });
  return match;
};

export const expireMatch = async (match_id) => {
  const match = await Match.findByPk(match_id);
  if (!match) throw new Error("Match record not found.");

  match.status = 'expired';
  await match.save();
  
  return match;
};