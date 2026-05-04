import { User, Mentee, Mentor, Match } from '../models/index.js';
import { getEmbedding } from './ai.service.js';
import sequelize from '../config/database.js';

export const getUserFullProfile = async (usr_id, usr_role) => {
  const queryOptions = {
    attributes: ['usr_id', 'usr_name', 'usr_email', 'usr_role'],
    include: []
  };

  if (usr_role === 'mentee') {
    queryOptions.include.push({
      model: Mentee,
      as: 'menteeProfile',
      include: [{ model: Match, attributes: ['status'] }]
    });
  } else if (usr_role === 'mentor') {
    queryOptions.include.push({ model: Mentor, as: 'mentorProfile' });
  }

  const user = await User.findByPk(usr_id, queryOptions);
  if (!user) return null;

  // Format response logic
  const responseData = {
    usr_name: user.usr_name,
    usr_email: user.usr_email,
    usr_role: user.usr_role,
  };

  if (usr_role === 'mentee' && user.menteeProfile) {
    const p = user.menteeProfile;
    const matches = p.Matches || [];
    Object.assign(responseData, {
      subject: p.mentee_subject,
      description: p.mentee_description,
      lvl: p.mentee_lvl,
      availability: p.mentee_availability,
      hasRequested: matches.some(m => m.status === 'pending'),
      isMatched: matches.some(m => m.status === 'accepted')
    });
  } else if (usr_role === 'mentor' && user.mentorProfile) {
    const p = user.mentorProfile;
    Object.assign(responseData, {
      subject: p.mentor_subject,
      topics: p.mentor_topics,
      experience: p.mentor_experience,
      availability: p.mentor_availability
    });
  }

  return responseData;
};

export const updateUserProfile = async (usr_id, usr_role, updateData) => {
  const profileFields = {
    mentee: { subject: 'mentee_subject', description: 'mentee_description', lvl: 'mentee_lvl', availability: 'mentee_availability' },
    mentor: { subject: 'mentor_subject', topics: 'mentor_topics', experience: 'mentor_experience', availability: 'mentor_availability' }
  };

  const roleFields = profileFields[usr_role];
  const dbUpdate = {};

  // 1. Map incoming data to DB columns
  Object.keys(updateData).forEach(key => {
    if (roleFields[key]) {
      dbUpdate[roleFields[key]] = (key === 'availability') 
        ? sequelize.literal(`'${updateData[key]}'::daterange`) 
        : updateData[key];
    }
  });

  // 2. Fetch current profile to handle partial updates
  const Model = usr_role === 'mentee' ? Mentee : Mentor;
  const currentProfile = await Model.findOne({ where: { usr_id } });

  // 3. OPTIMIZED EMBEDDING STRATEGY
  // We use a unified template "Knowledge: [Subject]. Focus: [Topics/Description]"
  // This removes the "Expert" vs "Student" semantic gap.
  
  let subject = "";
  let details = "";

  if (usr_role === 'mentor') {
    subject = updateData.subject || currentProfile?.mentor_subject || "";
    details = updateData.topics || currentProfile?.mentor_topics || "";
    
    const textToEmbed = `KNOWLEDGE AREA: ${subject}. TECHNICAL TOPICS: ${details}.`.toUpperCase();
    dbUpdate.mentor_embedding = await getEmbedding(textToEmbed);
  } else {
    subject = updateData.subject || currentProfile?.mentee_subject || "";
    details = updateData.description || currentProfile?.mentee_description || "";
    
    // We use the SAME structure as the mentor to maximize vector overlap
    const textToEmbed = `KNOWLEDGE AREA: ${subject}. TECHNICAL TOPICS: ${details}.`.toUpperCase();
    dbUpdate.mentee_embedding = await getEmbedding(textToEmbed);
  }

  // 4. Save to Database
  const [updatedRows] = await Model.update(dbUpdate, { where: { usr_id } });
  
  return { updatedRows, dbUpdate };
};