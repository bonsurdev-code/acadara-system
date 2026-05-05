import sequelize from '../config/database.js';
import User from './user.model.js';
import Mentee from './mentee.model.js';
import Mentor from './mentor.model.js';
import Match from './match.model.js';
import Session from './session.model.js'
import Rating from './rating.model.js';
import Message from './message.model.js';
import MentorApplications from './applications.model.js';

// Define Associations
User.hasOne(Mentee, { foreignKey: 'usr_id', as: 'menteeProfile', onDelete: 'CASCADE' });
Mentee.belongsTo(User, { foreignKey: 'usr_id', as: 'user' });

User.hasOne(Mentor, { foreignKey: 'usr_id', as: 'mentorProfile', onDelete: 'CASCADE' });
Mentor.belongsTo(User, { foreignKey: 'usr_id', as: 'user' });

Mentee.hasMany(Match, { foreignKey: 'mentee_id' });
Match.belongsTo(Mentee, { foreignKey: 'mentee_id' });

Mentor.hasMany(Match, { foreignKey: 'mentor_id' });
Match.belongsTo(Mentor, { foreignKey: 'mentor_id' });

Match.hasMany(Session, { foreignKey: 'match_id', as: 'sessions', onDelete: 'CASCADE' });
Session.belongsTo(Match, { foreignKey: 'match_id', as: 'match' });

// Rating Associations
Session.hasOne(Rating, { foreignKey: 'session_id', as: 'rating', onDelete: 'CASCADE' });
Rating.belongsTo(Session, { foreignKey: 'session_id', as: 'session' });

Mentor.hasMany(Rating, { foreignKey: 'mentor_id', as: 'receivedRatings' });
Rating.belongsTo(Mentor, { foreignKey: 'mentor_id', as: 'mentor' });

Mentee.hasMany(Rating, { foreignKey: 'mentee_id', as: 'givenRatings' });
Rating.belongsTo(Mentee, { foreignKey: 'mentee_id', as: 'mentee' });

Match.hasMany(Message, { foreignKey: 'match_id', as: 'messages' });
Message.belongsTo(Match, { foreignKey: 'match_id', as: 'match' });

export {
  sequelize,
  User,
  Mentee,
  Mentor,
  Match,
  Session,
  Rating,
  Message,
  MentorApplications
};