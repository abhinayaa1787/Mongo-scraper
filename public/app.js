$(function () {
  $(".notes").modal("hide");

  $(".saveBtn").bind("click", function () {

          var thisId = $(this).parent("div").find("a").attr("data-id");

    var link = $(this).parent("div").find("a").attr("href");
    console.log(link);
    var title = $(this).parent("div").find("a").text();
    console.log(title);

    var description = $(this).parent("div").next("div").find(".card-text").text();
    console.log(description);
    var article = $(this).parent("div").parent("div");
    console.log(article);
    article.remove();


    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
      });
    $.ajax({
      method: "POST",
      url: "/saved",
      data: {
        // Value taken from title input
        title: title,
        link: link,
        description: description
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
      });
    });

  // $(".saveNote").on("click",function(){
  //     // Empty the notes from the note section
  //     // $("#notes").empty();
  //     // Save the id from the p tag
  //     $(".notes").show();

  //     var thisId = $(this).parent("div").find("a").attr("data-id");
  //   console.log(thisId);
  //     // Now make an ajax call for the Article
  //     $.ajax({
  //       method: "GET",
  //       url: "/saved/" + thisId
  //     })
  //       // With that done, add the note information to the page
  //       .then(function(data) {
  //         console.log(data);
  //         // The title of the article
  //         $(".modal-body").append("<h2>" + data.title + "</h2>");
  //         // An input to enter a new title
  //         $(".modal-body").append("<input class='titleinput' name='title' >");
  //         // A textarea to add a new note body
  //         $(".modal-body").append("<textarea class='bodyinput' name='body'></textarea>");
  //         // A button to submit a new note, with the id of the article saved to it
  //         $(".modal-footer").append("<button data-id='" + data._id + "' clas='savenote'>Save Note</button>");

  //         // If there's a note in the article
  //         if (data.note) {
  //           // Place the title of the note in the title input
  //           $(".titleinput").val(data.note.title);
  //           // Place the body of the note in the body textarea
  //           $(".bodyinput").val(data.note.body);
  //         }
  //       });
  //   });


  // $(".savenote").bind("click",function(){
  //   var thisId = $(this).attr("data-id");
  //     // Run a POST request to change the note, using what's entered in the inputs
  //     $.ajax({
  //       method: "POST",
  //       url: "/saved/" + thisId,
  //       data: {
  //         // Value taken from title input
  //         title: $(".titleinput").val(),
  //         // Value taken from note textarea
  //         body: $(".bodyinput").val()
  //       }
  //     })
  //       // With that done
  //       .then(function(data) {
  //         // Log the response
  //         console.log(data);
  //         // Empty the notes section
  //         // $("#notes").empty();
  //       });

  //     // Also, remove the values entered in the input and textarea for note entry
  //     $(".titleinput").val("");
  //     $(".bodyinput").val("");
  //   });

  $(".deleteArticleBtn").bind("click", function () {

    var thisId = $(this).parent("div").find("a").attr("data-id");
    var article = $(this).parent("div").parent("div");
    console.log(article);
    article.remove();

    console.log(thisId);
    $.ajax({
      method: "GET",
      url: "/saved/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
      });
      location.reload();

  });
});


