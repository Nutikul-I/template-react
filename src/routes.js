import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./page/login";
import PolicyPrivacy from "./page/policy_privacy.js";

import Template from "./page/template.js";
// ADMIN
import AdminUsers from "./page/admin/users.js";
import AdminRoles from "./page/admin/roles.js";

import Notfound from "./page/notfound";

const AppRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<Loading />} /> */}

    <Route path="/" element={<Login />} />
    <Route path="/policy-privacy" element={<PolicyPrivacy />} />
    <Route path="/template" element={<Template />} />
    <Route path="/users" element={<AdminUsers />} />
    <Route path="/roles" element={<AdminRoles />} />
    <Route path="/*" element={<Notfound />} />
  </Routes>
);

export default AppRoutes;
