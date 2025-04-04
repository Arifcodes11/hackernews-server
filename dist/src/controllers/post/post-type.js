export var PostStatus;
(function (PostStatus) {
    PostStatus["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    PostStatus["POST_CREATED"] = "POST_CREATED";
    PostStatus["POST_CREATION_FAILED"] = "POST_CREATION_FAILED";
})(PostStatus || (PostStatus = {}));
export var GetPostsError;
(function (GetPostsError) {
    GetPostsError["NO_POSTS_FOUND"] = "NO_POSTS_FOUND";
    GetPostsError["UNKNOWN"] = "UNKNOWN";
})(GetPostsError || (GetPostsError = {}));
export var DeletePostError;
(function (DeletePostError) {
    DeletePostError["UNAUTHORIZED"] = "UNAUTHORIZED";
    DeletePostError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    DeletePostError["DELETE_SUCCESS"] = "DELETE_SUCCESS";
    DeletePostError["DELETE_FAILED"] = "DELETE_FAILED";
})(DeletePostError || (DeletePostError = {}));
