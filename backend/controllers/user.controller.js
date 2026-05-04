import * as userService from '../services/user.service.js';
import { Match, Session, Rating, Mentee, Mentor, User, MentorApplications } from '../models/index.js';
import { Sequelize } from 'sequelize';
import { generateAppId } from '../utils/genId.js';

export const isAuthenticated = async (req, res) => {
  try {
    const profile = await userService.getUserFullProfile(req.user.usr_id, req.user.usr_role);
    if (!profile) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { updatedRows, dbUpdate } = await userService.updateUserProfile(
      req.user.usr_id, 
      req.user.usr_role, 
      req.body
    );

    if (updatedRows === 0) return res.status(404).json({ message: "No changes made" });

    res.status(200).json({ message: "Updated", ai_synced: req.user.usr_role === 'mentor' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { usr_id, usr_role } = req.user;
    let stats = {};

    if (usr_role === 'mentee') {
      const mentee = await Mentee.findOne({ where: { usr_id } });
      const mentee_id = mentee.mentee_id;

      // 1. Active Goals (Accepted matches not yet expired)
      const activeGoals = await Match.count({ 
        where: { mentee_id, status: 'accepted' } 
      });

      // 2. Sessions Completed
      const sessionsCompleted = await Session.count({
        include: [{ model: Match, as: 'match', where: { mentee_id } }],
        where: { status: 'completed' }
      });

      // 3. Avg Feedback (Ratings given BY this mentee)
      const avgFeedback = await Rating.findOne({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('score')), 'average']],
        where: { mentee_id }
      });

      stats = {
        activeGoals,
        sessionsCompleted,
        avgFeedback: parseFloat(avgFeedback?.getDataValue('average') || 0).toFixed(1)
      };

    } else if (usr_role === 'mentor') {
      const mentor = await Mentor.findOne({ where: { usr_id } });
      const mentor_id = mentor.mentor_id;

      // 1. Total Mentees (Accepted matches)
      const totalMentees = await Match.count({ 
        where: { mentor_id, status: 'accepted' } 
      });

      // 2. Knowledge Points (Logic: 10 points per completed session)
      const sessions = await Session.count({
        include: [{ model: Match, as: 'match', where: { mentor_id } }],
        where: { status: 'completed' }
      });

      // 3. Success Rate (Ratio of accepted vs total requests - example logic)
      const totalRequests = await Match.count({ where: { mentor_id } });
      const successRate = totalRequests > 0 ? (totalMentees / totalRequests) * 100 : 100;

      stats = {
        totalMentees,
        knowledgePoints: sessions * 10,
        successRate: `${Math.round(successRate)}%`,
        mentorRank: sessions > 10 ? "Elite" : "Novice"
      };
    }

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentorDashboardData = async (req, res) => {
  try {
    const { usr_id } = req.user;

    const mentor = await Mentor.findOne({ 
      where: { usr_id },
      include: [{ model: User, as: 'user' }] 
    });

    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // 1. Stats Calculation
    const totalMentees = await Match.count({ where: { mentor_id: mentor.mentor_id, status: 'accepted' } });
    const pendingCount = await Match.count({ where: { mentor_id: mentor.mentor_id, status: 'pending' } });
    
    // Knowledge Points (example: 50 base + 20 per accepted mentee)
    const knowledgePoints = 50 + (totalMentees * 20);

    // 2. Fetch Pending Applications (Limited to 3 for the preview)
    const pendingApplications = await Match.findAll({
      where: { mentor_id: mentor.mentor_id, status: 'pending' },
      include: [{ 
        model: Mentee, 
        as: 'Mentee', 
        include: [{ model: User, as: 'user', attributes: ['usr_name'] }] 
      }],
      limit: 3,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      stats: {
        totalMentees,
        mentorRank: totalMentees > 5 ? "Elite" : "Rising Star",
        knowledgePoints,
        successRate: "98%", // Placeholder or calculate based on completed sessions
        pendingCount
      },
      pendingApplications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitApplication = async (req, res) => {
    try {
        const { full_name, email, expertise, linkedin_url, bio } = req.body;

        // Generate a temporary ID for the application record
        // This keeps your VARCHAR(10) requirement satisfied
        const generatedId = generateAppId(); 

        const application = await MentorApplications.create({
            usr_id: generatedId,        // Now it's "AP-XXXXXX" instead of null
            full_name: full_name,
            email: email,
            expertise: expertise,
            linkedin_url: linkedin_url,
            mentorship_bio: bio,
            status: 'pending'
        });

        res.status(201).json({ 
            success: true, 
            message: "Application received!", 
            generated_id: generatedId 
        });
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};