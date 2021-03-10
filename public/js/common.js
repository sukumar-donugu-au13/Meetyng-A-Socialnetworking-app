var cropper;

$("#postTextarea, #replyTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var isModal = textbox.parents(".modal").length == 1;

    var submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if (submitButton.length == 0) return console.log("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})

$("#submitPostButton, #submitReplyButton").click(event => {
    var button = $(event.target);

    var isModal = button.parents(".modal").length == 1;
    var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");

    var data = {
        content: textbox.val()
    }

    if (isModal) {
        var id = button.data().id;
        if (id == null) return console.log("Button id is null");
        data.replyTo = id;
    }

    $.post("/api/posts/", data, (postData, status, xhr) => {

        if (postData.replyTo) {
            location.reload();
        }

        var html = createPostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })
})

$(document).on("click", ".likeButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likes.length || "");

            if (postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click", ".shareButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/posts/${postId}/share`,
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.shareUsers.length || "");

            if (postData.shareUsers.includes(userLoggedIn._id)) {
                button.addClass("active");
            } else {
                button.removeClass("active");
            }
        }
    })
})

$(document).on("click", ".commentButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    $("#submitReplyButton").data("id", postId);

    $.get(`/api/posts/${postId}`, results => {
        // console.log(results);
        outputPosts(results.postData, $("#originalPostContainer"));
    })

    // console.log(postId);
    if (postId === undefined) return;

    $('#replyModal').modal('show')
})

$('#replyModal').on('shown.bs.modal', () => {
    $("#closeButton, .close").click(() => {
        $('#replyModal').modal('hide')
    })
})

$('#replyModal').on('hidden.bs.modal', () => {
    $("#originalPostContainer").html("");
})

$(document).on("click", ".post", (event) => {
    var element = $(event.target);
    var postId = getPostIdFromElement(element);

    if (postId !== undefined && !element.is("button")) {
        window.location.href = `/posts/${postId}`;
    }
})

$(document).on("click", "#deleteButton", (event) => {
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);

    $('#deletePostModal').modal('show');
})

$('#deletePostModal').on('shown.bs.modal', () => {
    $("#delCloseButton, .close").click(() => {
        $('#deletePostModal').modal('hide')
    })
})

$("#deletePostButton").click((event) => {
    var postId = $(event.target).data("id");

    $.ajax({
        url: `/api/posts/${postId}`,
        type: "DELETE",
        success: () => {
            location.reload();
        }
    })
})

$(document).on("click", ".followButton", (event) => {
    var button = $(event.target);
    var userId = button.parent().data().user;

    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: "PUT",
        success: (data, status, xhr) => {
            if (xhr.status == 404) {
                alert("User not found");
                return
            }

            var difference = 1;
            if (data.following && data.following.includes(userId)) {
                button.addClass("following");
                button.text("Following");
            } else {
                button.removeClass("following");
                button.text("Follow");
                difference = -1
            }

            var followersLable = $("#followersValue");
            if (followersLable.length != 0) {
                var followersText = followersLable.text();
                followersText = parseInt(followersText);
                followersLable.text(followersText + difference);
            }
        }
    })
});

$(".profilePictureButton").click(() => {
    $('#imageUploadModal').modal('show');
})

$('#imageUploadModal').on('shown.bs.modal', () => {
    $("#imgCloseButton, .close").click(() => {
        $('#imageUploadModal').modal('hide')
    })
})

$("#filePhoto").change(function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (event) => {
            var image = document.getElementById("imagePreview");
            image.src = event.target.result;

            if (cropper !== undefined) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false
            })
        }
        reader.readAsDataURL(this.files[0]);
    }
})

$("#imageUploadButton").click(() => {
    var canvas = cropper.getCroppedCanvas();

    if (canvas == null) {
        alert("Error!! Make sure it is an png, jpg or jpeg image file.");
        return
    }

    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/users/profilePicture",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})

$(".coverPhotoButton").click(() => {
    $('#coverPhotoUploadModal').modal('show');
})

$('#coverPhotoUploadModal').on('shown.bs.modal', () => {
    $("#photoCloseButton, .close").click(() => {
        $('#coverPhotoUploadModal').modal('hide')
    })
})

$("#coverPhoto").change(function () {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = (event) => {
            var image = document.getElementById("coverPreview");
            image.src = event.target.result;

            if (cropper !== undefined) {
                cropper.destroy();
            }

            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false
            })
        }
        reader.readAsDataURL(this.files[0]);
    }
})

$("#coverPhotoUploadButton").click(() => {
    var canvas = cropper.getCroppedCanvas();

    if (canvas == null) {
        alert("Error!! Make sure it is an png, jpg or jpeg image file.");
        return
    }

    canvas.toBlob((blob) => {
        var formData = new FormData();
        formData.append("croppedImage", blob);

        $.ajax({
            url: "/api/users/coverPhoto",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: () => location.reload()
        })
    })
})

function getPostIdFromElement(element) {
    var isRoot = element.hasClass("post");
    var rootElement = isRoot ? element : element.closest(".post");
    var postId = rootElement.data().id;

    if (postId === undefined) return console.log("Post id undefined");

    return postId;
}

function createPostHtml(postData) {
    var isShare = postData.shareData !== undefined;
    var shareBy = isShare ? postData.postedBy.username : null;
    postData = isShare ? postData.shareData : postData;

    var postedBy = postData.postedBy;

    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var shareButtonActiveClass = postData.shareUsers.includes(userLoggedIn._id) ? "active" : "";

    var shareText = "";
    if (isShare) {
        shareText = `<span>
                        <i class="fas fa-share"></i>
                        Shared By <a href="/profile/${shareBy}">@${shareBy}</a>
                    </span>`
    }

    var replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        if (!postData.replyTo._id) {
            return console.log("Reply to is not populated");
        } else if (!postData.replyTo.postedBy._id) {
            return console.log("Posted by is not populated");
        }

        var replyToUsername = postData.replyTo.postedBy.username;
        replyFlag = `<div class="replyFlag">
                        Replying to <a href="/profile/${replyToUsername}">@${replyToUsername}</a>
                    </div>`
    }

    var buttons = "";
    if (postData.postedBy._id == userLoggedIn._id) {
        buttons = `<button id="deleteButton" data-id="${postData._id} data-toggle="modal" data-target="#deletedPostModal">
                    <i class="fas fa-times"></i>
                </button>`
    }

    return `<div class="post" data-id="${postData._id}">
                <div class="postActionContainer">
                    ${shareText}
                </div>
                <div class="mainContentContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.username}" class="displayName">${displayName}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="date">${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button type="button" class="commentButton" data-toggle="modal" data-target="#replyModal">
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                            <div class="postButtonContainer green">
                                <button class="shareButton ${shareButtonActiveClass}">
                                    <i class="fas fa-share"></i>
                                    <span>${postData.shareUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class="postButtonContainer red">
                                <button class="likeButton ${likeButtonActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";

        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}

function outputPosts(results, container) {
    container.html("");

    if (!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result);
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show</span>");
    }
}

function outputPostsWithReplies(results, container) {
    container.html("");

    if (results.replyTo !== undefined && results.replyTo._id !== undefined) {
        var html = createPostHtml(results.replyTo);
        container.append(html);
    }

    var mainPostHtml = createPostHtml(results.postData);
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        var html = createPostHtml(result);
        container.append(html);
    });
}

