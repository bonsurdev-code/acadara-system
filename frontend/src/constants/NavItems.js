import { 
    LayoutDashboard,
    Search,
    ClipboardList,
    CalendarDays,
    MessageSquare,
    Star,
    User,
    Activity,
    BarChart3
} from 'lucide-react';

export const menteeNav = [
  { name: 'Dashboard', path: '/mentee/dashboard', icon: LayoutDashboard },
  { name: 'Find Mentors', path: '/mentee/find', icon: Search },
  { name: 'My Requests', path: '/mentee/requests', icon: ClipboardList },
  { name: 'Sessions', path: '/mentee/sessions', icon: CalendarDays },
  { name: 'Messages', path: '/mentee/messages', icon: MessageSquare }
];

export const mentorNav = [
  { name: 'Dashboard', path: '/mentor/dashboard', icon: LayoutDashboard },
  { name: 'Requests', path: '/mentor/requests', icon: ClipboardList },
  { name: 'Sessions', path: '/mentor/sessions', icon: CalendarDays },
  { name: 'Messages', path: '/mentor/messages', icon: MessageSquare }
];

export const adminNav = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  // { name: 'Monitoring', path: '/admin/monitoring', icon: Activity },
  // { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Mentors', path: '/admin/mentors', icon: Star },
  { name: 'Users', path: '/admin/users', icon: User },
];