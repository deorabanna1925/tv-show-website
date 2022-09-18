var body = document.body;
var input = document.querySelector("#input-field");
var search = document.querySelector("#search");

var searchResult = document.querySelector("#search-result");

var title = document.querySelector("#title");
var description = document.querySelector("#description");

var showImage = document.querySelector("#show-image");

var showStatus = document.querySelector("#show-status");
var showGenres = document.querySelector("#show-genres");
var showRatings = document.querySelector("#show-ratings");

var btnImdb = document.querySelector("#btn-imdb");

var overview = document.querySelector("#overview");
var episodes = document.querySelector("#episodes");
var castList = document.querySelector("#cast-list");
var crewList = document.querySelector("#crew-list");

var cardHeaderTabs = document.querySelectorAll(".card-header-tabs");
var position = 0;

var url = " https://api.tvmaze.com/";

input.focus();

search.addEventListener("click", function () {
  if (input.value === "") {
    alert("Please enter a tv show");
  } else {
    //   set new window url
    var newUrl = "?query=" + input.value;
    window.history.pushState(null, null, newUrl);
    window.location.reload();
  }
});

function getSearchAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displaySearchResult(data);
  };
}

function getShowAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowResult(data);
  };
}

function getShowImagesAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowImages(data);
  };
}

function getShowSeasonsAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowSeasons(data);
  };
}

function getEpisodesOfSeason(url, episodeList) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowEpisodes(data, episodeList);
  };
}

function getShowCastAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowCast(data);
  };
}

function getShowCrewAPIResponse(url) {
  var xhr = getAPIData(url);
  xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    displayShowCrew(data);
  };
}

function convertDate(string) {
  monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var date = new Date(string);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var formattedDate = day + " " + monthNames[month - 1] + " " + year;
  return formattedDate;
}

function displayShowSeasons(data) {
  episodes.innerHTML = "";
  var seasonTitle = document.createElement("h4");
  seasonTitle.innerHTML = "Select Season";
  episodes.appendChild(seasonTitle);
  // create dropdown of seasons
  var dropdown = document.createElement("select");
  dropdown.classList.add("form-control");
  dropdown.setAttribute("id", "season-dropdown");
  episodes.appendChild(dropdown);
  for (var i = 0; i < data.length; i++) {
    var option = document.createElement("option");
    if (data[i].name != "") {
      if (data[i].premiereDate != null) {
        var date = convertDate(data[i].premiereDate);
        option.innerHTML = data[i].name + " (" + date + ")";
      } else {
        option.innerHTML = data[i].name;
      }
    } else if (data[i].premiereDate != null) {
      option.innerHTML =
        "Season " +
        data[i].number +
        " (" +
        convertDate(data[i].premiereDate) +
        ")";
    } else {
      option.innerHTML = "Season " + data[i].number;
    }
    option.setAttribute("value", data[i].id);
    option.setAttribute("id", data[i].id);
    dropdown.appendChild(option);
  }
  var episodeList = document.createElement("div");
  episodes.appendChild(episodeList);
  var url = "https://api.tvmaze.com/seasons/" + data[0].id + "/episodes";
  getEpisodesOfSeason(url, episodeList);

  // add event listener to dropdown
  dropdown.addEventListener("change", function () {
    var season = this.value;
    var url = "https://api.tvmaze.com/seasons/" + season + "/episodes";
    getEpisodesOfSeason(url, episodeList);
  });
}

