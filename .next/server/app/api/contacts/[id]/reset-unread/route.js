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
exports.id = "app/api/contacts/[id]/reset-unread/route";
exports.ids = ["app/api/contacts/[id]/reset-unread/route"];
exports.modules = {

/***/ "@prisma/client/runtime/library.js":
/*!****************************************************!*\
  !*** external "@prisma/client/runtime/library.js" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library.js");

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

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&page=%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&page=%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_vyaparconnect_crm_src_app_api_contacts_id_reset_unread_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/contacts/[id]/reset-unread/route.ts */ \"(rsc)/./src/app/api/contacts/[id]/reset-unread/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/contacts/[id]/reset-unread/route\",\n        pathname: \"/api/contacts/[id]/reset-unread\",\n        filename: \"route\",\n        bundlePath: \"app/api/contacts/[id]/reset-unread/route\"\n    },\n    resolvedPagePath: \"C:\\\\vyaparconnect-crm\\\\src\\\\app\\\\api\\\\contacts\\\\[id]\\\\reset-unread\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_vyaparconnect_crm_src_app_api_contacts_id_reset_unread_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/contacts/[id]/reset-unread/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZjb250YWN0cyUyRiU1QmlkJTVEJTJGcmVzZXQtdW5yZWFkJTJGcm91dGUmcGFnZT0lMkZhcGklMkZjb250YWN0cyUyRiU1QmlkJTVEJTJGcmVzZXQtdW5yZWFkJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGY29udGFjdHMlMkYlNUJpZCU1RCUyRnJlc2V0LXVucmVhZCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDdnlhcGFyY29ubmVjdC1jcm0lNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUN2eWFwYXJjb25uZWN0LWNybSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDNEI7QUFDekc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92eWFwYXItY29ubmVjdC1uZXh0Lz81Y2Y4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXHZ5YXBhcmNvbm5lY3QtY3JtXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGNvbnRhY3RzXFxcXFtpZF1cXFxccmVzZXQtdW5yZWFkXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9jb250YWN0cy9baWRdL3Jlc2V0LXVucmVhZC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2NvbnRhY3RzL1tpZF0vcmVzZXQtdW5yZWFkXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9jb250YWN0cy9baWRdL3Jlc2V0LXVucmVhZC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXHZ5YXBhcmNvbm5lY3QtY3JtXFxcXHNyY1xcXFxhcHBcXFxcYXBpXFxcXGNvbnRhY3RzXFxcXFtpZF1cXFxccmVzZXQtdW5yZWFkXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9jb250YWN0cy9baWRdL3Jlc2V0LXVucmVhZC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&page=%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/contacts/[id]/reset-unread/route.ts":
/*!*********************************************************!*\
  !*** ./src/app/api/contacts/[id]/reset-unread/route.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! .prisma/client */ \"(rsc)/./node_modules/.prisma/client/index.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_1__);\n\n// FIX: Corrected the import path for PrismaClient from '@prisma/client' to '.prisma/client' to resolve module resolution issues.\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_1__.PrismaClient();\nasync function POST(req, context // 👈 must be a Promise\n) {\n    const { id } = await context.params; // 👈 await here\n    try {\n        if (!id) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Contact ID is required\"\n            }, {\n                status: 400\n            });\n        }\n        await prisma.contact.update({\n            where: {\n                id\n            },\n            data: {\n                unreadCount: 0\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true\n        });\n    } catch (error) {\n        console.error(`reset-unread error`, error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to reset unread count\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9jb250YWN0cy9baWRdL3Jlc2V0LXVucmVhZC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQTJDO0FBQzNDLGlJQUFpSTtBQUNuRjtBQUU5QyxNQUFNRSxTQUFTLElBQUlELHdEQUFZQTtBQUV4QixlQUFlRSxLQUNwQkMsR0FBWSxFQUNaQyxRQUE2Qyx1QkFBdUI7QUFBeEI7SUFFNUMsTUFBTSxFQUFFQyxFQUFFLEVBQUUsR0FBRyxNQUFNRCxRQUFRRSxNQUFNLEVBQUUsZ0JBQWdCO0lBQ3JELElBQUk7UUFDRixJQUFJLENBQUNELElBQUk7WUFDUCxPQUFPTixxREFBWUEsQ0FBQ1EsSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUF5QixHQUNsQztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTVIsT0FBT1MsT0FBTyxDQUFDQyxNQUFNLENBQUM7WUFDMUJDLE9BQU87Z0JBQUVQO1lBQUc7WUFDWlEsTUFBTTtnQkFBRUMsYUFBYTtZQUFFO1FBQ3pCO1FBRUEsT0FBT2YscURBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFUSxTQUFTO1FBQUs7SUFDM0MsRUFBRSxPQUFPUCxPQUFPO1FBQ2RRLFFBQVFSLEtBQUssQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEVBQUVBO1FBQ3BDLE9BQU9ULHFEQUFZQSxDQUFDUSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBK0IsR0FDeEM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92eWFwYXItY29ubmVjdC1uZXh0Ly4vc3JjL2FwcC9hcGkvY29udGFjdHMvW2lkXS9yZXNldC11bnJlYWQvcm91dGUudHM/YTNiNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbi8vIEZJWDogQ29ycmVjdGVkIHRoZSBpbXBvcnQgcGF0aCBmb3IgUHJpc21hQ2xpZW50IGZyb20gJ0BwcmlzbWEvY2xpZW50JyB0byAnLnByaXNtYS9jbGllbnQnIHRvIHJlc29sdmUgbW9kdWxlIHJlc29sdXRpb24gaXNzdWVzLlxuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIi5wcmlzbWEvY2xpZW50XCI7XG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QoXG4gIHJlcTogUmVxdWVzdCxcbiAgY29udGV4dDogeyBwYXJhbXM6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+IH0gLy8g8J+RiCBtdXN0IGJlIGEgUHJvbWlzZVxuKSB7XG4gIGNvbnN0IHsgaWQgfSA9IGF3YWl0IGNvbnRleHQucGFyYW1zOyAvLyDwn5GIIGF3YWl0IGhlcmVcbiAgdHJ5IHtcbiAgICBpZiAoIWlkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXG4gICAgICAgIHsgZXJyb3I6IFwiQ29udGFjdCBJRCBpcyByZXF1aXJlZFwiIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDAgfVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBhd2FpdCBwcmlzbWEuY29udGFjdC51cGRhdGUoe1xuICAgICAgd2hlcmU6IHsgaWQgfSxcbiAgICAgIGRhdGE6IHsgdW5yZWFkQ291bnQ6IDAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgcmVzZXQtdW5yZWFkIGVycm9yYCwgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcbiAgICAgIHsgZXJyb3I6IFwiRmFpbGVkIHRvIHJlc2V0IHVucmVhZCBjb3VudFwiIH0sXG4gICAgICB7IHN0YXR1czogNTAwIH1cbiAgICApO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiUHJpc21hQ2xpZW50IiwicHJpc21hIiwiUE9TVCIsInJlcSIsImNvbnRleHQiLCJpZCIsInBhcmFtcyIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImNvbnRhY3QiLCJ1cGRhdGUiLCJ3aGVyZSIsImRhdGEiLCJ1bnJlYWRDb3VudCIsInN1Y2Nlc3MiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/contacts/[id]/reset-unread/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/prisma"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&page=%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fcontacts%2F%5Bid%5D%2Freset-unread%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();