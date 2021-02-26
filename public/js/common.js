$("#postTextarea").keyup(event => {
    var textbox = $(event.target);
    var value = textbox.val().trim();

    var submitButton = $("#submitPostButton");

    if (submitButton.length == 0) return console.log("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})