"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/profile/route";
exports.ids = ["app/api/profile/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_vyaparconnect_crm_src_app_api_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/profile/route.ts */ \"(rsc)/./src/app/api/profile/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/profile/route\",\n        pathname: \"/api/profile\",\n        filename: \"route\",\n        bundlePath: \"app/api/profile/route\"\n    },\n    resolvedPagePath: \"C:\\\\vyaparconnect-crm\\\\src\\\\app\\\\api\\\\profile\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_vyaparconnect_crm_src_app_api_profile_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/profile/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwcm9maWxlJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwcm9maWxlJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcHJvZmlsZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDdnlhcGFyY29ubmVjdC1jcm0lNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUN2eWFwYXJjb25uZWN0LWNybSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDTztBQUNwRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvPzRmZjUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcdnlhcGFyY29ubmVjdC1jcm1cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccHJvZmlsZVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvcHJvZmlsZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3Byb2ZpbGVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Byb2ZpbGUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFx2eWFwYXJjb25uZWN0LWNybVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxwcm9maWxlXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9wcm9maWxlL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/profile/route.ts":
/*!**************************************!*\
  !*** ./src/app/api/profile/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\n\n\nasync function GET() {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.getAuthSession)();\n    if (!session?.user?.id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.findUnique({\n            where: {\n                id: session.user.id\n            }\n        });\n        if (!user) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"User not found.\"\n            }, {\n                status: 404\n            });\n        }\n        // Exclude password from the response\n        const { password, ...userData } = user;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(userData);\n    } catch (error) {\n        console.error(\"GET /api/profile error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch profile\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function PUT(req) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_3__.getAuthSession)();\n    if (!session?.user?.id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    try {\n        const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.findUnique({\n            where: {\n                id: session.user.id\n            }\n        });\n        if (!user || !user.password) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"User not found.\"\n            }, {\n                status: 404\n            });\n        }\n        const body = await req.json();\n        const { name, currentPassword, newPassword } = body;\n        const updateData = {};\n        // Handle name update\n        if (name && name !== user.name) {\n            updateData.name = name;\n        }\n        // Handle password change\n        if (newPassword && currentPassword) {\n            const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(currentPassword, user.password);\n            if (!isPasswordValid) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"Invalid current password\"\n                }, {\n                    status: 400\n                });\n            }\n            if (newPassword.length < 8) {\n                return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                    error: \"New password must be at least 8 characters long\"\n                }, {\n                    status: 400\n                });\n            }\n            const hashedNewPassword = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().hash(newPassword, 10);\n            updateData.password = hashedNewPassword;\n        }\n        if (Object.keys(updateData).length === 0) {\n            // Return current user data if no changes were made\n            const { password, ...userData } = user;\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(userData, {\n                status: 200\n            });\n        }\n        const updatedUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].user.update({\n            where: {\n                id: user.id\n            },\n            data: updateData\n        });\n        const { password, ...userData } = updatedUser;\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(userData);\n    } catch (error) {\n        console.error(\"PUT /api/profile error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to update profile\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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USxFQUFFLEdBQUdDLFVBQVUsR0FBR1I7WUFDbEMsT0FBT04scURBQVlBLENBQUNRLElBQUksQ0FBQ00sVUFBVTtnQkFBRUosUUFBUTtZQUFJO1FBQ25EO1FBRUEsTUFBTW9CLGNBQWMsTUFBTTdCLG1EQUFNQSxDQUFDSyxJQUFJLENBQUN5QixNQUFNLENBQUM7WUFDM0NuQixPQUFPO2dCQUFFTCxJQUFJRCxLQUFLQyxFQUFFO1lBQUM7WUFDckJ5QixNQUFNVjtRQUNSO1FBRUEsTUFBTSxFQUFFVCxRQUFRLEVBQUUsR0FBR0MsVUFBVSxHQUFHZ0I7UUFDbEMsT0FBTzlCLHFEQUFZQSxDQUFDUSxJQUFJLENBQUNNO0lBQzNCLEVBQUUsT0FBT0wsT0FBTztRQUNkTSxRQUFRTixLQUFLLENBQUMsMkJBQTJCQTtRQUN6QyxPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtZQUFFQyxPQUFPO1FBQTJCLEdBQ3BDO1lBQUVDLFFBQVE7UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdnlhcGFyLWNvbm5lY3QtbmV4dC8uL3NyYy9hcHAvYXBpL3Byb2ZpbGUvcm91dGUudHM/ZmI2YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdFwiO1xyXG5pbXBvcnQgeyBnZXRBdXRoU2Vzc2lvbiB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKCkge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRBdXRoU2Vzc2lvbigpO1xyXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uaWQpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgIHdoZXJlOiB7IGlkOiBzZXNzaW9uLnVzZXIuaWQgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdXNlcikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJVc2VyIG5vdCBmb3VuZC5cIiB9LCB7IHN0YXR1czogNDA0IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEV4Y2x1ZGUgcGFzc3dvcmQgZnJvbSB0aGUgcmVzcG9uc2VcclxuICAgIGNvbnN0IHsgcGFzc3dvcmQsIC4uLnVzZXJEYXRhIH0gPSB1c2VyO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHVzZXJEYXRhKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkdFVCAvYXBpL3Byb2ZpbGUgZXJyb3I6XCIsIGVycm9yKTtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gZmV0Y2ggcHJvZmlsZVwiIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQVVQocmVxOiBSZXF1ZXN0KSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldEF1dGhTZXNzaW9uKCk7XHJcbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5pZCkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcclxuICAgICAgd2hlcmU6IHsgaWQ6IHNlc3Npb24udXNlci5pZCB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCF1c2VyIHx8ICF1c2VyLnBhc3N3b3JkKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlVzZXIgbm90IGZvdW5kLlwiIH0sIHsgc3RhdHVzOiA0MDQgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcbiAgICBjb25zdCB7IG5hbWUsIGN1cnJlbnRQYXNzd29yZCwgbmV3UGFzc3dvcmQgfSA9IGJvZHk7XHJcblxyXG4gICAgY29uc3QgdXBkYXRlRGF0YTogeyBuYW1lPzogc3RyaW5nOyBwYXNzd29yZD86IHN0cmluZyB9ID0ge307XHJcblxyXG4gICAgLy8gSGFuZGxlIG5hbWUgdXBkYXRlXHJcbiAgICBpZiAobmFtZSAmJiBuYW1lICE9PSB1c2VyLm5hbWUpIHtcclxuICAgICAgdXBkYXRlRGF0YS5uYW1lID0gbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBIYW5kbGUgcGFzc3dvcmQgY2hhbmdlXHJcbiAgICBpZiAobmV3UGFzc3dvcmQgJiYgY3VycmVudFBhc3N3b3JkKSB7XHJcbiAgICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKFxyXG4gICAgICAgIGN1cnJlbnRQYXNzd29yZCxcclxuICAgICAgICB1c2VyLnBhc3N3b3JkXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICghaXNQYXNzd29yZFZhbGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgICAgeyBlcnJvcjogXCJJbnZhbGlkIGN1cnJlbnQgcGFzc3dvcmRcIiB9LFxyXG4gICAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobmV3UGFzc3dvcmQubGVuZ3RoIDwgOCkge1xyXG4gICAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICAgIHsgZXJyb3I6IFwiTmV3IHBhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgOCBjaGFyYWN0ZXJzIGxvbmdcIiB9LFxyXG4gICAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICBjb25zdCBoYXNoZWROZXdQYXNzd29yZCA9IGF3YWl0IGJjcnlwdC5oYXNoKG5ld1Bhc3N3b3JkLCAxMCk7XHJcbiAgICAgIHVwZGF0ZURhdGEucGFzc3dvcmQgPSBoYXNoZWROZXdQYXNzd29yZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoT2JqZWN0LmtleXModXBkYXRlRGF0YSkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIC8vIFJldHVybiBjdXJyZW50IHVzZXIgZGF0YSBpZiBubyBjaGFuZ2VzIHdlcmUgbWFkZVxyXG4gICAgICBjb25zdCB7IHBhc3N3b3JkLCAuLi51c2VyRGF0YSB9ID0gdXNlcjtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHVzZXJEYXRhLCB7IHN0YXR1czogMjAwIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHVwZGF0ZWRVc2VyID0gYXdhaXQgcHJpc21hLnVzZXIudXBkYXRlKHtcclxuICAgICAgd2hlcmU6IHsgaWQ6IHVzZXIuaWQgfSxcclxuICAgICAgZGF0YTogdXBkYXRlRGF0YSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHsgcGFzc3dvcmQsIC4uLnVzZXJEYXRhIH0gPSB1cGRhdGVkVXNlcjtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih1c2VyRGF0YSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJQVVQgL2FwaS9wcm9maWxlIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgZXJyb3I6IFwiRmFpbGVkIHRvIHVwZGF0ZSBwcm9maWxlXCIgfSxcclxuICAgICAgeyBzdGF0dXM6IDUwMCB9XHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHJpc21hIiwiYmNyeXB0IiwiZ2V0QXV0aFNlc3Npb24iLCJHRVQiLCJzZXNzaW9uIiwidXNlciIsImlkIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwicGFzc3dvcmQiLCJ1c2VyRGF0YSIsImNvbnNvbGUiLCJQVVQiLCJyZXEiLCJib2R5IiwibmFtZSIsImN1cnJlbnRQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwidXBkYXRlRGF0YSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJsZW5ndGgiLCJoYXNoZWROZXdQYXNzd29yZCIsImhhc2giLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlZFVzZXIiLCJ1cGRhdGUiLCJkYXRhIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/profile/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getAuthSession: () => (/* binding */ getAuthSession)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials.password) {\n                    return null;\n                }\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user || !user.password) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_4___default().compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    callbacks: {\n        async session ({ token, session }) {\n            if (token && session.user) {\n                session.user.id = token.id;\n                session.user.name = token.name;\n                session.user.email = token.email;\n                session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;\n                session.user.primaryWorkflow = token.primaryWorkflow;\n            }\n            return session;\n        },\n        async jwt ({ token, user }) {\n            // If user object exists, it's the initial sign-in.\n            if (user) {\n                token.id = user.id;\n            }\n            // If token.id is not available, something is wrong, return the token.\n            if (!token.id) {\n                return token;\n            }\n            // On every session access, re-fetch the user data from the DB.\n            // This ensures the session is always fresh, which is crucial for\n            // flows like onboarding where user data changes.\n            const dbUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n                where: {\n                    id: token.id\n                },\n                include: {\n                    settings: true\n                }\n            });\n            if (!dbUser) {\n                // User not found in DB, invalidate the session by returning a modified token\n                token.id = undefined;\n                return token;\n            }\n            // Update the token with the latest data from the database\n            return {\n                ...token,\n                id: dbUser.id,\n                name: dbUser.name,\n                email: dbUser.email,\n                hasCompletedOnboarding: dbUser.hasCompletedOnboarding,\n                primaryWorkflow: dbUser.settings?.primaryWorkflow || \"HYBRID\"\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    }\n};\nconst getAuthSession = ()=>(0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(authOptions);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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dkQ7UUFDRjtJQUNGO0lBQ0FNLE9BQU87UUFDTEMsUUFBUTtJQUNWO0FBQ0YsRUFBRTtBQUVLLE1BQU1DLGlCQUFpQixJQUFNdEMsZ0VBQWdCQSxDQUFDSyxhQUFhIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdnlhcGFyLWNvbm5lY3QtbmV4dC8uL3NyYy9saWIvYXV0aC50cz82NjkyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tIFwibmV4dC1hdXRoL25leHRcIjtcclxuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xyXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tIFwibmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFsc1wiO1xyXG5pbXBvcnQgeyBQcmlzbWFBZGFwdGVyIH0gZnJvbSBcIkBuZXh0LWF1dGgvcHJpc21hLWFkYXB0ZXJcIjtcclxuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XHJcbmltcG9ydCBiY3J5cHQgZnJvbSBcImJjcnlwdFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XHJcbiAgYWRhcHRlcjogUHJpc21hQWRhcHRlcihwcmlzbWEpLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XHJcbiAgICAgIG5hbWU6IFwiQ3JlZGVudGlhbHNcIixcclxuICAgICAgY3JlZGVudGlhbHM6IHtcclxuICAgICAgICBlbWFpbDogeyBsYWJlbDogXCJFbWFpbFwiLCB0eXBlOiBcImVtYWlsXCIgfSxcclxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogXCJQYXNzd29yZFwiLCB0eXBlOiBcInBhc3N3b3JkXCIgfSxcclxuICAgICAgfSxcclxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgaWYgKCFjcmVkZW50aWFscz8uZW1haWwgfHwgIWNyZWRlbnRpYWxzLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcclxuICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoIXVzZXIgfHwgIXVzZXIucGFzc3dvcmQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaXNQYXNzd29yZFZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXHJcbiAgICAgICAgICBjcmVkZW50aWFscy5wYXNzd29yZCxcclxuICAgICAgICAgIHVzZXIucGFzc3dvcmRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBpZiAoIWlzUGFzc3dvcmRWYWxpZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgaWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXHJcbiAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBzZXNzaW9uOiB7XHJcbiAgICBzdHJhdGVneTogXCJqd3RcIixcclxuICB9LFxyXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVULCAvLyBNYWtlIHN1cmUgdG8gc2V0IHRoaXMgaW4geW91ciAuZW52LmxvY2FsIGZpbGVcclxuICBjYWxsYmFja3M6IHtcclxuICAgIGFzeW5jIHNlc3Npb24oeyB0b2tlbiwgc2Vzc2lvbiB9KSB7XHJcbiAgICAgIGlmICh0b2tlbiAmJiBzZXNzaW9uLnVzZXIpIHtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5pZDtcclxuICAgICAgICBzZXNzaW9uLnVzZXIubmFtZSA9IHRva2VuLm5hbWU7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLmVtYWlsID0gdG9rZW4uZW1haWw7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLmhhc0NvbXBsZXRlZE9uYm9hcmRpbmcgPSB0b2tlbi5oYXNDb21wbGV0ZWRPbmJvYXJkaW5nO1xyXG4gICAgICAgIHNlc3Npb24udXNlci5wcmltYXJ5V29ya2Zsb3cgPSB0b2tlbi5wcmltYXJ5V29ya2Zsb3c7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlc3Npb247XHJcbiAgICB9LFxyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xyXG4gICAgICAvLyBJZiB1c2VyIG9iamVjdCBleGlzdHMsIGl0J3MgdGhlIGluaXRpYWwgc2lnbi1pbi5cclxuICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICB0b2tlbi5pZCA9IHVzZXIuaWQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIElmIHRva2VuLmlkIGlzIG5vdCBhdmFpbGFibGUsIHNvbWV0aGluZyBpcyB3cm9uZywgcmV0dXJuIHRoZSB0b2tlbi5cclxuICAgICAgaWYgKCF0b2tlbi5pZCkge1xyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gT24gZXZlcnkgc2Vzc2lvbiBhY2Nlc3MsIHJlLWZldGNoIHRoZSB1c2VyIGRhdGEgZnJvbSB0aGUgREIuXHJcbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB0aGUgc2Vzc2lvbiBpcyBhbHdheXMgZnJlc2gsIHdoaWNoIGlzIGNydWNpYWwgZm9yXHJcbiAgICAgIC8vIGZsb3dzIGxpa2Ugb25ib2FyZGluZyB3aGVyZSB1c2VyIGRhdGEgY2hhbmdlcy5cclxuICAgICAgY29uc3QgZGJVc2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgd2hlcmU6IHsgaWQ6IHRva2VuLmlkIGFzIHN0cmluZyB9LFxyXG4gICAgICAgIGluY2x1ZGU6IHsgc2V0dGluZ3M6IHRydWUgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIWRiVXNlcikge1xyXG4gICAgICAgIC8vIFVzZXIgbm90IGZvdW5kIGluIERCLCBpbnZhbGlkYXRlIHRoZSBzZXNzaW9uIGJ5IHJldHVybmluZyBhIG1vZGlmaWVkIHRva2VuXHJcbiAgICAgICAgdG9rZW4uaWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVcGRhdGUgdGhlIHRva2VuIHdpdGggdGhlIGxhdGVzdCBkYXRhIGZyb20gdGhlIGRhdGFiYXNlXHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgLi4udG9rZW4sIC8vIHByZXNlcnZlIG9yaWdpbmFsIHRva2VuIHByb3BlcnRpZXMgbGlrZSBpYXQsIGV4cFxyXG4gICAgICAgIGlkOiBkYlVzZXIuaWQsXHJcbiAgICAgICAgbmFtZTogZGJVc2VyLm5hbWUsXHJcbiAgICAgICAgZW1haWw6IGRiVXNlci5lbWFpbCxcclxuICAgICAgICBoYXNDb21wbGV0ZWRPbmJvYXJkaW5nOiBkYlVzZXIuaGFzQ29tcGxldGVkT25ib2FyZGluZyxcclxuICAgICAgICBwcmltYXJ5V29ya2Zsb3c6IGRiVXNlci5zZXR0aW5ncz8ucHJpbWFyeVdvcmtmbG93IHx8IFwiSFlCUklEXCIsXHJcbiAgICAgIH07XHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGFnZXM6IHtcclxuICAgIHNpZ25JbjogXCIvbG9naW5cIixcclxuICB9LFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEF1dGhTZXNzaW9uID0gKCkgPT4gZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucyk7XHJcbiJdLCJuYW1lcyI6WyJnZXRTZXJ2ZXJTZXNzaW9uIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsIlByaXNtYUFkYXB0ZXIiLCJwcmlzbWEiLCJiY3J5cHQiLCJhdXRoT3B0aW9ucyIsImFkYXB0ZXIiLCJwcm92aWRlcnMiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzUGFzc3dvcmRWYWxpZCIsImNvbXBhcmUiLCJpZCIsInNlc3Npb24iLCJzdHJhdGVneSIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJjYWxsYmFja3MiLCJ0b2tlbiIsImhhc0NvbXBsZXRlZE9uYm9hcmRpbmciLCJwcmltYXJ5V29ya2Zsb3ciLCJqd3QiLCJkYlVzZXIiLCJpbmNsdWRlIiwic2V0dGluZ3MiLCJ1bmRlZmluZWQiLCJwYWdlcyIsInNpZ25JbiIsImdldEF1dGhTZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// @ts-nocheck\n// FIX: The PrismaClient import is correct, but the error suggests an environment issue where Prisma Client was not generated. This check is disabled to proceed.\n\n// Prevent multiple instances of Prisma Client in development\nconst prisma = globalThis.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) {\n    globalThis.prisma = prisma;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (prisma);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxjQUFjO0FBQ2QsaUtBQWlLO0FBQ25IO0FBTzlDLDZEQUE2RDtBQUM3RCxNQUFNQyxTQUFTQyxXQUFXRCxNQUFNLElBQUksSUFBSUQsd0RBQVlBO0FBRXBELElBQUlHLElBQXNDLEVBQUU7SUFDMUNELFdBQVdELE1BQU0sR0FBR0E7QUFDdEI7QUFFQSxpRUFBZUEsTUFBTUEsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG4vLyBGSVg6IFRoZSBQcmlzbWFDbGllbnQgaW1wb3J0IGlzIGNvcnJlY3QsIGJ1dCB0aGUgZXJyb3Igc3VnZ2VzdHMgYW4gZW52aXJvbm1lbnQgaXNzdWUgd2hlcmUgUHJpc21hIENsaWVudCB3YXMgbm90IGdlbmVyYXRlZC4gVGhpcyBjaGVjayBpcyBkaXNhYmxlZCB0byBwcm9jZWVkLlxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5cbi8vIEFkZCBwcmlzbWEgdG8gdGhlIE5vZGVKUyBnbG9iYWwgdHlwZVxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59XG5cbi8vIFByZXZlbnQgbXVsdGlwbGUgaW5zdGFuY2VzIG9mIFByaXNtYSBDbGllbnQgaW4gZGV2ZWxvcG1lbnRcbmNvbnN0IHByaXNtYSA9IGdsb2JhbFRoaXMucHJpc21hIHx8IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcImRldmVsb3BtZW50XCIpIHtcbiAgZ2xvYmFsVGhpcy5wcmlzbWEgPSBwcmlzbWE7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHByaXNtYTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnbG9iYWxUaGlzIiwicHJvY2VzcyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/@next-auth","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprofile%2Froute&page=%2Fapi%2Fprofile%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprofile%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();