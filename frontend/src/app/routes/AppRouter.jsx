import React from "react";
import { Routes, Route } from "react-router-dom"; // no Router here
import { ROUTES } from "./routes";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

// Main pages
import Home from "../pages/Home";
import Map from "../pages/Map";
import Library from "../pages/Library";
import YourLibrary from "../pages/YourLibrary";
import Notifications from "../pages/Notifications";
import Story from "../pages/Story";
import DailyChallenge from "../pages/DailyChallenge";

// Profile and other pages
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import DeleteAccount from "../pages/profile/DeleteAccount";
import ChangePassword from "../pages/profile/ChangePassword";
import ChangeEmail from "../pages/profile/ChangeEmail";
import PaymentMethods from "../pages/profile/PaymentMethods";
import Activity from "../pages/profile/Activity";
import ReportIssue from "../pages/profile/ReportIssue";
import Error404 from "../pages/Error404";

function WithLayout({ Component, showTopBar = true, showBottomNav = true }) {
  return (
    <>
      {showTopBar && <TopBar />}
      <Component />
      {showBottomNav && <BottomNav />}
    </>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Main app pages (with TopBar + BottomNav) */}
      <Route path={ROUTES.HOME} element={<WithLayout Component={Home} />} />
      <Route path={ROUTES.MAP} element={<WithLayout Component={Map} showTopBar={false} />} />
      <Route path={ROUTES.LIBRARY} element={<WithLayout Component={Library} />} />
      <Route path={ROUTES.YOUR_LIBRARY} element={<WithLayout Component={YourLibrary} />} />
      <Route path={`${ROUTES.STORY}/:id`} element={<WithLayout Component={Story} />} />
      <Route
        path={ROUTES.NOTIFICATIONS} element={<WithLayout Component={Notifications} />} />
      <Route path={ROUTES.PROFILE} element={<WithLayout Component={Profile} showTopBar={false} />} />


      {/* Pages without TopBar or BottomNav */}
      <Route path={ROUTES.DAILY_CHALLENGE} element={<DailyChallenge />} />

      {/* Profile menu routes */}
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/delete" element={<DeleteAccount />} />
      <Route path="/profile/password" element={<ChangePassword />} />
      <Route path="/profile/email" element={<ChangeEmail />} />
      <Route path="/profile/payments" element={<PaymentMethods />} />
      <Route path="/profile/activity" element={<Activity />} />
      <Route path="/profile/report" element={<ReportIssue />} />

      {/* Fallback 404 */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
