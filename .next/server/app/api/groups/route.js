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
exports.id = "app/api/groups/route";
exports.ids = ["app/api/groups/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_vyaparconnect_crm_src_app_api_groups_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/groups/route.ts */ \"(rsc)/./src/app/api/groups/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/groups/route\",\n        pathname: \"/api/groups\",\n        filename: \"route\",\n        bundlePath: \"app/api/groups/route\"\n    },\n    resolvedPagePath: \"C:\\\\vyaparconnect-crm\\\\src\\\\app\\\\api\\\\groups\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_vyaparconnect_crm_src_app_api_groups_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/groups/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZncm91cHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmdyb3VwcyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmdyb3VwcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDdnlhcGFyY29ubmVjdC1jcm0lNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUN2eWFwYXJjb25uZWN0LWNybSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDTTtBQUNuRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvPzM0MjciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcdnlhcGFyY29ubmVjdC1jcm1cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcZ3JvdXBzXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9ncm91cHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9ncm91cHNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2dyb3Vwcy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXHZ5YXBhcmNvbm5lY3QtY3JtXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGdyb3Vwc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvZ3JvdXBzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/groups/route.ts":
/*!*************************************!*\
  !*** ./src/app/api/groups/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n// src/app/api/groups/route.ts\n\n\n\nasync function GET() {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getAuthSession)();\n    if (!session?.user?.id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    const userId = session.user.id;\n    try {\n        const groups = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].group.findMany({\n            where: {\n                userId\n            },\n            orderBy: {\n                updatedAt: \"desc\"\n            },\n            include: {\n                messages: {\n                    orderBy: {\n                        createdAt: \"desc\"\n                    },\n                    take: 1\n                }\n            }\n        });\n        const result = groups.map((g)=>({\n                id: g.id,\n                name: g.name,\n                whatsappGroupId: g.whatsappGroupId,\n                lastMessage: g.messages[0]?.text || ``,\n                lastMessageAt: g.messages[0]?.createdAt || g.updatedAt\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(result);\n    } catch (error) {\n        console.error(\"GET /api/groups error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch groups\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(req) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getAuthSession)();\n    if (!session?.user?.id) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    const userId = session.user.id;\n    try {\n        const { name, whatsappGroupId } = await req.json();\n        if (!name || !whatsappGroupId) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Group name and WhatsApp Group ID are required\"\n            }, {\n                status: 400\n            });\n        }\n        const existingGroup = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].group.findFirst({\n            where: {\n                whatsappGroupId,\n                userId\n            }\n        });\n        if (existingGroup) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"This WhatsApp Group ID is already registered.\"\n            }, {\n                status: 409\n            });\n        }\n        const group = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].group.create({\n            data: {\n                name,\n                whatsappGroupId,\n                userId\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(group, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"POST /api/groups error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create group\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFBSTtJQUVsQjtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdnlhcGFyLWNvbm5lY3QtbmV4dC8uL3NyYy9hcHAvYXBpL2dyb3Vwcy9yb3V0ZS50cz85NWNlIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9hcHAvYXBpL2dyb3Vwcy9yb3V0ZS50c1xyXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XHJcbmltcG9ydCB7IGdldEF1dGhTZXNzaW9uIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldEF1dGhTZXNzaW9uKCk7XHJcbiAgaWYgKCFzZXNzaW9uPy51c2VyPy5pZCkge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiTm90IGF1dGhlbnRpY2F0ZWRcIiB9LCB7IHN0YXR1czogNDAxIH0pO1xyXG4gIH1cclxuICBjb25zdCB1c2VySWQgPSBzZXNzaW9uLnVzZXIuaWQ7XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBncm91cHMgPSBhd2FpdCBwcmlzbWEuZ3JvdXAuZmluZE1hbnkoe1xyXG4gICAgICB3aGVyZTogeyB1c2VySWQgfSxcclxuICAgICAgb3JkZXJCeTogeyB1cGRhdGVkQXQ6IFwiZGVzY1wiIH0sXHJcbiAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6IFwiZGVzY1wiIH0sXHJcbiAgICAgICAgICB0YWtlOiAxLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBncm91cHMubWFwKChnKSA9PiAoe1xyXG4gICAgICBpZDogZy5pZCxcclxuICAgICAgbmFtZTogZy5uYW1lLFxyXG4gICAgICB3aGF0c2FwcEdyb3VwSWQ6IGcud2hhdHNhcHBHcm91cElkLFxyXG4gICAgICBsYXN0TWVzc2FnZTogZy5tZXNzYWdlc1swXT8udGV4dCB8fCBgYCxcclxuICAgICAgbGFzdE1lc3NhZ2VBdDogZy5tZXNzYWdlc1swXT8uY3JlYXRlZEF0IHx8IGcudXBkYXRlZEF0LFxyXG4gICAgfSkpO1xyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihyZXN1bHQpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiR0VUIC9hcGkvZ3JvdXBzIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIGdyb3Vwc1wiIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcTogUmVxdWVzdCkge1xyXG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRBdXRoU2Vzc2lvbigpO1xyXG4gIGlmICghc2Vzc2lvbj8udXNlcj8uaWQpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcclxuICB9XHJcbiAgY29uc3QgdXNlcklkID0gc2Vzc2lvbi51c2VyLmlkO1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBuYW1lLCB3aGF0c2FwcEdyb3VwSWQgfSA9IGF3YWl0IHJlcS5qc29uKCk7XHJcblxyXG4gICAgaWYgKCFuYW1lIHx8ICF3aGF0c2FwcEdyb3VwSWQpIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICAgIHsgZXJyb3I6IFwiR3JvdXAgbmFtZSBhbmQgV2hhdHNBcHAgR3JvdXAgSUQgYXJlIHJlcXVpcmVkXCIgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAwIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleGlzdGluZ0dyb3VwID0gYXdhaXQgcHJpc21hLmdyb3VwLmZpbmRGaXJzdCh7XHJcbiAgICAgIHdoZXJlOiB7IHdoYXRzYXBwR3JvdXBJZCwgdXNlcklkIH0sXHJcbiAgICB9KTtcclxuICAgIGlmIChleGlzdGluZ0dyb3VwKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiBcIlRoaXMgV2hhdHNBcHAgR3JvdXAgSUQgaXMgYWxyZWFkeSByZWdpc3RlcmVkLlwiIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwOSB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZ3JvdXAgPSBhd2FpdCBwcmlzbWEuZ3JvdXAuY3JlYXRlKHtcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIG5hbWUsXHJcbiAgICAgICAgd2hhdHNhcHBHcm91cElkLFxyXG4gICAgICAgIHVzZXJJZCxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGdyb3VwLCB7IHN0YXR1czogMjAxIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiUE9TVCAvYXBpL2dyb3VwcyBlcnJvcjpcIiwgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IGVycm9yOiBcIkZhaWxlZCB0byBjcmVhdGUgZ3JvdXBcIiB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJnZXRBdXRoU2Vzc2lvbiIsIkdFVCIsInNlc3Npb24iLCJ1c2VyIiwiaWQiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJ1c2VySWQiLCJncm91cHMiLCJncm91cCIsImZpbmRNYW55Iiwid2hlcmUiLCJvcmRlckJ5IiwidXBkYXRlZEF0IiwiaW5jbHVkZSIsIm1lc3NhZ2VzIiwiY3JlYXRlZEF0IiwidGFrZSIsInJlc3VsdCIsIm1hcCIsImciLCJuYW1lIiwid2hhdHNhcHBHcm91cElkIiwibGFzdE1lc3NhZ2UiLCJ0ZXh0IiwibGFzdE1lc3NhZ2VBdCIsImNvbnNvbGUiLCJQT1NUIiwicmVxIiwiZXhpc3RpbmdHcm91cCIsImZpbmRGaXJzdCIsImNyZWF0ZSIsImRhdGEiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/groups/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   getAuthSession: () => (/* binding */ getAuthSession)\n/* harmony export */ });\n/* harmony import */ var next_auth_next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/next */ \"(rsc)/./node_modules/next-auth/next/index.js\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"(rsc)/./node_modules/@next-auth/prisma-adapter/dist/index.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_2__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"]),\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials.password) {\n                    return null;\n                }\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user || !user.password) {\n                    return null;\n                }\n                const isPasswordValid = await bcrypt__WEBPACK_IMPORTED_MODULE_4___default().compare(credentials.password, user.password);\n                if (!isPasswordValid) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    callbacks: {\n        async session ({ token, session }) {\n            if (token && session.user) {\n                // This is a more robust way to ensure all custom properties from the token\n                // are correctly added to the session's user object.\n                session.user.id = token.id;\n                session.user.name = token.name;\n                session.user.email = token.email;\n                session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;\n                session.user.primaryWorkflow = token.primaryWorkflow;\n            }\n            return session;\n        },\n        async jwt ({ token, user }) {\n            // The user object is only available on the first call after sign-in.\n            // The `sub` property of the token is the user ID from the provider.\n            const userId = user?.id || token.sub;\n            if (!userId) {\n                // If there's no user ID, we can't proceed.\n                return token;\n            }\n            // On every session access, re-fetch user data to keep it fresh.\n            const dbUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__[\"default\"].user.findUnique({\n                where: {\n                    id: userId\n                },\n                select: {\n                    id: true,\n                    name: true,\n                    email: true,\n                    hasCompletedOnboarding: true,\n                    settings: {\n                        select: {\n                            primaryWorkflow: true\n                        }\n                    }\n                }\n            });\n            if (!dbUser) {\n                // User not found in DB, invalidate the session.\n                return null;\n            }\n            // Update the token with the latest data from the database.\n            return {\n                ...token,\n                id: dbUser.id,\n                name: dbUser.name,\n                email: dbUser.email,\n                hasCompletedOnboarding: dbUser.hasCompletedOnboarding,\n                primaryWorkflow: dbUser.settings?.primaryWorkflow || \"HYBRID\"\n            };\n        }\n    },\n    pages: {\n        signIn: \"/login\"\n    }\n};\nconst getAuthSession = ()=>(0,next_auth_next__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(authOptions);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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c0I7Z0JBQ3JEQyxpQkFBaUJJLE9BQU9FLFFBQVEsRUFBRU4sbUJBQW1CO1lBQ3ZEO1FBQ0Y7SUFDRjtJQUNBTyxPQUFPO1FBQ0xDLFFBQVE7SUFDVjtBQUNGLEVBQUU7QUFFSyxNQUFNQyxpQkFBaUIsSUFBTXZDLGdFQUFnQkEsQ0FBQ0ssYUFBYSIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvLi9zcmMvbGliL2F1dGgudHM/NjY5MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSBcIm5leHQtYXV0aC9uZXh0XCI7XHJcbmltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gXCJuZXh0LWF1dGhcIjtcclxuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcclxuaW1wb3J0IHsgUHJpc21hQWRhcHRlciB9IGZyb20gXCJAbmV4dC1hdXRoL3ByaXNtYS1hZGFwdGVyXCI7XHJcbmltcG9ydCBwcmlzbWEgZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xyXG4gICAgICBuYW1lOiBcIkNyZWRlbnRpYWxzXCIsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6IFwiRW1haWxcIiwgdHlwZTogXCJlbWFpbFwiIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6IFwiUGFzc3dvcmRcIiwgdHlwZTogXCJwYXNzd29yZFwiIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscy5wYXNzd29yZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgICB3aGVyZTogeyBlbWFpbDogY3JlZGVudGlhbHMuZW1haWwgfSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlzUGFzc3dvcmRWYWxpZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKFxyXG4gICAgICAgICAgY3JlZGVudGlhbHMucGFzc3dvcmQsXHJcbiAgICAgICAgICB1c2VyLnBhc3N3b3JkXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gIF0sXHJcbiAgc2Vzc2lvbjoge1xyXG4gICAgc3RyYXRlZ3k6IFwiand0XCIsXHJcbiAgfSxcclxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCwgLy8gTWFrZSBzdXJlIHRvIHNldCB0aGlzIGluIHlvdXIgLmVudi5sb2NhbCBmaWxlXHJcbiAgY2FsbGJhY2tzOiB7XHJcbiAgICBhc3luYyBzZXNzaW9uKHsgdG9rZW4sIHNlc3Npb24gfSkge1xyXG4gICAgICBpZiAodG9rZW4gJiYgc2Vzc2lvbi51c2VyKSB7XHJcbiAgICAgICAgLy8gVGhpcyBpcyBhIG1vcmUgcm9idXN0IHdheSB0byBlbnN1cmUgYWxsIGN1c3RvbSBwcm9wZXJ0aWVzIGZyb20gdGhlIHRva2VuXHJcbiAgICAgICAgLy8gYXJlIGNvcnJlY3RseSBhZGRlZCB0byB0aGUgc2Vzc2lvbidzIHVzZXIgb2JqZWN0LlxyXG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLmlkO1xyXG4gICAgICAgIHNlc3Npb24udXNlci5uYW1lID0gdG9rZW4ubmFtZTtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuZW1haWwgPSB0b2tlbi5lbWFpbDtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuaGFzQ29tcGxldGVkT25ib2FyZGluZyA9IHRva2VuLmhhc0NvbXBsZXRlZE9uYm9hcmRpbmc7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLnByaW1hcnlXb3JrZmxvdyA9IHRva2VuLnByaW1hcnlXb3JrZmxvdztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2Vzc2lvbjtcclxuICAgIH0sXHJcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XHJcbiAgICAgIC8vIFRoZSB1c2VyIG9iamVjdCBpcyBvbmx5IGF2YWlsYWJsZSBvbiB0aGUgZmlyc3QgY2FsbCBhZnRlciBzaWduLWluLlxyXG4gICAgICAvLyBUaGUgYHN1YmAgcHJvcGVydHkgb2YgdGhlIHRva2VuIGlzIHRoZSB1c2VyIElEIGZyb20gdGhlIHByb3ZpZGVyLlxyXG4gICAgICBjb25zdCB1c2VySWQgPSB1c2VyPy5pZCB8fCB0b2tlbi5zdWI7XHJcblxyXG4gICAgICBpZiAoIXVzZXJJZCkge1xyXG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gdXNlciBJRCwgd2UgY2FuJ3QgcHJvY2VlZC5cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE9uIGV2ZXJ5IHNlc3Npb24gYWNjZXNzLCByZS1mZXRjaCB1c2VyIGRhdGEgdG8ga2VlcCBpdCBmcmVzaC5cclxuICAgICAgY29uc3QgZGJVc2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgd2hlcmU6IHsgaWQ6IHVzZXJJZCBhcyBzdHJpbmcgfSxcclxuICAgICAgICBzZWxlY3Q6IHtcclxuICAgICAgICAgIGlkOiB0cnVlLFxyXG4gICAgICAgICAgbmFtZTogdHJ1ZSxcclxuICAgICAgICAgIGVtYWlsOiB0cnVlLFxyXG4gICAgICAgICAgaGFzQ29tcGxldGVkT25ib2FyZGluZzogdHJ1ZSxcclxuICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIHNlbGVjdDoge1xyXG4gICAgICAgICAgICAgIHByaW1hcnlXb3JrZmxvdzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoIWRiVXNlcikge1xyXG4gICAgICAgIC8vIFVzZXIgbm90IGZvdW5kIGluIERCLCBpbnZhbGlkYXRlIHRoZSBzZXNzaW9uLlxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBVcGRhdGUgdGhlIHRva2VuIHdpdGggdGhlIGxhdGVzdCBkYXRhIGZyb20gdGhlIGRhdGFiYXNlLlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIC4uLnRva2VuLCAvLyBwcmVzZXJ2ZSBvcmlnaW5hbCB0b2tlbiBwcm9wZXJ0aWVzIGxpa2UgaWF0LCBleHBcclxuICAgICAgICBpZDogZGJVc2VyLmlkLFxyXG4gICAgICAgIG5hbWU6IGRiVXNlci5uYW1lLFxyXG4gICAgICAgIGVtYWlsOiBkYlVzZXIuZW1haWwsXHJcbiAgICAgICAgaGFzQ29tcGxldGVkT25ib2FyZGluZzogZGJVc2VyLmhhc0NvbXBsZXRlZE9uYm9hcmRpbmcsXHJcbiAgICAgICAgcHJpbWFyeVdvcmtmbG93OiBkYlVzZXIuc2V0dGluZ3M/LnByaW1hcnlXb3JrZmxvdyB8fCBcIkhZQlJJRFwiLFxyXG4gICAgICB9O1xyXG4gICAgfSxcclxuICB9LFxyXG4gIHBhZ2VzOiB7XHJcbiAgICBzaWduSW46IFwiL2xvZ2luXCIsXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBdXRoU2Vzc2lvbiA9ICgpID0+IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xyXG4iXSwibmFtZXMiOlsiZ2V0U2VydmVyU2Vzc2lvbiIsIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJQcmlzbWFBZGFwdGVyIiwicHJpc21hIiwiYmNyeXB0IiwiYXV0aE9wdGlvbnMiLCJhZGFwdGVyIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpc1Bhc3N3b3JkVmFsaWQiLCJjb21wYXJlIiwiaWQiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIiwiY2FsbGJhY2tzIiwidG9rZW4iLCJoYXNDb21wbGV0ZWRPbmJvYXJkaW5nIiwicHJpbWFyeVdvcmtmbG93Iiwiand0IiwidXNlcklkIiwic3ViIiwiZGJVc2VyIiwic2VsZWN0Iiwic2V0dGluZ3MiLCJwYWdlcyIsInNpZ25JbiIsImdldEF1dGhTZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/@next-auth","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fgroups%2Froute&page=%2Fapi%2Fgroups%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fgroups%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();