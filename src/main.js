import autoComplete from "@tarekraafat/autocomplete.js";
import { LINK_URL, LAST_UPDATE, EPISODES_URL } from "./consts.js";

function attachLinkSearch() {
  const autoCompleteJS = new autoComplete({
    placeHolder: "Cerca note 🍕...",
    data: {
      src: async () => {
        try {
          document
            .getElementById("autoComplete")
            .setAttribute("placeholder", "Sto cercando 🍕...");
          const source = await fetch(LINK_URL);
          const data = await source.json();
          document
            .getElementById("autoComplete")
            .setAttribute("placeholder", autoCompleteJS.placeHolder);
          return data;
        } catch (error) {
          return error;
        }
      },
      keys: ["description"],
    },
    resultItem: {
      highlight: {
        render: true,
      },
    },
    resultsList: {
      element: (list, data) => {
        if (!data.results.length) {
          const message = document.createElement("div");
          message.setAttribute("class", "no_result");
          message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
          list.prepend(message);
        }
      },
      noResults: true,
    },
  });

  autoCompleteJS.input.addEventListener("selection", function (event) {
    const result = event.detail;
    autoCompleteJS.input.blur();
    const selection = result.selection.value[result.selection.key];
    document.querySelector(".results").innerHTML = parseResult(result);
    autoCompleteJS.input.value = selection;
    console.log(result);
  });
}

function attachEpisodesList() {
  fetch(EPISODES_URL)
    .then((res) => res.json())
    .then((eps) => {
      const result = eps.map((e) => episodeAccordion(e));
      document.querySelector(".results").innerHTML = result.join("\n");
    });
}

function resultCard({ value }) {
  return `<div class="result">
    <h3>${value.title}</h3>
    <a href="${value.fileUrl}" target="_blank">Play 🔊</a>
    <a href="${value.link}" target="_blank">${value.description} 🔗</a>
    </div>`;
}

function episodeAccordion(episode) {
  return `<details name="episodes">
  <summary>${episode.title}</summary>
  <div class="episodeInfo">
    <a href="${episode.fileUrl}" target="_blank">Ascolta 🔉</a>
  </div>
  ${
    episode.links && episode.links.length > 0
      ? `<ul>
  ${episode.links
    .map(
      (l) => `<li><a href="${l.link}" target="_blank">${l.description}</a></li>`
    )
    .join("\n")}
  </ul>`
      : ""
  }
  ${
    episode.links && episode.links.length < 1
      ? `<h2> No links in this episode</h2>`
      : ""
  }
  </details>`;
}

/*
 "value": {
    "link": "https://youtu.be/U--k2MbikBk",
    "description": "📺 Puntata video!!",
    "title": "267: Un Ideo"
  },
*/
function parseResult(result) {
  let template = `${resultCard(result.selection)}`;

  if (result.results.length < 2) {
    return template;
  }

  template += "<h2>Altri Risultati</h2>";
  for (let match of result.results) {
    template += resultCard(match);
  }

  return template;
}

document.addEventListener("DOMContentLoaded", function () {
  document.location.href.includes("episodes")
    ? attachEpisodesList()
    : attachLinkSearch();
  document.querySelector(
    ".lastUpdate"
  ).innerHTML = `Aggiornato: ${LAST_UPDATE.toLocaleString()}`;
});
