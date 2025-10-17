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
exports.id = "app/api/tags/route";
exports.ids = ["app/api/tags/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ftags%2Froute&page=%2Fapi%2Ftags%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftags%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ftags%2Froute&page=%2Fapi%2Ftags%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftags%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_vyaparconnect_crm_src_app_api_tags_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/tags/route.ts */ \"(rsc)/./src/app/api/tags/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/tags/route\",\n        pathname: \"/api/tags\",\n        filename: \"route\",\n        bundlePath: \"app/api/tags/route\"\n    },\n    resolvedPagePath: \"C:\\\\vyaparconnect-crm\\\\src\\\\app\\\\api\\\\tags\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_vyaparconnect_crm_src_app_api_tags_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/tags/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZ0YWdzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZ0YWdzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGdGFncyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDdnlhcGFyY29ubmVjdC1jcm0lNUNzcmMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUN2eWFwYXJjb25uZWN0LWNybSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDSTtBQUNqRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvPzlmNWYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcdnlhcGFyY29ubmVjdC1jcm1cXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxcdGFnc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvdGFncy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3RhZ3NcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3RhZ3Mvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFx2eWFwYXJjb25uZWN0LWNybVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFx0YWdzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS90YWdzL3JvdXRlXCI7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHNlcnZlckhvb2tzLFxuICAgICAgICBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ftags%2Froute&page=%2Fapi%2Ftags%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftags%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/tags/route.ts":
/*!***********************************!*\
  !*** ./src/app/api/tags/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n// src/app/api/tags/route.ts\n\n\n\nasync function GET() {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getAuthSession)();\n    if (!session?.user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    const userId = session.user.id;\n    try {\n        const tags = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].tag.findMany({\n            where: {\n                userId\n            },\n            orderBy: {\n                name: \"asc\"\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(tags);\n    } catch (error) {\n        console.error(\"GET /api/tags error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to fetch tags\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(req) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getAuthSession)();\n    if (!session?.user) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Not authenticated\"\n        }, {\n            status: 401\n        });\n    }\n    const userId = session.user.id;\n    try {\n        const { name, color } = await req.json();\n        if (!name || !color) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Name and color are required\"\n            }, {\n                status: 400\n            });\n        }\n        const newTag = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__[\"default\"].tag.create({\n            data: {\n                name,\n                color,\n                userId\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(newTag, {\n            status: 201\n        });\n    } catch (error) {\n        if (error.code === \"P2002\") {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"A tag with this name already exists for this user.\"\n            }, {\n                status: 409\n            });\n        }\n        console.error(\"POST /api/tags error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create tag\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS90YWdzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsNEJBQTRCO0FBQ2U7QUFDVDtBQUNVO0FBRXJDLGVBQWVHO0lBQ3BCLE1BQU1DLFVBQVUsTUFBTUYseURBQWNBO0lBQ3BDLElBQUksQ0FBQ0UsU0FBU0MsTUFBTTtRQUNsQixPQUFPTCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBb0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDekU7SUFDQSxNQUFNQyxTQUFTTCxRQUFRQyxJQUFJLENBQUNLLEVBQUU7SUFFOUIsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTVYsbURBQU1BLENBQUNXLEdBQUcsQ0FBQ0MsUUFBUSxDQUFDO1lBQ3JDQyxPQUFPO2dCQUFFTDtZQUFPO1lBQ2hCTSxTQUFTO2dCQUFFQyxNQUFNO1lBQU07UUFDekI7UUFDQSxPQUFPaEIscURBQVlBLENBQUNNLElBQUksQ0FBQ0s7SUFDM0IsRUFBRSxPQUFPSixPQUFPO1FBQ2RVLFFBQVFWLEtBQUssQ0FBQyx3QkFBd0JBO1FBQ3RDLE9BQU9QLHFEQUFZQSxDQUFDTSxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBdUIsR0FDaEM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0Y7QUFFTyxlQUFlVSxLQUFLQyxHQUFZO0lBQ3JDLE1BQU1mLFVBQVUsTUFBTUYseURBQWNBO0lBQ3BDLElBQUksQ0FBQ0UsU0FBU0MsTUFBTTtRQUNsQixPQUFPTCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBb0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDekU7SUFDQSxNQUFNQyxTQUFTTCxRQUFRQyxJQUFJLENBQUNLLEVBQUU7SUFFOUIsSUFBSTtRQUNGLE1BQU0sRUFBRU0sSUFBSSxFQUFFSSxLQUFLLEVBQUUsR0FBRyxNQUFNRCxJQUFJYixJQUFJO1FBRXRDLElBQUksQ0FBQ1UsUUFBUSxDQUFDSSxPQUFPO1lBQ25CLE9BQU9wQixxREFBWUEsQ0FBQ00sSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUE4QixHQUN2QztnQkFBRUMsUUFBUTtZQUFJO1FBRWxCO1FBRUEsTUFBTWEsU0FBUyxNQUFNcEIsbURBQU1BLENBQUNXLEdBQUcsQ0FBQ1UsTUFBTSxDQUFDO1lBQ3JDQyxNQUFNO2dCQUNKUDtnQkFDQUk7Z0JBQ0FYO1lBQ0Y7UUFDRjtRQUNBLE9BQU9ULHFEQUFZQSxDQUFDTSxJQUFJLENBQUNlLFFBQVE7WUFBRWIsUUFBUTtRQUFJO0lBQ2pELEVBQUUsT0FBT0QsT0FBWTtRQUNuQixJQUFJQSxNQUFNaUIsSUFBSSxLQUFLLFNBQVM7WUFDMUIsT0FBT3hCLHFEQUFZQSxDQUFDTSxJQUFJLENBQ3RCO2dCQUFFQyxPQUFPO1lBQXFELEdBQzlEO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFDQVMsUUFBUVYsS0FBSyxDQUFDLHlCQUF5QkE7UUFDdkMsT0FBT1AscURBQVlBLENBQUNNLElBQUksQ0FDdEI7WUFBRUMsT0FBTztRQUF1QixHQUNoQztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3Z5YXBhci1jb25uZWN0LW5leHQvLi9zcmMvYXBwL2FwaS90YWdzL3JvdXRlLnRzPzEwNjIiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2FwcC9hcGkvdGFncy9yb3V0ZS50c1xyXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcclxuaW1wb3J0IHByaXNtYSBmcm9tIFwiQC9saWIvcHJpc21hXCI7XHJcbmltcG9ydCB7IGdldEF1dGhTZXNzaW9uIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldEF1dGhTZXNzaW9uKCk7XHJcbiAgaWYgKCFzZXNzaW9uPy51c2VyKSB7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJOb3QgYXV0aGVudGljYXRlZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSk7XHJcbiAgfVxyXG4gIGNvbnN0IHVzZXJJZCA9IHNlc3Npb24udXNlci5pZDtcclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHRhZ3MgPSBhd2FpdCBwcmlzbWEudGFnLmZpbmRNYW55KHtcclxuICAgICAgd2hlcmU6IHsgdXNlcklkIH0sXHJcbiAgICAgIG9yZGVyQnk6IHsgbmFtZTogXCJhc2NcIiB9LFxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24odGFncyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJHRVQgL2FwaS90YWdzIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgZXJyb3I6IFwiRmFpbGVkIHRvIGZldGNoIHRhZ3NcIiB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcclxuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0QXV0aFNlc3Npb24oKTtcclxuICBpZiAoIXNlc3Npb24/LnVzZXIpIHtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk5vdCBhdXRoZW50aWNhdGVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcclxuICB9XHJcbiAgY29uc3QgdXNlcklkID0gc2Vzc2lvbi51c2VyLmlkO1xyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBuYW1lLCBjb2xvciB9ID0gYXdhaXQgcmVxLmpzb24oKTtcclxuXHJcbiAgICBpZiAoIW5hbWUgfHwgIWNvbG9yKSB7XHJcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgICB7IGVycm9yOiBcIk5hbWUgYW5kIGNvbG9yIGFyZSByZXF1aXJlZFwiIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwMCB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbmV3VGFnID0gYXdhaXQgcHJpc21hLnRhZy5jcmVhdGUoe1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgbmFtZSxcclxuICAgICAgICBjb2xvcixcclxuICAgICAgICB1c2VySWQsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihuZXdUYWcsIHsgc3RhdHVzOiAyMDEgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IFwiUDIwMDJcIikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogXCJBIHRhZyB3aXRoIHRoaXMgbmFtZSBhbHJlYWR5IGV4aXN0cyBmb3IgdGhpcyB1c2VyLlwiIH0sXHJcbiAgICAgICAgeyBzdGF0dXM6IDQwOSB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmVycm9yKFwiUE9TVCAvYXBpL3RhZ3MgZXJyb3I6XCIsIGVycm9yKTtcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihcclxuICAgICAgeyBlcnJvcjogXCJGYWlsZWQgdG8gY3JlYXRlIHRhZ1wiIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA1MDAgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsImdldEF1dGhTZXNzaW9uIiwiR0VUIiwic2Vzc2lvbiIsInVzZXIiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJ1c2VySWQiLCJpZCIsInRhZ3MiLCJ0YWciLCJmaW5kTWFueSIsIndoZXJlIiwib3JkZXJCeSIsIm5hbWUiLCJjb25zb2xlIiwiUE9TVCIsInJlcSIsImNvbG9yIiwibmV3VGFnIiwiY3JlYXRlIiwiZGF0YSIsImNvZGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/tags/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/@next-auth","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/@panva","vendor-chunks/oidc-token-hash"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Ftags%2Froute&page=%2Fapi%2Ftags%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftags%2Froute.ts&appDir=C%3A%5Cvyaparconnect-crm%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5Cvyaparconnect-crm&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();