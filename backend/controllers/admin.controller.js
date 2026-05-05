import { User, Mentor, Mentee, Match, Session, Rating, MentorApplications } from '../models/index.js';
import { sendCredentialsEmail } from '../config/mailer.js';
import { generateUserId } from '../utils/genId.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
    try {
        const totalMentors = await Mentor.count();
        const totalMentees = await Mentee.count();
        const totalMatches = await Match.count();
        const pendingMatches = await Match.count({ where: { status: 'pending' } });

        const recentMatches = await Match.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [
                { 
                    model: Mentee, 
                    // No alias needed here because Mentee -> Match has no alias in index.js
                    include: [{ model: User, as: 'user', attributes: ['usr_name'] }] 
                },
                { 
                    model: Mentor, 
                    // Match.belongsTo(Mentor) doesn't have an alias, but Mentor.belongsTo(User) DOES
                    include: [{ model: User, as: 'user', attributes: ['usr_name'] }] 
                }
            ]
        });

        const totalSessions = await Session.count();
        const completedSessions = await Session.count({ where: { status: 'completed' } });

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalMentors,
                    totalMentees,
                    totalMatches,
                    pendingIssues: pendingMatches,
                    successRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0
                },
                recentMatches
            }
        });
    } catch (error) {
        // This will now catch and explain if there's a typo in your alias
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['usr_password'] },
            include: ['menteeProfile', 'mentorProfile']
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getApplications = async (req, res) => {
    try {
        const { status } = req.query; // 'pending', 'approved', or 'rejected'
        
        const applications = await MentorApplications.findAll({
            where: { status: status || 'pending' },
            order: [['applied_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const application = await MentorApplications.findByPk(id);

        if (status === 'approved' && application.status !== 'approved') {
            const newUsrId = generateUserId();
            const rawPassword = 'Acadara2026!';
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            const acadara_email = application.email.split('@')[0] + '@acadara.com';
            // 1. Create User
            await User.create({
                usr_id: newUsrId,
                usr_name: application.full_name,
                usr_email: acadara_email,
                usr_password: hashedPassword,
                usr_role: 'mentor'
            });

            // 2. Update Mentor Profile (subject/expertise)
            await Mentor.update({
                mentor_subject: application.expertise,
                mentor_topics: application.mentorship_bio
            }, { where: { usr_id: newUsrId } });

            // 3. SEND EMAIL AUTOMATICALLY
            await sendCredentialsEmail(application.email, acadara_email, application.full_name, rawPassword);
        }

        await application.update({ status, reviewed_at: new Date() });

        res.json({ success: true, message: `Application ${status} and email sent.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing approval" });
    }
};