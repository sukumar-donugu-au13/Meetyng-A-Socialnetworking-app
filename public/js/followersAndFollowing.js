$(document).ready(() => {
    if (selectedTab.followers == "followers") {
        loadFollowers();
    } else {
        loadFollowing();
    }
});

function loadFollowers() {
    $.get(`/api/users/${profileUserId}/followers`, results => {
        outputUsers(results.followers, $(".resultsContainer"));
    })
}

function loadFollowing() {
    $.get(`/api/users/${profileUserId}/following`, results => {
        outputUsers(results.following, $(".resultsContainer"));
    })
}

function outputUsers(results, container) {
    // console.log(results);
    container.html("");

    results.forEach(result => {
        // console.log(result.firstName);
        var html = createUserHtml(result, true);
        container.append(html);
    });

    if (!results.length) {
        container.append("<span class='noResults'>No results found</span>")
    }
}

function createUserHtml(userData, showFollowButton) {

    return `<div class="user">
                <div class="userImageContainer">
                    <img src="${userData.profilePic}"
                </div>
                <div class="userDetailsContainer">
                    <div class="header">
                        <a href="/profile/${userData.username}">@${userData.username}</a>
                    </div>
                </div>
            </div>`
}
