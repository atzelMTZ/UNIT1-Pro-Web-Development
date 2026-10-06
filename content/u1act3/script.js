// ==========================================
// POTATO DATASET
// ==========================================

const potatoDataset = [
    {
        id: 1,
        name: "Russet Burbank",
        category: "High Starch",
        skinColor: "Brown",
        bestUse: "Baking & French Fries",
        pricePerLb: 1.20,
        rating: 4.8
    },
    {
        id: 2,
        name: "Yukon Gold",
        category: "Medium Starch",
        skinColor: "Yellow",
        bestUse: "Mashing & Roasting",
        pricePerLb: 1.50,
        rating: 4.9
    },
    {
        id: 3,
        name: "Red Bliss",
        category: "Low Starch",
        skinColor: "Red",
        bestUse: "Boiling & Potato Salads",
        pricePerLb: 1.35,
        rating: 4.5
    },
    {
        id: 4,
        name: "Fingerling French",
        category: "Low Starch",
        skinColor: "Pink",
        bestUse: "Roasting & Grilling",
        pricePerLb: 2.80,
        rating: 4.6
    },
    {
        id: 5,
        name: "Purple Majesty",
        category: "Medium Starch",
        skinColor: "Purple",
        bestUse: "Steaming & Salads",
        pricePerLb: 2.20,
        rating: 4.4
    },
    {
        id: 6,
        name: "Kennebec",
        category: "High Starch",
        skinColor: "Tan",
        bestUse: "Frying & Chips",
        pricePerLb: 1.10,
        rating: 4.7
    },
    {
        id: 7,
        name: "All Blue",
        category: "Medium Starch",
        skinColor: "Blue",
        bestUse: "Mashing & Roasting",
        pricePerLb: 2.50,
        rating: 4.2
    },
    {
        id: 8,
        name: "Norland Red",
        category: "Low Starch",
        skinColor: "Red",
        bestUse: "Boiling & Steam",
        pricePerLb: 1.40,
        rating: 4.3
    },
    {
        id: 9,
        name: "German Butterball",
        category: "Medium Starch",
        skinColor: "Yellow",
        bestUse: "Steaming & Baking",
        pricePerLb: 1.95,
        rating: 4.8
    },
    {
        id: 10,
        name: "Jewel Sweet Potato",
        category: "Specialty",
        skinColor: "Orange",
        bestUse: "Baking & Pies",
        pricePerLb: 1.60,
        rating: 4.7
    }
];


// ==========================================
// HELPER: CREATE POTATO CARD
// ==========================================

function createPotatoCard(potato) {

    return `
        <article class="result-card">

            <h3>${potato.name}</h3>

            <p><strong>Category:</strong> ${potato.category}</p>

            <p><strong>Skin Color:</strong> ${potato.skinColor}</p>

            <p><strong>Best Use:</strong> ${potato.bestUse}</p>

            <p><strong>Price:</strong> $${potato.pricePerLb.toFixed(2)} / lb</p>

            <p><strong>Rating:</strong> ⭐ ${potato.rating}</p>

        </article>
    `;
}


// ==========================================
// 1. SIMPLE SEARCH
// ==========================================

const simpleSearchForm = document.getElementById("simple-search-form");
const simpleSearchInput = document.getElementById("simple-search");
const simpleResults = document.getElementById("simple-results");

simpleSearchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const searchTerm = simpleSearchInput.value.toLowerCase().trim();

    const results = potatoDataset.filter(function (potato) {

        return potato.name.toLowerCase().includes(searchTerm);

    });

    if (results.length === 0) {

        simpleResults.innerHTML = "<p>No potatoes found.</p>";

        return;
    }

    simpleResults.innerHTML = results
        .map(createPotatoCard)
        .join("");

});


// ==========================================
// 2. AUTOCOMPLETE SEARCH
// ==========================================

const autocompleteInput = document.getElementById("autocomplete-search");
const autocompleteResults = document.getElementById("autocomplete-results");

autocompleteInput.addEventListener("input", function () {

    const searchTerm = autocompleteInput.value.toLowerCase().trim();

    autocompleteResults.innerHTML = "";

    if (searchTerm === "") {
        return;
    }

    const suggestions = potatoDataset.filter(function (potato) {

        return potato.name.toLowerCase().includes(searchTerm);

    });

    suggestions.forEach(function (potato) {

        const suggestion = document.createElement("div");

        suggestion.classList.add("autocomplete-item");

        suggestion.textContent = potato.name;

        suggestion.addEventListener("click", function () {

            autocompleteInput.value = potato.name;

            autocompleteResults.innerHTML = "";

        });

        autocompleteResults.appendChild(suggestion);

    });

});


// ==========================================
// 3. FACETED SEARCH
// ==========================================

const facetedSearchInput = document.getElementById("faceted-search");
const categoryCheckboxes = document.querySelectorAll(
    'input[name="category"]'
);
const sortSelect = document.getElementById("sort-select");
const facetedResults = document.getElementById("faceted-results");


// Render initial results
renderFacetedResults();


// Search and filters
facetedSearchInput.addEventListener("input", renderFacetedResults);

categoryCheckboxes.forEach(function (checkbox) {

    checkbox.addEventListener("change", renderFacetedResults);

});

sortSelect.addEventListener("change", renderFacetedResults);


// Main faceted search function
function renderFacetedResults() {

    const searchTerm = facetedSearchInput.value.toLowerCase().trim();

    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(function (checkbox) {
            return checkbox.checked;
        })
        .map(function (checkbox) {
            return checkbox.value;
        });


    let results = potatoDataset.filter(function (potato) {

        const matchesSearch =
            potato.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(potato.category);

        return matchesSearch && matchesCategory;

    });


    // Sorting
    switch (sortSelect.value) {

        case "name-asc":

            results.sort(function (a, b) {
                return a.name.localeCompare(b.name);
            });

            break;


        case "price-asc":

            results.sort(function (a, b) {
                return a.pricePerLb - b.pricePerLb;
            });

            break;


        case "price-desc":

            results.sort(function (a, b) {
                return b.pricePerLb - a.pricePerLb;
            });

            break;


        case "rating-desc":

            results.sort(function (a, b) {
                return b.rating - a.rating;
            });

            break;
    }


    // Display results

    if (results.length === 0) {

        facetedResults.innerHTML = "<p>No potatoes found.</p>";

        return;
    }


    facetedResults.innerHTML = results
        .map(createPotatoCard)
        .join("");
}