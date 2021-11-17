import autoComplete from "@tarekraafat/autocomplete.js";

const autoCompleteJS = new autoComplete({
    placeHolder: "Start typing...",
    data: {
        src: async () => {
            try {
                // Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", "Loading...");
                // Fetch External Data Source
                const source = await fetch(
                    "/links_2021-11-16T23.08.18.947Z.json"
                );
                const data = await source.json();
                // Post Loading placeholder text
                document
                    .getElementById("autoComplete")
                    .setAttribute("placeholder", autoCompleteJS.placeHolder);
                // Returns Fetched data
                return data;
            } catch (error) {
                return error;
            }
        },
        keys: ["description", "title"]
    },
    resultItem: {
        highlight: {
            render: true
        }
    },
    resultsList: {
        element: (list, data) => {
            if (!data.results.length) {
                // Create "No Results" message element
                const message = document.createElement("div");
                // Add class to the created element
                message.setAttribute("class", "no_result");
                // Add message text content
                message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                // Append message element to the results list
                list.prepend(message);
            }
        },
        noResults: true,
    },
});

autoCompleteJS.input.addEventListener("selection", function (event) {
    const feedback = event.detail;
    autoCompleteJS.input.blur();
    // Prepare User's Selected Value
    const selection = feedback.selection.value[feedback.selection.key];
    // Render selected choice to selection div
    document.querySelector(".selection").innerHTML = `${JSON.stringify(feedback.results, null, 2)}`;
    // Replace Input value with the selected value
    autoCompleteJS.input.value = selection;
    // Console log autoComplete data feedback
    console.log(feedback);
});
