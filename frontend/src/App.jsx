import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider"
import RoleGuard from "./guard/RoleGuard";

// Navigation & Layouts
import { adminNav, menteeNav, mentorNav } from "./constants/NavItems";
import LayoutComponent from "./components/LayoutComponent";
import ErrorPageComponent from "./components/ErrorPageComponent";

// Pages
import LandingPage from "./pages/LandingPage";
import MentorOnboarding from "./pages/MentorOnBoarding";
import MenteeDashboard from "./pages/mentee/MenteeDashboard";
import FindMentors from "./pages/mentee/FindMentors";
import MentorRequests from "./pages/mentee/MentorRequests";
import MenteeSessions from "./pages/mentee/MenteeSessions";
import MenteeChats from "./pages/mentee/MenteeChats";

import MentorDashboard from "./pages/mentor/MentorDashboard";
import MenteeRequests from "./pages/mentor/MenteeRequests";
import MentorSessions from "./pages/mentor/MentorSessions";
import MentorChats from "./pages/mentor/MentorChats";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMonitoring from "./pages/admin/AdminMonitoring";
import AdminReports from "./pages/admin/AdminReports";
import MentorRequest from "./pages/admin/MentorRequest";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route - No Auth Guard */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<MentorOnboarding />} />

        {/* Mentee Portal */}
        <Route path="/mentee/*" element={
          <RoleGuard allowedRole="mentee">
            <LayoutComponent navItems={menteeNav} portalType="mentee">
              <Routes>
                <Route path="dashboard" element={<MenteeDashboard />} />
                <Route path="find" element={<FindMentors />} />
                <Route path="requests" element={<MentorRequests />} />
                <Route path="sessions" element={<MenteeSessions />} />
                <Route path="messages" element={<MenteeChats />} />
                <Route path="*" element={<ErrorPageComponent status={404} />} />
              </Routes>
            </LayoutComponent>
          </RoleGuard>
        } />

        {/* Mentor Portal */}
        <Route path="/mentor/*" element={
          <RoleGuard allowedRole="mentor">
            <LayoutComponent navItems={mentorNav} portalType="mentor">
              <Routes>
                <Route path="dashboard" element={<MentorDashboard />} />
                <Route path="requests" element={<MenteeRequests />} />
                <Route path="sessions" element={<MentorSessions />} />
                <Route path="messages" element={<MentorChats />} />
                <Route path="*" element={<ErrorPageComponent status={404} />} />
              </Routes>
            </LayoutComponent>
          </RoleGuard>
        } />

        {/* Admin Portal */}
        <Route path="/admin/*" element={
          <RoleGuard allowedRole="admin">
            <LayoutComponent navItems={adminNav} portalType="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="mentors" element={<MentorRequest />} />
                {/* <Route path="monitoring" element={<AdminMonitoring />} />
                <Route path="reports" element={<AdminReports />} /> */}
                <Route path="*" element={<ErrorPageComponent status={404} />} />
              </Routes>
            </LayoutComponent>
          </RoleGuard>
        } />

        {/* Global 404 */}
        <Route path="*" element={<ErrorPageComponent status={404} />} />
      </Routes>
    </AuthProvider>
  );
}