var timer;

$("#searchBox").keydown((event) => {
    clearTimeout(timer);
    var textbox = $(event.target);
    var value = textbox.val();

    timer = setTimeout(() => {
        value = textbox.val().trim();

        if (value == "") {
            $(".resultsContainer").html("");
        } else {
            searchFun(value);
        }
    }, 1000)
})

function searchFun(searchTerm) {
    $.get("/api/users", { search: searchTerm }, (results) => {
        console.log(results);
    })
}