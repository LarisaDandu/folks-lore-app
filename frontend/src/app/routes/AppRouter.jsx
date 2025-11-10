import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import LoadingScreen from "../pages/LoadingScreen"; // <-- your Folkslore loader

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const Map = lazy(() => import("../pages/Map"));
const Library = lazy(() => import("../pages/Library"));
const YourLibrary = lazy(() => import("../pages/YourLibrary"));
const Notifications = lazy(() => import("../pages/Notifications"));
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
  return (
    // Suspense shows LoadingScreen whenever any lazy page is being loaded
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Main app pages (with TopBar + BottomNav) */}
        <Route path={ROUTES.HOME} element={<WithLayout Component={Home} />} />
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
          path={ROUTES.NOTIFICATIONS}
          element={<WithLayout Component={Notifications} />}
        />
        <Route
          path={ROUTES.PROFILE}
          element={<WithLayout Component={Profile} showTopBar={false} />}
        />

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
    </Suspense>
  );
}
