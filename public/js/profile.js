$(document).ready(() => {
    loadPosts();
});

function loadPosts() {
    $.get("/api/posts", { postedBy: profileUserId }, results => {
        outputPosts(results, $(".postsContainer"));
    })
}
