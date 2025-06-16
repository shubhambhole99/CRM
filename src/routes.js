
// export const Routes = {
//     // pages
//     DashboardOverview: { path: "/dashboard/overview" },
//     Transactions: { path: "/transactions" },
//     Settings: { path: "/settings" },
//     Upgrade: { path: "/upgrade" },
//     BootstrapTables: { path: "/tables/bootstrap-tables" },
//     Carousel: {path: "/projects/createProjects"},
//     Motivation: {path: "/projects/:id"},
//     Service: {path: "/projects/editprojects"},
//     Banner: {path: "/tasks/createTasks"},
//     Aboutus: {path: "/tasks/viewTasks"},
//     Testimonial: {path: "/about/testimonial"},
//     Services: {path: "/services/services"},
//     Contact: {path: "/contact/contact"},
//     Uploadblog: {path: "/blog/uploadblog"},
//     Billing: { path: "/examples/billing" },
//     Invoice: { path: "/examples/invoice" },
//     Signin: { path: "/sign-in" },
//     Signup: { path: "/examples/sign-up" },
//     ForgotPassword: { path: "/examples/forgot-password" },
//     ResetPassword: { path: "/examples/reset-password" },
//     Lock: { path: "/examples/lock" },
//     NotFound: { path: "/examples/404" },
//     ServerError: { path: "/examples/500" },

//     // docs
//     DocsOverview: { path: "/documentation/overview" },
//     DocsDownload: { path: "/documentation/download" },
//     DocsQuickStart: { path: "/documentation/quick-start" },
//     DocsLicense: { path: "/documentation/license" },
//     DocsFolderStructure: { path: "/documentation/folder-structure" },
//     DocsBuild: { path: "/documentation/build-tools" },
//     DocsChangelog: { path: "/documentation/changelog" },

//     // components
//     Accordions: { path: "/components/accordions" },
//     Alerts: { path: "/components/alerts" },
//     Badges: { path: "/components/badges" },
//     Widgets: { path: "/widgets" },
//     Breadcrumbs: { path: "/components/breadcrumbs" },
//     Buttons: { path: "/components/buttons" },
//     Forms: { path: "/components/forms" },
//     Modals: { path: "/components/modals" },
//     Navs: { path: "/components/navs" },
//     Navbars: { path: "/components/navbars" },
//     Pagination: { path: "/components/pagination" },
//     Popovers: { path: "/components/popovers" },
//     Progress: { path: "/components/progress" },
//     Tables: { path: "/components/tables" },
//     Tabs: { path: "/components/tabs" },
//     Tooltips: { path: "/components/tooltips" },
//     Toasts: { path: "/components/toasts" },
//     WidgetsComponent: { path: "/components/widgets" }
// };



export const Routes = {
    // pages
    DashboardOverview: { path: "/dashboard/overview" },
    Transactions: { path: "/transactions" },
    Settings: { path: "/settings" },
    Upgrade: { path: "/upgrade" },
    BootstrapTables: { path: "/tables/bootstrap-tables" },
    // Projects
    CreateProjects: {path: "/projects/createProjects"},
    ViewProjects: {path: "/projects/:id"},
    Client: {path: "/projectss/:id"},
    Service: {path: "/projects/editprojects"},
    Question:{path:"/projects/question"},

    // Tasks
    CreateTasks: {path: "/tasks/createTasks"},
    ViewTasks: {path: "/tasks/viewTasks"},
    Kanban:{path:"/tasks/kanban"},

    // Buckets
    CreateBucket: {path: "/buckets/createBucket"},
    ViewBucket: {path: "/buckets/viewBucket"},

  
    // Aboutus
    Testimonial: {path: "/about/testimonial"},
    Services: {path: "/services/services"},
    Contact: {path: "/contact/contact"},
    ViewContacts:{path:"/contacts"},
    Uploadblog: {path: "/blog/uploadblog"},
    Billing: { path: "/examples/billing" },
    Invoice: { path: "/examples/invoice" },
    Signin: { path: "/sign-in" },
    Signup: { path: "/sign-up" },
    ForgotPassword: { path: "/examples/forgot-password" },
    ResetPassword: { path: "/examples/reset-password" },
    Lock: { path: "/examples/lock" },
    NotFound: { path: "/examples/404" },
    ServerError: { path: "/examples/500" },

    // docs
    DocsOverview: { path: "/documentation/overview" },
    DocsDownload: { path: "/documentation/download" },
    DocsQuickStart: { path: "/documentation/quick-start" },
    DocsLicense: { path: "/documentation/license" },
    DocsFolderStructure: { path: "/documentation/folder-structure" },
    DocsBuild: { path: "/documentation/build-tools" },
    DocsChangelog: { path: "/documentation/changelog" },

    // components
    Accordions: { path: "/components/accordions" },
    Alerts: { path: "/components/alerts" },
    Badges: { path: "/components/badges" },
    Widgets: { path: "/widgets" },
    Breadcrumbs: { path: "/components/breadcrumbs" },
    Buttons: { path: "/components/buttons" },
    Forms: { path: "/components/forms" },
    Modals: { path: "/components/modals" },
    Navs: { path: "/components/navs" },
    Navbars: { path: "/components/navbars" },
    Pagination: { path: "/components/pagination" },
    Popovers: { path: "/components/popovers" },
    Progress: { path: "/components/progress" },
    Tables: { path: "/components/tables" },
    Tabs: { path: "/components/tabs" },
    Tooltips: { path: "/components/tooltips" },
    Toasts: { path: "/components/toasts" },
    WidgetsComponent: { path: "/components/widgets" },

    // Added Later
    // Correspondence
    CreateNode:{path:"/correspondence/create"},
    ViewNode:{path:"/correspondence/view"},

    // ViewLetter:{path:"/correspondence/view"},

    // Tools
    


    // Finance
    CreateInvoice:{path:'/billing/createinvoice'},
    CreateCredit:{path:'/billing/createBill'},
    CreateDinvoice:{path:"/billing/createDinvoice"},
    CreateExpenses:{path:"/billing/createExpenses"},
    CreateRecurring:{path:"/billing/createRecurring"},
    viewBills:{path:'/billing/viewBills'},
    viewDebits:{path:"/billing/viewDebits"},
    createConsolidated:{path:"/billing/createConsolidated"},
    viewConsolidated:{path:"/billing/viewConsolidated"},

    // Credit

    // Format
    // CreateFeasibility
    CreateTemplate:{path:"/feasibility/createTemplate"},
    // CreateFileTemplate
    CreateFormat:{path:'/format/create'},

    ViewTemplate:{path:"/format/viewTemplate"},
    // EditFeasibility
    EditFeasibility:{path:"/feasibility/:id"},
    // EditFeasibility
    EditFormat:{path:"/format/:id"},
    AddWatermark:{path:"/tools/addWatermark"},
    AddWatermarks:{path:"/tools/addWatermarks"},

    Questions:{path:'/format/questions'},

    // Routes
    viewRoutes:{path:'/routes/viewRoutes'},

    // User
    createUser:{path:"/user/createUser"},
    viewUser:{path:"/user/viewUser"},
    


    
};