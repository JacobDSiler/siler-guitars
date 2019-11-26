//jshint esversion:8
const imageContainer = document.getElementById("image-container");
const imageSelection = [];
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

if ($("#postID").is(":empty")) {
  $("#post-dropdown").on("change", function() {
    if ($(this).val() != "") {
      postValue = $(this).val();
      //console.log(postValue);
    }
  });
} else {
  postValue = $("#postID").html();
  if (postValue != undefined) {
    console.log(postValue);
  }
}
//Specifically for the post view.
if ($("#PostId").is(":empty")) {
  console.log("No Post Id is Specified!");
} else {
  postId = $("#PostId").html();
  if (postId != undefined) {
    console.log(postId);
  }
}

//delete image logic for post view
$(".delete a").on("click", async e => {
  let clickedImg = [];
  clickedImg.push(e.target.name);
  // Unshift post selection to the imageSelection array
  clickedImg.unshift(postId);
  console.log(clickedImg);
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
  console.log(JSON.stringify(myJson));
  // return false;
});

if (addImageButton != null) {
  addImageButton.addEventListener("click", async () => {
    const url = "http://localhost:3000/post-images";
    if (postValue && postValue !== "undefined") {
      // Unshift post selection to the imageSelection array
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
      console.log(JSON.stringify(myJson));
    } else {
      alert(
        "Please select a post from the dropdown menu, and at least one image to add to it."
      );
    }
  });
}
