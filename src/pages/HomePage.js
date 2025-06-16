import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";
import { ToastContainer, toast } from 'react-toastify/dist/react-toastify.cjs.development';
import 'react-toastify/dist/ReactToastify.css';
// pages
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import DashBoard from './dashboard/DashBoard';
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";

// Projects
import createProject from "./Projects/createProjects";
import viewProjects from './Projects/viewProjects';
import Service from './Projects/editProjects';


import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import {Sidebar} from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
// tasks
import createTasks from './Tasks/createTasks';
import viewTasks from './Tasks/viewTasks';
import Kanban from './Tasks/Kanban';

import Testimonial from './Tasks/Testimonial';
import Contact from './Contact/Contact';
import viewContact from './Contact/viewContact';
import Uploadblog from './Blog/Uploadblog';
import Servises from './Services/Servises';
// Invoices
import CreateCredit from './Billing/createCredit'
import CreateInvoice from './Billing/createInvoice'
import CreateExpenses from './Billing/createExpenses'
import CreateDinvoice from './Billing/createDebitInvoice'
import CreateRecurring from './Billing/createRecurring';
import viewBills from './Billing/viewBills'
import viewDebits from './Billing/viewDebits'

import CreateConsolidated from './Billing/createConsolidated'
// Format
import CreateTemplate from './format/CreateFeasibility';
import CreateFormat from './format/CreateFileTemplate';
import ViewTemplate from './format/ViewTemplates';
import Questions from './format/questions'
import EditFeasibility from './format/EditFeasibility';
import EditFormat from './format/EditFileTemplate';
import Watermark from './Tools/Watermark';


import createBucket from './Bucket/createBucket';
import viewBucket from './Bucket/viewBucket';
// Routes
import viewRoutes from './Routes/viewRoutes';

// Feasibility


// Users
import createUser from './Users/createUser';

// Tools

import { hot } from 'react-hot-loader/root';


// Create Correspondence
import CreateCorrespondence from './correspondence/CreateCorrespondence'
import viewCorrespondence from './correspondence/viewCorrespondence'
import createRecurring from './Billing/createRecurring';

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

const Homepage = () => (
  <Switch>

  {/* <ToastContainer/> */}
    {<RouteWithLoader exact path={Routes.Signin.path} component={Signin} />}
    <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
    <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
    <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
    <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
    <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
    <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

    {/* pages */}
    <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashBoard} />
    <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} />
    <RouteWithSidebar exact path={Routes.Transactions.path} component={Transactions} />
    <RouteWithSidebar exact path={Routes.Settings.path} component={Settings} />
    <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
    {/* Projects */}
    <RouteWithSidebar exact path={Routes.CreateProjects.path} component={createProject} />
    <RouteWithSidebar exact path={Routes.ViewProjects.path} component={viewProjects} />
    <RouteWithLoader exact path={Routes.Client.path} component={viewProjects} />
    <RouteWithSidebar exact path={Routes.Service.path} component={Service} />



    <RouteWithSidebar exact path={Routes.CreateTasks.path} component={createTasks} />
    <RouteWithSidebar exact path={Routes.ViewTasks.path} component={viewTasks} />
    <RouteWithSidebar exact path={Routes.Kanban.path} component={Kanban} />


    <RouteWithSidebar exact path={Routes.CreateBucket.path} component={createBucket} />
    <RouteWithSidebar exact path={Routes.Testimonial.path} component={Testimonial} />
    <RouteWithSidebar exact path={Routes.Contact.path} component={Contact} />
    <RouteWithSidebar exact path={Routes.ViewContacts.path} component={viewContact} />
    <RouteWithSidebar exact path={Routes.Uploadblog.path} component={Uploadblog} />
    <RouteWithSidebar exact path={Routes.Services.path} component={Servises} />








    {/* components */}
    <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} />
    <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
    <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
    <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} />
    <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
    <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
    <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
    <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
    <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
    <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} />
    <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
    <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
    <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
    <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
    <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
    <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

    {/* documentation */}
    <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} />
    <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} />
    <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} />
    <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} />
    <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} />
    <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} />
    <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} />
    <RouteWithSidebar exact path={Routes.Contact.path} component={Contact} />


    {/* Correspondence */}
    <RouteWithSidebar exact path={Routes.CreateNode.path} component={CreateCorrespondence} />
    <RouteWithSidebar exact path={Routes.ViewNode.path} component={viewCorrespondence} />

    {/* Bucket */}
    <RouteWithSidebar exact path={Routes.CreateBucket.path} component={createBucket} />
    <RouteWithSidebar exact path={Routes.ViewBucket.path} component={viewBucket} />

    {/* Invoices */}
    <RouteWithSidebar exact path={Routes.CreateInvoice.path} component={CreateInvoice} />
    <RouteWithSidebar exact path={Routes.CreateCredit.path} component={CreateCredit} />
    <RouteWithSidebar Exact path={Routes.CreateDinvoice.path} component={CreateDinvoice} />
    <RouteWithSidebar exact path={Routes.CreateExpenses.path} component={CreateExpenses} />
    <RouteWithSidebar exact path={Routes.CreateRecurring.path} component={CreateRecurring} />
    <RouteWithSidebar exact path={Routes.viewBills.path} component={viewBills} />
    <RouteWithSidebar exact path={Routes.viewDebits.path} component={viewDebits} />
    <RouteWithSidebar exact path={Routes.createConsolidated.path} component={CreateConsolidated} />


    {/* Format */}
    <RouteWithSidebar exact path={Routes.CreateTemplate.path} component={CreateTemplate} />
    <RouteWithSidebar exact path={Routes.CreateFormat.path} component={CreateFormat} />
    <RouteWithSidebar exact path={Routes.Questions.path} component={Questions} />
    <RouteWithSidebar exact path={Routes.ViewTemplate.path} component={ViewTemplate} />
    <RouteWithSidebar exact path={Routes.EditFeasibility.path} component={EditFeasibility} />
    <RouteWithSidebar exact path={Routes.EditFormat.path} component={EditFormat} />
    <RouteWithSidebar exact path={Routes.AddWatermark.path} component={Watermark} />
    <RouteWithLoader exact path={Routes.AddWatermarks.path} component={Watermark} />

    {/* Routes  */}
    <RouteWithSidebar exact path={Routes.viewRoutes.path} component={viewRoutes} />

    {/* User */}
    <RouteWithSidebar exact path={Routes.createUser.path} component={createUser} />


   


    <Redirect to={Routes.Signin.path} />
    {/* <Redirect to={Routes.DashboardOverview.path} /> */}
  </Switch>
);

export default hot(Homepage);