function displayShowEpisodes(data, episodeList) {
  episodeList.innerHTML = "";
  var episodeTitle = document.createElement("h4");
  episodeTitle.innerHTML = "Episodes";
  episodeTitle.style.margin = "10px";
  episodeList.appendChild(episodeTitle);
  var episodeDiv = document.createElement("div");
  episodeDiv.classList.add("row");
  for (var i = 0; i < data.length; i++) {
    var episode = data[i];
    var episodeCol = document.createElement("div");
    episodeCol.classList.add("col-md-4");
    episodeCol.classList.add("d-flex");
    episodeCol.classList.add("align-items-stretch");
    var episodeCard = document.createElement("div");
    episodeCard.classList.add("card");
    episodeCard.style.marginTop = "10px";
    var episodeCardBody = document.createElement("div");
    episodeCardBody.classList.add("flex-column");
    episodeCardBody.classList.add("card-body");
    episodeCardBody.classList.add("d-flex");
    var episodeCardImage = document.createElement("img");
    episodeCardImage.classList.add("card-img-top");
    episodeCardImage.classList.add("img-fluid");
    episodeCardImage.style.height = "250px";
    episodeCardImage.style.objectFit = "cover";
    if (episode.image != null) {
      episodeCardImage.src = episode.image.original;
    } else {
      episodeCardImage.src = "https://via.placeholder.com/250x250";
    }
    var episodeCardName = document.createElement("h5");
    episodeCardName.classList.add("card-title");
    episodeCardName.innerHTML = episode.name;
    var episodeCardRating = document.createElement("p");
    episodeCardRating.classList.add("card-text");
    episodeCardRating.innerHTML =
      "<b>Rating: </b>" + episode.rating.average + "★";
    var episodeType = document.createElement("span");
    episodeType.classList.add("badge");
    if (episode.type == "regular") {
      episodeType.classList.add("bg-primary");
      episodeType.innerHTML = "Regular";
    } else if (episode.type == "insignificant_special") {
      episodeType.classList.add("bg-warning");
      episodeType.classList.add("text-dark");
      episodeType.innerHTML = "Special";
    }
    var episodeCardSummary = document.createElement("p");
    episodeCardSummary.classList.add("card-text");
    episodeCardSummary.classList.add("text-start");
    episodeCardSummary.innerHTML = episode.summary;
    var episodeCardAirDate = document.createElement("p");
    episodeCardAirDate.classList.add("card-text");
    episodeCardAirDate.innerHTML = "Air Date: " + convertDate(episode.airdate);
    episodeCard.appendChild(episodeCardImage);
    episodeCardBody.appendChild(episodeCardName);
    episodeCardBody.appendChild(episodeCardRating);
    episodeCardBody.appendChild(episodeType);
    episodeCardBody.appendChild(episodeCardSummary);
    episodeCardBody.appendChild(episodeCardAirDate);
    episodeCard.appendChild(episodeCardBody);
    episodeCol.appendChild(episodeCard);
    episodeDiv.appendChild(episodeCol);
  }
  episodeList.appendChild(episodeDiv);
  var url = createUrl(data);
  var ratingChart = document.createElement("img");
  ratingChart.classList.add("col-md-9");
  ratingChart.classList.add("img-fluid");
  ratingChart.src = url;
  ratingChart.style.marginTop = "10px";
  ratingChart.style.borderRadius = "16px";
  episodeList.appendChild(ratingChart);
}

function createUrl(data) {
  // get all Episode Names and Ratings
  var episodeNames = [];
  var episodeRatings = [];
  for (var i = 0; i < data.length; i++) {
    var episode = data[i];
    episodeNames.push(episode.name);
    episodeRatings.push(episode.rating.average);
  }
  var baseUrl = "https://image-charts.com/chart.js/2.8.0?bkg=black&c=";
  // create json object with data for chart.js
  var data = {
    labels: episodeNames,
    datasets: [
      {
        label: "Episode Ratings",
        borderColor: "rgb(52, 188, 62)",
        borderWidth: 1,
        fill: false,
        data: episodeRatings,
        backgroundColor: ["rgb(52, 188, 62)"],
      },
    ],
  };
  var mainData = {
    type: "line",
    data: data,
  };
  // create url with data for chart.js
  var url = baseUrl + JSON.stringify(mainData);
  return url;
}

