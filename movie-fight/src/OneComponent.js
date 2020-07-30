import React from "react";
const axios = require("axios");

const videosearch = async (side, videoName) => {
  const resp = await axios.get(
    "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCUwhupH2HLk8i1V0qCVty83RK_4zuKel8&type=video&part=snippet&maxResults=1&q=" +
      videoName
  );
  // console.log(resp.data.items[0].id.videoId)
  if (side === "left") {
    document
      .querySelector("#video-l iframe")
      .setAttribute(
        "src",
        "http://www.youtube.com/embed/" + resp.data.items[0].id.videoId
      );
  } else {
    document
      .querySelector("#video-r iframe")
      .setAttribute(
        "src",
        "http://www.youtube.com/embed/" + resp.data.items[0].id.videoId
      );
  }
};

const runComparison = () => {
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;
    console.log(leftSideValue, rightSideValue);

    if (leftSideValue === "NaN" || rightSideValue === "NaN") {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    } else if (rightSideValue > leftSideValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-danger");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-danger");
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollar = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  let count = 0;
  let awards;
  movieDetail.Awards.split(" ").forEach((word) => {
    const value = parseInt(word);

    if (isNaN(value)) {
      return;
    } else {
      count = count + value;
    }
  });
  awards = count;
  //  videosearch()

  return `
     <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}"/>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p> 
        </div>
       </div>   
     </article>
     <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
     </article> 

     <article data-value=${dollar} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
     </article>

     <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
     </article>

     <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
     </article> 

     <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
     </article> 
    `;
};

let leftMovie;
let rightMovie;

const onMovie = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "cd501bc9",
      i: movie.imdbID,
    },
  });
  //console.log(response.data)
  summaryElement.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparison();
  }
  videosearch(side, movie.Title);
};

const fetchData = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "cd501bc9",
      s: searchTerm,
    },
  });
  if (response.data.error) return [];

  return response.data.Search;
};

const takeInput = async (e) => {
  document.querySelector(".tutorial").classList.add("is-hidden");
  const items = await fetchData(e.target.value);
  console.log(typeof items);
  if (typeof items !== "undefined") {
    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = `<img src="${item.Poster}"/>
                                      ${item.Title} (${item.Year})`;
      option.addEventListener("click", () => {
        document.querySelector(".dropdown").classList.remove("is-active");
        document.querySelector(".input").value = item.Title;
        onMovie(item, document.querySelector("#left-summary"), "left");
      });
      document.querySelector(".results").appendChild(option);
    }
  }
};
const takeInput1 = async (e) => {
  //document.querySelector(".tutorial").classList.add("is-hidden");
  const items = await fetchData(e.target.value);
  console.log(typeof items);
  if (typeof items !== "undefined") {
    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = `<img src="${item.Poster}"/>
                                        ${item.Title} (${item.Year})`;
      option.addEventListener("click", () => {
        document.querySelector("#dr").classList.remove("is-active");
        document.querySelector("#d").value = item.Title;
        onMovie(item, document.querySelector("#right-summary"), "right");
      });
      document.querySelector("#ds").appendChild(option);
    }
  }
};
const OneComponent = () => {
  return (
    <div>
      <div className="container">
        <div className="columns">
          <div className="column">
            <label>
              <b>Search For A Movie</b>
            </label>
            <input
              className="input"
              onChange={takeInput}
              style={{ margin: "20px" }}
            />
            <div className="dropdown is-active" style={{ display: "block" }}>
              <div className="dropdown-menu">
                <div className="dropdown-content results"></div>
              </div>
            </div>
            <div id="left-summary"></div>
            <div id="video-l" style={{ margin: "20px" }}>
              <iframe
                width="420"
                height="450"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <div className="column">
            <label>
              <b>Search For A Movie</b>
            </label>
            <input
              className="input"
              id="d"
              onChange={takeInput1}
              style={{ margin: "20px" }}
            />
            <div
              className="dropdown is-active "
              id="dr"
              style={{ display: "block" }}
            >
              <div className="dropdown-menu d">
                <div className="dropdown-content results " id="ds"></div>
              </div>
            </div>
            <div id="right-summary"></div>
            <div id="video-r" style={{ margin: "20px" }}>
              <iframe
                width="420"
                height="450"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="column is-half notification is-primary tutorial">
        <h1 className="title">Search For a Movie on Both Sides</h1>
        <p className="subtitle">We will tell you which is best!</p>
      </div>
    </div>
  );
};
export default OneComponent;
