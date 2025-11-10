// src/app/routes/AppRouter.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";

import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import LoadingScreen from "../pages/LoadingScreen";

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Map = lazy(() => import("../pages/Map"));
const Library = lazy(() => import("../pages/Library"));
const YourLibrary = lazy(() => import("../pages/YourLibrary"));
// const Notifications = lazy(() => import("../pages/Notifications")); // not used now
const Story = lazy(() => import("../pages/Story"));
const DailyChallenge = lazy(() => import("../pages/DailyChallenge"));

const Profile = lazy(() => import("../pages/profile/Profile"));
const EditProfile = lazy(() => import("../pages/profile/EditProfile"));
const DeleteAccount = lazy(() => import("../pages/profile/DeleteAccount"));
const ChangePassword = lazy(() =>
  import("../pages/profile/ChangePassword")
);
const ChangeEmail = lazy(() => import("../pages/profile/ChangeEmail"));
const PaymentMethods = lazy(() =>
  import("../pages/profile/PaymentMethods")
);
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
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Main app pages (with TopBar + BottomNav) */}
        <Route
          path={ROUTES.HOME}
          element={<WithLayout Component={Home} />}
        />
        <Route
          path={ROUTES.MAP}
          element={<WithLayout Component={Map} showTopBar={false} />}
        />
        <Route
          path={ROUTES.LIBRARY}
          element={<WithLayout Component={Library} />}
        />
        <Route
          path={ROUTES.YOUR_LIBRARY}
          element={<WithLayout Component={YourLibrary} />}
        />
        <Route
          path={`${ROUTES.STORY}/:id`}
          element={<WithLayout Component={Story} />}
        />
        <Route
          path={ROUTES.PROFILE}
          element={<WithLayout Component={Profile} showTopBar={false} />}
        />

        {/* Daily challenge without top / bottom nav */}
        <Route
          path={ROUTES.DAILY_CHALLENGE}
          element={<DailyChallenge />}
        />

        {/* Profile menu routes */}
        <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
        <Route path={ROUTES.DELETE_ACCOUNT} element={<DeleteAccount />} />
        <Route
          path={ROUTES.CHANGE_PASSWORD}
          element={<ChangePassword />}
        />
        <Route path={ROUTES.CHANGE_EMAIL} element={<ChangeEmail />} />
        <Route
          path={ROUTES.PAYMENT_METHODS}
          element={<PaymentMethods />}
        />
        <Route path={ROUTES.ACTIVITY} element={<Activity />} />
        <Route path={ROUTES.REPORT_ISSUE} element={<ReportIssue />} />

        {/* Notifications route shows the 404 page on purpose */}
        <Route path={ROUTES.NOTIFICATIONS} element={<Error404 />} />

        {/* Fallback 404 for any other unknown route */}
        <Route path={ROUTES.ERROR_404} element={<Error404 />} />
      </Routes>
    </Suspense>
  );
}
