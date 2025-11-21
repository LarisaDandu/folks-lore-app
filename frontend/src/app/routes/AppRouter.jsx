// src/app/routes/AppRouter.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routes";

import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import LoadingScreen from "../pages/LoadingScreen";

const Onboarding = lazy(() => import("../pages/onboarding/Onboarding"));
const Home = lazy(() => import("../pages/Home"));
const Map = lazy(() => import("../pages/Map"));
const Library = lazy(() => import("../pages/Library"));
const YourLibrary = lazy(() => import("../pages/YourLibrary"));
const Story = lazy(() => import("../pages/Story"));
const DailyChallenge = lazy(() => import("../pages/DailyChallenge"));
const Profile = lazy(() => import("../pages/profile/Profile"));
const EditProfile = lazy(() => import("../pages/profile/EditProfile"));
const DeleteAccount = lazy(() => import("../pages/profile/DeleteAccount"));
const ChangePassword = lazy(() => import("../pages/profile/ChangePassword"));
const ChangeEmail = lazy(() => import("../pages/profile/ChangeEmail"));
const PaymentMethods = lazy(() => import("../pages/profile/PaymentMethods"));
const Activity = lazy(() => import("../pages/profile/Activity"));
const ReportIssue = lazy(() => import("../pages/profile/ReportIssue"));
const Error404 = lazy(() => import("../pages/Error404"));

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
  const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding") === "true";

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>

        {/* Show onboarding first time only */}
        {!hasSeenOnboarding && (
          <Route path="/" element={<Onboarding />} />
        )}

        {hasSeenOnboarding && (
          <Route path="/" element={<WithLayout Component={Home} />} />
        )}

        {/* Still allow manually navigating to onboarding */}
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path={ROUTES.MAP} element={<WithLayout Component={Map} showTopBar={false} />} />
        <Route path={ROUTES.LIBRARY} element={<WithLayout Component={Library} />} />
        <Route path={ROUTES.YOUR_LIBRARY} element={<WithLayout Component={YourLibrary} />} />
        <Route path={`${ROUTES.STORY}/:id`} element={<WithLayout Component={Story} />} />
        <Route path={ROUTES.PROFILE} element={<WithLayout Component={Profile} showTopBar={false} />} />

        <Route path={ROUTES.DAILY_CHALLENGE} element={<DailyChallenge />} />

        <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
        <Route path={ROUTES.DELETE_ACCOUNT} element={<DeleteAccount />} />
        <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
        <Route path={ROUTES.CHANGE_EMAIL} element={<ChangeEmail />} />
        <Route path={ROUTES.PAYMENT_METHODS} element={<PaymentMethods />} />
        <Route path={ROUTES.ACTIVITY} element={<Activity />} />
        <Route path={ROUTES.REPORT_ISSUE} element={<ReportIssue />} />

        <Route path={ROUTES.NOTIFICATIONS} element={<Error404 />} />
        <Route path="*" element={<Error404 />} />

      </Routes>
    </Suspense>
  );
}
