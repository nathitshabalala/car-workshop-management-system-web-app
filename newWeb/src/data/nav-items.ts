export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

const navItems: NavItem[] = [
  {
    id: 1,
    path: '/',
    title: 'Dashboard',
    icon: 'mingcute:home-1-fill',
    active: false,
  },
  {
    id: 2,
    path: '/managers',
    title: 'Managers',
    icon: 'lucide:user',
    active: false,
  },
  {
    id: 3,
    path: '/mechanics',
    title: 'Mechanics',
    icon: 'lucide:user-round-cog',
    active: false,
  },
  {
    id: 4,
    path: '/customers',
    title: 'Customers',
    icon: 'clarity:users-line',
    active: false,
  },

  {
    id: 5,
    path: '/services',
    title: 'Services',
    icon: 'clarity:wrench-line',
    active: false,
  },
  {
    id: 6,
    path: '/tasks',
    title: 'Tasks',
    icon: 'bi:list-task',
    active: false,
  },
  {
    id: 6,
    path: '/cars',
    title: 'Cars',
    icon: 'clarity:car-line',
    active: false,
  },
  {
    id: 6,
    path: '/invoices',
    title: 'Invoices',
    icon: 'bi:receipt-cutoff',
    active: false,
  },
  // {
  //   id: 7,
  //   path: '#!',
  //   title: 'Invoice',
  //   icon: 'bi:receipt-cutoff',
  //   active: false,
  // },
  // {
  //   id: 8,
  //   path: '#!',
  //   title: 'Appointment',
  //   icon: 'clarity:calendar-line',
  //   active: false,
  // },
  {
    id: 7,
    path: '/reports',
    title: 'Reports',
    icon: 'lucide:line-chart',
    active: false,
  },

  // {
  //   id: 8,
  //   path: '#!',
  //   title: 'Settings',
  //   icon: 'mingcute:settings-3-line',
  //   active: false,
  // },
  // {
  //   id: 9,
  //   path: '#!',
  //   title: 'Favourite',
  //   icon: 'clarity:favorite-line',
  //   active: false,
  // },
  // {
  //   id: 10,
  //   path: '#!',
  //   title: 'History',
  //   icon: 'ic:round-history',
  //   active: false,
  // },
  {
    id: 11,
    path: 'authentication/login',
    title: 'Logout',
    icon: 'tabler:login',
    active: true,
  },
  // {
  //   id: 12,
  //   path: 'authentication/sign-up',
  //   title: 'Sign Up',
  //   icon: 'tdesign:user-add',
  //   active: true,
  // },
];

export default navItems;