function displayShowCast(data) {
  castList.innerHTML = "";
  var castTitle = document.createElement("h4");
  castTitle.innerHTML = "Cast";
  castList.appendChild(castTitle);
  var castDiv = document.createElement("div");
  castDiv.classList.add("row");
  castDiv.style.margin = "10px";
  for (var i = 0; i < data.length; i++) {
    var cast = document.createElement("div");
    cast.classList.add("col-md-2");
    cast.classList.add("m-3");
    cast.classList.add("p-0");
    cast.classList.add("card");
    // cast contain a horizontal card with 2 images and 1 h4 tag
    var personImage = document.createElement("img");
    var personName = document.createElement("h6");
    var characterImage = document.createElement("img");
    var characterName = document.createElement("h6");
    if (data[i].person.image.medium != null) {
      personImage.src = data[i].person.image.medium;
    } else {
      personImage.src = "https://via.placeholder.com/210x295";
    }
    if (data[i].character.image.medium != null) {
      characterImage.src = data[i].character.image.medium;
    } else {
      characterImage.src = "https://via.placeholder.com/210x295";
    }
    personImage.classList.add("img-fluid");
    personImage.classList.add("card-img-top");
    characterImage.classList.add("img-fluid");
    characterImage.classList.add("card-img-bottom");
    personName.innerHTML = data[i].person.name;
    personName.style.textAlign = "center";
    characterName.innerHTML = data[i].character.name;
    characterName.style.textAlign = "center";

    var crewCardBody = document.createElement("div");
    crewCardBody.classList.add("card-body");

    var middleText = document.createElement("p");
    middleText.innerHTML = "as";
    middleText.style.fontSize = "14px";
    middleText.style.fontStyle = "italic";

    crewCardBody.appendChild(personName);
    crewCardBody.appendChild(middleText);
    crewCardBody.appendChild(characterName);

    cast.appendChild(personImage);
    cast.appendChild(crewCardBody);
    cast.appendChild(characterImage);
    castDiv.appendChild(cast);
    castList.appendChild(castDiv);
  
  }
}

function displayShowCrew(data) {
  console.log(data);
  crewList.innerHTML = "";
  var crewTitle = document.createElement("h4");
  crewTitle.innerHTML = "Crew";
  crewList.appendChild(crewTitle);
  for (var i = 0; i < data.length; i++) {
    var crewCard = document.createElement("div");
    crewCard.classList.add("card");
    crewCard.classList.add("col-md-2");
    crewCard.classList.add("p-0");
    crewCard.classList.add("m-3");
    var crewCardBody = document.createElement("div");
    crewCardBody.classList.add("card-body");
    var crewCardName = document.createElement("h5");
    crewCardName.classList.add("card-title");
    crewCardName.innerHTML = data[i].person.name;
    var crewCardType = document.createElement("p");
    crewCardType.classList.add("card-text");
    crewCardType.classList.add("text-muted");
    crewCardType.style.fontSize = "14px";
    crewCardType.style.fontStyle = "italic";
    crewCardType.innerHTML = data[i].type;
    var crewCardImage = document.createElement("img");
    if (data[i].person.image.medium != null) {
      crewCardImage.src = data[i].person.image.medium;
    }
    crewCardImage.classList.add("img-fluid");
    crewCardImage.classList.add("w-100");
    crewCardImage.classList.add("card-img-top");
    crewCardBody.appendChild(crewCardName);
    crewCardBody.appendChild(crewCardType);
    crewCard.appendChild(crewCardImage);
    crewCard.appendChild(crewCardBody);
    crewList.appendChild(crewCard);
    crewList.style.justifyContent = "center";
  }
}

function displayShowImages(data) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].type == "background") {
      var image = document.createElement("img");
      image.classList.add("img-fluid");
      image.style.borderRadius = "32px";
      image.style.margin = "10px";
      image.src = data[i].resolutions.original.url;
      overview.appendChild(image);
    }
  }
}

