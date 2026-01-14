export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  isDisabled?: boolean
  collapsed?: boolean
  children?: MenuItemType[]
}

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassName?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
}
export type TabMenuItem = {
  index: number
  name: string
  icon: string
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboards',
    label: 'Dashboards',
    icon: 'ri-dashboard-2-line',
    collapsed: false,
    children: [
      {
        key: 'analytics',
        label: 'Analytics',
        url: '/dashboards/analytics',
        parentKey: 'dashboards',
      },
      {
        key: 'agent',
        label: 'Agent',
        url: '/dashboards/agent',
        parentKey: 'dashboards',
      },
      {
        key: 'customer',
        label: 'Customer',
        url: '/dashboards/customer',
        parentKey: 'dashboards',
      },
    ],
  },
  {
    key: 'property',
    label: 'Property',
    icon: 'ri-community-line',
    collapsed: true,
    children: [
      {
        key: 'property-grid',
        label: 'Property Grid',
        url: '/property/grid',
        parentKey: 'property',
      },
      {
        key: 'property-list',
        label: 'Property List',
        url: '/property/list',
        parentKey: 'property',
      },
      {
        key: 'property-details',
        label: 'Property Details',
        url: '/property/details',
        parentKey: 'property',
      },
      {
        key: 'add-property',
        label: 'Add Property',
        url: '/property/add',
        parentKey: 'property',
      },
    ],
  },
  {
    key: 'agents',
    label: 'Agents',
    icon: 'ri-group-line',
    collapsed: true,
    children: [
      {
        key: 'agents-list',
        label: 'List View',
        url: '/agents/list',
        parentKey: 'agents',
      },
      {
        key: 'agents-grid-view',
        label: 'Grid View',
        url: '/agents/grid',
        parentKey: 'agents',
      },
      {
        key: 'agent-details',
        label: 'Agent Details',
        url: '/agents/details',
        parentKey: 'agents',
      },
      {
        key: 'add-agent',
        label: 'Add Agent',
        url: '/agents/add',
        parentKey: 'agents',
      },
    ],
  },
  {
    key: 'customers',
    label: 'Customers',
    icon: 'ri-contacts-book-3-line',
    collapsed: true,
    children: [
      {
        key: 'list-view',
        label: 'List View',
        url: '/customers/list',
        parentKey: 'customers',
      },
      {
        key: 'grid-view',
        label: 'Grid View',
        url: '/customers/grid',
        parentKey: 'customers',
      },
      {
        key: 'customer-details',
        label: 'Customer Details',
        url: '/customers/details',
        parentKey: 'customers',
      },
      {
        key: 'add-customer',
        label: 'Add Customer',
        url: '/customers/add',
        parentKey: 'customers',
      },
    ],
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: 'ri-home-office-line',
    url: '/orders',
  },
  {
    key: 'transactions',
    label: 'Transactions',
    icon: 'ri-arrow-left-right-line',
    url: '/transactions',
  },
  {
    key: 'reviews',
    label: 'Reviews',
    icon: 'ri-chat-quote-line',
    url: '/reviews',
  },
  {
    key: 'messages',
    label: 'Messages',
    icon: 'ri-discuss-line',
    url: '/messages',
  },
  {
    key: 'inbox',
    label: 'Inbox',
    icon: 'ri-inbox-line',
    url: '/inbox',
  },
  {
    key: 'post',
    label: 'Post',
    icon: 'ri-news-line',
    collapsed: true,
    children: [
      {
        key: 'post',
        label: 'Post',
        url: '/post',
        parentKey: 'post',
      },
      {
        key: 'post-details',
        label: 'Post Details',
        url: '/post/details',
        parentKey: 'post',
      },
      {
        key: 'create-post',
        label: 'Create Post',
        url: '/post/create',
        parentKey: 'post',
      },
    ],
  },
  {
    key: 'custom',
    label: 'CUSTOM',
    isTitle: true,
  },
  {
    key: 'pages',
    label: 'Pages',
    icon: 'ri-pages-line',
    collapsed: true,
    children: [
      {
        key: 'welcome',
        label: 'Welcome',
        url: '/pages/starter',
        parentKey: 'pages',
      },
      {
        key: 'calendar',
        label: 'Calendar',
        url: '/pages/calendar',
        parentKey: 'pages',
      },
      {
        key: 'invoice',
        label: 'Invoice',
        url: '/pages/invoice',
        parentKey: 'pages',
      },
      {
        key: 'faqs',
        label: 'FAQs',
        url: '/pages/faqs',
        parentKey: 'pages',
      },
      {
        key: 'coming-soon',
        label: 'Coming Soon',
        url: '/pages/coming-soon',
        parentKey: 'pages',
      },
      {
        key: 'timeline',
        label: 'Timeline',
        url: '/pages/timeline',
        parentKey: 'pages',
      },
      {
        key: 'pricing',
        label: 'Pricing',
        url: '/pages/pricing',
        parentKey: 'pages',
      },
      {
        key: 'maintenance',
        label: 'Maintenance',
        url: '/pages/maintenance',
        parentKey: 'pages',
      },
      {
        key: '404-error',
        label: '404 Error',
        url: '/pages/404-error',
        parentKey: 'pages',
      },
      {
        key: '404-error(alt)',
        label: '404 Error (alt)',
        url: '/pages/404-alt',
        parentKey: 'pages',
      },
    ],
  },
  {
    key: 'auth',
    label: 'Authentication',
    icon: 'ri-lock-password-line',
    collapsed: true,
    children: [
      {
        key: 'sign-in',
        label: 'Sign In',
        url: '/auth/sign-in',
        parentKey: 'auth',
      },
      {
        key: 'sign-up',
        label: 'Sign Up',
        url: '/auth/sign-up',
        parentKey: 'auth',
      },
      {
        key: 'reset-password',
        label: 'Reset Password',
        url: '/auth/reset-password',
        parentKey: 'auth',
      },
      {
        key: 'lock-screen',
        label: 'Lock Screen',
        url: '/auth/lock-screen',
        parentKey: 'auth',
      },
    ],
  },
  {
    key: 'widgets',
    label: 'Widgets',
    icon: 'ri-shapes-line',
    badge: {
      text: 'Hot',
      variant: 'danger',
    },
    url: '/widgets',
  },
  {
    key: 'Components',
    label: 'COMPONENTS',
    isTitle: true,
  },
  {
    key: 'base-ui',
    label: 'Base UI',
    icon: 'ri-contrast-drop-line',
    collapsed: true,
    children: [
      {
        key: 'accordion',
        label: 'Accordion',
        url: '/ui/accordion',
        parentKey: 'base-ui',
      },
      {
        key: 'alerts',
        label: 'Alerts',
        url: '/ui/alerts',
        parentKey: 'base-ui',
      },
      {
        key: 'avatar',
        label: 'Avatar',
        url: '/ui/avatar',
        parentKey: 'base-ui',
      },
      {
        key: 'badge',
        label: 'Badge',
        url: '/ui/badge',
        parentKey: 'base-ui',
      },
      {
        key: 'breadcrumb',
        label: 'Breadcrumb',
        url: '/ui/breadcrumb',
        parentKey: 'base-ui',
      },
      {
        key: 'buttons',
        label: 'Buttons',
        url: '/ui/buttons',
        parentKey: 'base-ui',
      },
      {
        key: 'cards',
        label: 'Cards',
        url: '/ui/card',
        parentKey: 'base-ui',
      },
      {
        key: 'carousel',
        label: 'Carousel',
        url: '/ui/carousel',
        parentKey: 'base-ui',
      },
      {
        key: 'collapse',
        label: 'Collapse',
        url: '/ui/collapse',
        parentKey: 'base-ui',
      },
      {
        key: 'dropdown',
        label: 'Dropdown',
        url: '/ui/dropdown',
        parentKey: 'base-ui',
      },
      {
        key: 'list-group',
        label: 'List Group',
        url: '/ui/list-group',
        parentKey: 'base-ui',
      },
      {
        key: 'modals',
        label: 'Modals',
        url: '/ui/modal',
        parentKey: 'base-ui',
      },
      {
        key: 'tabs',
        label: 'Tabs',
        url: '/ui/tabs',
        parentKey: 'base-ui',
      },
      {
        key: 'offcanvas',
        label: 'Offcanvas',
        url: '/ui/offcanvas',
        parentKey: 'base-ui',
      },
      {
        key: 'pagination',
        label: 'Pagination',
        url: '/ui/pagination',
        parentKey: 'base-ui',
      },
      {
        key: 'placeholders',
        label: 'Placeholders',
        url: '/ui/placeholders',
        parentKey: 'base-ui',
      },
      {
        key: 'popovers',
        label: 'Popovers',
        url: '/ui/popovers',
        parentKey: 'base-ui',
      },
      {
        key: 'progress',
        label: 'Progress',
        url: '/ui/progress',
        parentKey: 'base-ui',
      },
      {
        key: 'scrollspy',
        label: 'Scrollspy',
        url: '/ui/scrollspy',
        parentKey: 'base-ui',
      },
      {
        key: 'spinners',
        label: 'spinners',
        url: '/ui/spinners',
        parentKey: 'base-ui',
      },
      {
        key: 'toasts',
        label: 'Toasts',
        url: '/ui/toasts',
        parentKey: 'base-ui',
      },
      {
        key: 'tooltips',
        label: 'Tooltips',
        url: '/ui/tooltips',
        parentKey: 'base-ui',
      },
    ],
  },
  {
    key: 'advanced-ul',
    label: 'Advanced Ul',
    icon: 'ri-briefcase-line',
    collapsed: true,
    children: [
      {
        key: 'ratings',
        label: 'Ratings',
        url: '/extended/ratings',
        parentKey: 'advanced-ul',
      },
      {
        key: 'alert',
        label: 'Sweet Alert',
        url: '/extended/sweet-alert',
        parentKey: 'advanced-ul',
      },
      {
        key: 'swiper',
        label: 'Swiper Slider',
        url: '/extended/swiper-slider',
        parentKey: 'advanced-ul',
      },
      {
        key: 'scrollbar',
        label: 'Scrollbar',
        url: '/extended/scrollbar',
        parentKey: 'advanced-ul',
      },
      {
        key: 'toastify',
        label: 'Toastify',
        url: '/extended/toastify',
        parentKey: 'advanced-ul',
      },
    ],
  },
  {
    key: 'charts',
    label: 'charts',
    icon: 'ri-bar-chart-line',
    collapsed: true,
    children: [
      {
        key: 'area',
        label: 'Area',
        url: '/charts/area',
        parentKey: 'charts',
      },
      {
        key: 'bar',
        label: 'Bar',
        url: '/charts/bar',
        parentKey: 'charts',
      },
      {
        key: 'bubble',
        label: 'Bubble',
        url: '/charts/bubble',
        parentKey: 'charts',
      },
      {
        key: 'candlestick',
        label: 'Candlestick',
        url: '/charts/candlestick',
        parentKey: 'charts',
      },
      {
        key: 'column',
        label: 'Column',
        url: '/charts/column',
        parentKey: 'charts',
      },
      {
        key: 'heatmap',
        label: 'Heatmap',
        url: '/charts/heatmap',
        parentKey: 'charts',
      },
      {
        key: 'line',
        label: 'Line',
        url: '/charts/line',
        parentKey: 'charts',
      },
      {
        key: 'mixed',
        label: 'Mixed',
        url: '/charts/mixed',
        parentKey: 'charts',
      },
      {
        key: 'charts-timeline',
        label: 'Timeline',
        url: '/charts/timeline',
        parentKey: 'charts',
      },
      {
        key: 'boxplot',
        label: 'Boxplot',
        url: '/charts/boxplot',
        parentKey: 'charts',
      },
      {
        key: 'treemap',
        label: 'Treemap',
        url: '/charts/treemap',
        parentKey: 'charts',
      },
      {
        key: 'pie',
        label: 'Pie',
        url: '/charts/pie',
        parentKey: 'charts',
      },
      {
        key: 'radar',
        label: 'Radar',
        url: '/charts/radar',
        parentKey: 'charts',
      },
      {
        key: 'radial-bar',
        label: 'RadialBar',
        url: '/charts/radial-bar',
        parentKey: 'charts',
      },
      {
        key: 'scatter',
        label: 'Scatter',
        url: '/charts/scatter',
        parentKey: 'charts',
      },
      {
        key: 'polar',
        label: 'Polar Area',
        url: '/charts/polar',
        parentKey: 'charts',
      },
    ],
  },
  {
    key: 'forms',
    label: 'Forms',
    icon: 'ri-survey-line',
    collapsed: true,
    children: [
      {
        key: 'basic',
        label: 'Basic Element',
        url: '/forms/basic',
        parentKey: 'forms',
      },
      {
        key: 'checkbox',
        label: 'Checkbox & Radio ',
        url: '/forms/checkbox',
        parentKey: 'forms',
      },
      {
        key: 'select',
        label: 'Choices Select',
        url: '/forms/choices',
        parentKey: 'forms',
      },
      {
        key: 'clipboard',
        label: 'Clipboard',
        url: '/forms/clipboard',
        parentKey: 'forms',
      },
      {
        key: 'flat-picker',
        label: 'Flatepicker',
        url: '/forms/flat-picker',
        parentKey: 'forms',
      },
      {
        key: 'validation',
        label: 'Validation',
        url: '/forms/validation',
        parentKey: 'forms',
      },
      {
        key: 'wizard',
        label: 'Wizard',
        url: '/forms/wizard',
        parentKey: 'forms',
      },
      {
        key: 'file-uploads',
        label: 'File Upload',
        url: '/forms/file-uploads',
        parentKey: 'forms',
      },
      {
        key: 'editors',
        label: 'Editors',
        url: '/forms/editors',
        parentKey: 'forms',
      },
      {
        key: 'input-mask',
        label: 'Input Mask',
        url: '/forms/input-mask',
        parentKey: 'forms',
      },
      {
        key: 'range-slider',
        label: 'Slider',
        url: '/forms/range-slider',
        parentKey: 'forms',
      },
    ],
  },
  {
    key: 'tables',
    label: 'Tables',
    icon: 'ri-table-line',
    collapsed: true,
    children: [
      {
        key: 'tables-basic',
        label: 'Basic Tables',
        url: '/tables/basic',
        parentKey: 'tables',
      },
      {
        key: 'dataTable',
        label: 'DataTables',
        url: '/tables/data-table',
        parentKey: 'tables',
      },
    ],
  },
  {
    key: 'icons',
    label: 'Icons',
    icon: 'ri-pencil-ruler-2-line',
    collapsed: true,
    children: [
      {
        key: 'remix-icons',
        label: 'Remix Icons',
        url: '/icons/remix',
        parentKey: 'icons',
      },
      {
        key: 'solar-icons',
        label: 'Solar Icons',
        url: '/icons/solar',
        parentKey: 'icons',
      },
    ],
  },
  {
    key: 'maps',
    label: 'Maps',
    icon: 'ri-road-map-line',
    collapsed: true,
    children: [
      {
        key: 'google',
        label: 'Google Maps',
        url: '/maps/google',
        parentKey: 'maps',
      },
      {
        key: 'vector',
        label: 'Vector Maps',
        url: '/maps/vector',
        parentKey: 'maps',
      },
    ],
  },
  {
    key: 'style',
    label: 'STYLE',
    isTitle: true,
  },
  {
    key: 'badge-menu',
    label: 'Badge Menu',
    badge: { text: '1', variant: 'primary' },
    icon: 'ri-shield-star-line',
  },
  {
    key: 'menu-items',
    label: 'Menu Item',
    icon: 'ri-share-line',
    collapsed: true,
    children: [
      {
        key: 'menu-items-1',
        label: 'Menu Items 1',
        parentKey: 'menu-items',
      },
      {
        key: 'menu-items-2',
        label: 'Menu Items 2',
        parentKey: 'menu-items',
        children: [
          {
            key: 'menu sub item',
            label: 'Menu Sub Item',
            parentKey: 'menu-items-2',
          },
        ],
      },
    ],
  },
  {
    key: ' Disable Item',
    label: ' Disable Item',
    icon: 'ri-prohibited-2-line',
    isDisabled: true,
  },
]
