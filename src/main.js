import autoComplete from "@tarekraafat/autocomplete.js";

const autoCompleteJS = new autoComplete({
    placeHolder: "Cerca note 🍕...",
    data: {
        src: async () => {
            try {
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", "Sto cercando 🍕...");
                const source = await fetch(
                    "/links.json"
                );
                const data = await source.json();
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", autoCompleteJS.placeHolder);
                return data;
            } catch (error) {
                return error;
            }
        },
        keys: ["description"]
    },
    resultItem: {
        highlight: {
            render: true
        }
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


function resultCard({ value }) {
    return `<div class="result">
    <h3>${value.title}</h3>
    <a href="${value.fileurl}" target="_blank">Play 🔊</a>
    <a href="${value.link}" target="_blank">${value.description} 🔗</a>
    </div>`;

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

    template += '<h2>Altri Risultati</h2>';
    for (let match of result.results) {
        template += resultCard(match);
    }

    return template;
}
