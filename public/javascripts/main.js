//jshint esversion:8
const imageContainer = document.getElementById("image-container");
const imageSelection = [];
//Date selection form
let selectedImage = [];
const dateSubmitButton = $("#imageSubmit");
//Disable submit button.
$(document).ready(function() {
  dateSubmitButton.prop("disabled", true);
});

let postValue = "undefined";
let postId = "undefined";

if (imageContainer != null) {
  imageContainer.addEventListener("click", e => {
    if (!imageSelection.includes(e.target.src)) {
      imageSelection.push(e.target.src);
    }
  });
}

const addImageButton = document.getElementById("add-image-button");

//post selection logic

if ($("#postID").attr("value") == "") {
  $("#post-dropdown").on("change", function() {
    if ($(this).val() != "") {
      postValue = $(this).val();
      //console.log(postValue);
    }
  });
} else {
  postValue = $("#postID").attr("value");
  //console.log(postValue);
  if (postValue != undefined) {
    //console.log(postValue);
  }
}
//Specifically for the post view.
if ($("#PostId").is(":empty")) {
  ////console.log("No Post Id is Specified!");
} else {
  postId = $("#PostId").html();
  if (postId != undefined) {
    //console.log(postId);
  }
}

//Datepicker Image Select logic
$("#image-area a").on("click", function(e) {
  const link = e.target.src;
  //console.log(link);
  if (link != "") {
    selectedImage = [link];
    //console.log(selectedImage);
    $("#chosenImage")[0].value = selectedImage;
    //console.log($("#chosenImage")[0].value);
    dateSubmitButton.prop("disabled", false);
  }
  return false;
});

//delete featureDate logic for home view
$(".delete-date > h1").on("click", async e => {
  let deleteDateRef;
  //deleteDateRef = [$("DateId")[0].innerHTML];
  deleteDateRef = [$($(e)[0].currentTarget).data("dateid")];
  console.log(deleteDateRef);
  //Post to the route for removing posts
  const url = "http://localhost:3000/delete-date";

  //Fetch for post request to delete featuredate.

  let result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(deleteDateRef)
  });

  const myJson = await result.json();
  //console.log(JSON.stringify(myJson));
  //return false;
});
//delete post logic for post view
$("#delete-post").on("click", async e => {
  let deletePostID;
  deletePostID = [$("#PostId")[0].innerHTML];
  console.log(deletePostID);
  //Post to the route for removing posts
  const url = "http://localhost:3000/delete-post";

  let result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(deletePostID)
  });

  const myJson = await result.json();
  //console.log(JSON.stringify(myJson));
  return false;
});

//delete image logic for post view
$(".delete a").on("click", async e => {
  let clickedImg = [];
  clickedImg.push(e.target.name);
  // Unshift post selection to the imageSelection array
  clickedImg.unshift(postId);
  //console.log(clickedImg);
  //Post to the route for removing images
  const url = "http://localhost:3000/remove-image";

  let result = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(clickedImg)
  });

  const myJson = await result.json(location.reload());
  //console.log(JSON.stringify(myJson));
  return false;
});

if (addImageButton != null) {
  addImageButton.addEventListener("click", async () => {
    const url = "http://localhost:3000/post-images";
    if (postValue && postValue !== "undefined") {
      //Unshift post selection to the imageSelection array
      imageSelection.unshift(postValue);
      //Then post the images and the selected post to the node server to process.
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(imageSelection)
      });
      const myJson = await res.json(location.reload());
      //console.log(JSON.stringify(myJson));
    } else {
      alert(
        "Please select a post from the dropdown menu, and at least one image to add to it."
      );
    }
  });
}
