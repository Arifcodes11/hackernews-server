"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
// This is for getting the pagination parameters and
// make sure they are within the page limits
const getPagination = (context) => {
    const page = parseInt(context.req.query("page") || "1", 10);
    const limit = parseInt(context.req.query("limit") || "10", 10);
    const safePage = isNaN(page) || page < 1 ? 1 : page;
    const safeLimit = isNaN(limit) || limit < 1 ? 10 : limit;
    return {
        page: safePage,
        limit: safeLimit,
        skip: (safePage - 1) * safeLimit,
    };
};
exports.getPagination = getPagination;
