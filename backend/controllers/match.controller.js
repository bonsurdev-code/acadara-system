import * as matchService from "../services/matching.service.js";
import { Mentee, Mentor } from "../models/index.js";

export const matchFromProfile = async (req, res) => {
  try {
    const mentee = await Mentee.findOne({ where: { usr_id: req.user.usr_id } });
    if (!mentee) return res.status(404).json({ message: "Mentee profile not found" });

    const matches = await matchService.matchMentorsFromProfile(mentee.mentee_id);
    return res.json({ success: true, count: matches.length, recommendations: matches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const requestMentorship = async (req, res) => {
  try {
    const mentee_id = "MNT-" + req.user.usr_id;
    const newRequest = await matchService.createMatchRequest({ ...req.body, mentee_id });

    res.status(201).json({ success: true, message: "Request sent", data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMenteeRequests = async (req, res) => {
  try {
    const mentee = await Mentee.findOne({ where: { usr_id: req.user.usr_id } });
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    const requests = await matchService.getMatchesByMentee(mentee.mentee_id);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMentorRequests = async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ where: { usr_id: req.user.usr_id } });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const requests = await matchService.getMatchesByMentor(mentor.mentor_id);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { match_id } = req.params;
    const { status, match_metadata } = req.body;
    
    const mentor = await Mentor.findOne({ where: { usr_id: req.user.usr_id } });
    if (!mentor) return res.status(403).json({ message: "Unauthorized: Not a mentor" });

    const result = await matchService.updateMatchStatus(match_id, mentor.mentor_id, status, match_metadata);
    
    res.status(200).json({ success: true, message: `Request ${status}`, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const terminateMentorship = async (req, res) => {
  try {
    const { match_id } = req.params;
    
    // We update the status to 'expired' to preserve history
    const result = await matchService.expireMatch(match_id);
    
    res.status(200).json({ 
      success: true, 
      message: "Mentorship marked as expired. History preserved.", 
      data: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};