function displaySearchResult(data) {
  searchResult.innerHTML = "";
  for (var i = 0; i < data.length; i++) {
    var searchItem = document.createElement("div");
    searchItem.className = "col-md-2";
    var searchImage = document.createElement("img");
    searchImage.classList.add("img-fluid");
    searchImage.src = data[i].show.image.medium;
    searchImage.style.borderRadius = "8px";
    searchItem.appendChild(searchImage);
    let showId = data[i].show.id;
    searchItem.addEventListener("click", function () {
      var newUrl = "?show_id=" + showId;
      window.history.pushState(null, null, newUrl);
      window.location.reload();
    });
    searchItem.style.margin = "10px";
    var searchName = document.createElement("h6");
    searchName.classList.add("name-list");
    searchName.innerHTML = data[i].show.name;
    searchName.addEventListener("click", function () {
      var newUrl = "?username=" + this.innerHTML;
      window.history.pushState(null, null, newUrl);
      window.location.reload();
    });
    searchItem.appendChild(searchName);
    searchResult.appendChild(searchItem);
  }
}

function displayShowResult(data) {
  searchResult.innerHTML = "";
  title.innerHTML = data.name;
  showImage.src = data.image.original;
  showImage.classList.add("col-md-4");
  showStatus.innerHTML = data.status;
  for (var i = 0; i < data.genres.length; i++) {
    var genre = document.createElement("li");
    genre.innerHTML = data.genres[i];
    showGenres.appendChild(genre);
  }
  showRatings.setAttribute("data-star", data.rating.average);
  showRatings.title = "Ratings: " + data.rating.average;
  btnImdb.setAttribute(
    "onclick",
    "visitImdb('https://www.imdb.com/title/" + data.externals.imdb + "')"
  );
  overview.innerHTML = data.summary;
}

function visitImdb(url) {
  window.open(url, "_blank");
}

function getAPIData(url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();
  return xhr;
}

var parseQueryString = function () {
  var str = window.location.search;
  var objURL = {};

  str.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function ($0, $1, $2, $3) {
      objURL[$1] = $3;
    }
  );
  return objURL;
};

var params = parseQueryString();
if (params.query != null) {
  var query = params.query;
  var url = "https://api.tvmaze.com/search/shows?q=" + query;
  getSearchAPIResponse(url);
  selectHeaderTabs();
} else if (params.show_id != null) {
  var showId = params.show_id;
  var url = "https://api.tvmaze.com/shows/" + showId;
  getShowAPIResponse(url);
  getShowImagesAPIResponse(url + "/images");
  getShowSeasonsAPIResponse(url + "/seasons");
  getShowCastAPIResponse(url + "/cast");
  getShowCrewAPIResponse(url + "/crew");
  selectHeaderTabs();
} else {
  var randomShowId = Math.floor(Math.random() * 1000) + 1;
  window.history.pushState(
    "object or string",
    "Title",
    "?show_id=" + randomShowId
  );
  window.location.reload();
}

function selectHeaderTabs() {
  // check how many child elements of card-header-tabs
  var childNavItems = cardHeaderTabs[0].children;
  for (var i = 0; i < childNavItems.length; i++) {
    var navItem = childNavItems[i];
    // get child nav-item
    var navLink = navItem.children[0];

    overview.style.display = "block";
    episodes.style.display = "none";
    castList.style.display = "none";
    crewList.style.display = "none";

    // when ever nav link clicked remove active class and add active class to clicked nav link
    navLink.addEventListener("click", function () {
      for (var i = 0; i < childNavItems.length; i++) {
        var navItem = childNavItems[i];
        var navLink = navItem.children[0];
        navLink.classList.remove("active");
      }
      this.classList.add("active");
      var index = Array.prototype.indexOf.call(childNavItems, this.parentNode);
      position = index;
      switch (position) {
        case 0:
          overview.style.display = "block";
          episodes.style.display = "none";
          castList.style.display = "none";
          crewList.style.display = "none";
          break;
        case 1:
          overview.style.display = "none";
          episodes.style.display = "flex";
          castList.style.display = "none";
          crewList.style.display = "none";
          break;
        case 2:
          overview.style.display = "none";
          episodes.style.display = "none";
          castList.style.display = "flex";
          crewList.style.display = "none";
          break;
        case 3:
          overview.style.display = "none";
          episodes.style.display = "none";
          castList.style.display = "none";
          crewList.style.display = "flex";
          break;
      }
    });
  }
}
