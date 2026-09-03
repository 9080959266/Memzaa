"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shopowner_controller_js_1 = require("../controllers/shopowner.controller.js");
const auth_js_1 = require("../middleware/auth.js");
const roles_js_1 = require("../middleware/roles.js");
const router = (0, express_1.Router)();
router.get('/dashboard', auth_js_1.authenticateJWT, (0, roles_js_1.authorizeRoles)('shop_owner'), shopowner_controller_js_1.getShopOwnerDashboard);
exports.default = router;
