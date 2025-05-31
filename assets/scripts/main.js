// Expand or collapse the menu
function toggleMenu() {
    const menu = document.querySelector("#menu");
    const body = document.querySelector("body");

    if (window.innerWidth <= 770) {
        // Hide the menu
        const menuFlexbox =  document.querySelector("#menu-flex");
        menuFlexbox.classList.toggle("hide");
    } else {
        // Collapse all categories
        const containers = document.querySelectorAll(".container");
        for (container of containers) {
            const expandIcon = container.querySelector(".expand-icon");
            const subcategory = container.querySelector(".subcategory");
            
            if (expandIcon && subcategory) {
                expandIcon.textContent = "▶";
                subcategory.classList.add("hide");
            }
        }
    }
    // Adjust the menu and body
    menu.classList.toggle("shrink");
    body.classList.toggle("expand");
}


// Expand or collapse the menu category
function toggleMenuCategory() {
    const menu = document.querySelector("#menu");

    if (!menu.classList.contains("shrink") && 
        (window.innerWidth > 990 || window.innerWidth <= 770)) {
        const expandIcon = this.querySelector(".expand-icon");
        const subcategory = this.nextElementSibling;

        if (this.classList.contains("collapse")) {
            expandIcon.textContent = "▼";
            subcategory.classList.remove("hide");
        } else {
            expandIcon.textContent = "▶";
            subcategory.classList.add("hide");
        }
        this.classList.toggle("collapse")
    }
}


// Create menu category
function createMenuCategory(categoryName, categoryObj) {

    // Create a container for the category
    let categoryContainer = document.createElement("div");
    categoryContainer.className = "container";

    // Category link
    let categoryLink = document.createElement("a");
    categoryLink.className = "category";
    categoryLink.href = `#${categoryName.toLowerCase().replace(/[\s&]+/g, '-')}`;

    // Category icon
    let categoryIcon = document.createElement("img");
    categoryIcon.className = "category-icon";
    categoryIcon.src = categoryObj.icon || "";

    // Category name
    let categoryLabel = document.createElement("p");
    let categoryText = document.createTextNode(categoryName);
    categoryLabel.className = "category-name";
    categoryLabel.appendChild(categoryText);

    // Expand icon
    let expandIcon = document.createElement("div");
    expandIcon.className = "expand-icon";

    // Assemble category link
    categoryLink.appendChild(categoryIcon);
    categoryLink.appendChild(categoryLabel);
    categoryLink.appendChild(expandIcon);

    // Assemble container
    categoryContainer.appendChild(categoryLink);

    return categoryContainer;
}


// Create a tag for the main category
function createCategoryTag(imgLink, categoryName) {
    let categoryDiv = document.createElement("div");
    categoryDiv.className = "tag-flex";

    let tagImg = document.createElement("img");
    tagImg.src = imgLink;

    let tagP = document.createElement("p");
    let tagText = document.createTextNode(categoryName);
    tagP.id = categoryName.toLowerCase().replace(/[\s&]+/g, '-');

    tagP.appendChild(tagText);
    categoryDiv.appendChild(tagImg);
    categoryDiv.appendChild(tagP);
    main.appendChild(categoryDiv);
}


// Create a tag for the subcategory
function createSubcategoryTag(subcategoryName) {
    if (subcategoryName.toLowerCase() === 'default') return;

    let subcategoryText = document.createElement("p");
    subcategoryText.className = "subcategory-text";  
    subcategoryText.id = subcategoryName.toLowerCase().replace(/[\s&]+/g, '-');
    
    let subcategoryVal = document.createTextNode(subcategoryName);

    subcategoryText.appendChild(subcategoryVal);
    main.appendChild(subcategoryText);
}


// Create a card for each item and add it to the grid
function createCards(grid, item) {
    let cardDiv = document.createElement("div");
    cardDiv.className = "card";

    let cardLink = document.createElement("a");
    cardLink.href = item["link"];
    cardLink.target = "_blank";

    let cardLogo = document.createElement("img");
    cardLogo.className = "card-logo";
    cardLogo.src = item["logo"];

    let cardTextDiv = document.createElement("div");

    let cardTitle = document.createElement("p");
    cardTitle.className = "title";

    let cardTitleText = document.createTextNode(item["title"]);
    cardTitle.appendChild(cardTitleText);

    let cardDesc = document.createElement("p");
    cardDesc.className = "desc";

    let cardDescText = document.createTextNode(item["desc"]);
    cardDesc.appendChild(cardDescText);

    cardTextDiv.appendChild(cardTitle);
    cardTextDiv.appendChild(cardDesc);

    cardLink.appendChild(cardLogo);
    cardLink.appendChild(cardTextDiv);
    
    cardDiv.appendChild(cardLink);

    grid.appendChild(cardDiv);
}


// Display the menu and body content
function displayContent(data) {
    const main = document.querySelector("#main");
    const menuFlex = document.querySelector("#menu-flex");
    const tagImgLink = "assets/images/icon/tag.svg";

    for (let category in data) {
        createCategoryTag(tagImgLink, category);
        let categoryContainer = createMenuCategory(category, data[category]);
        const subcategories = data[category]["subcategories"];

        let subcategoryList = document.createElement("ul");
        subcategoryList.className = "subcategory hide";

        if (Object.keys(subcategories).length > 1) {
            let expandIcon = categoryContainer.querySelector('.expand-icon');
            expandIcon.textContent = "▶";

            let categotyLink = categoryContainer.querySelector('.category');
            categotyLink.classList.add("collapsible", "collapse");

        }

        for (let subcategory in subcategories) {
            createSubcategoryTag(subcategory);
            
            // menu link
            if (subcategory !== "default") {
                let subLink = document.createElement("a");
                subLink.href = `#${subcategory ? subcategory.toLowerCase().replace(/[\s&]+/g, '-') : ''}`;

                let subLi = document.createElement("li");
                subLi.className = "subcategory-name";
                subLi.textContent = subcategory || "";
                subLink.appendChild(subLi);
                subcategoryList.appendChild(subLink);

                categoryContainer.appendChild(subcategoryList);
            }

            let infoGrid = document.createElement("div");
            infoGrid.id = "info-grid";

            const items = subcategories[subcategory];
            for (let item of items) {
                createCards(infoGrid, item);
            }

            main.appendChild(infoGrid);
        }

        menuFlex.appendChild(categoryContainer);
    }
}


// Add event listeners
function attachEventListeners() {
    const collapsibles = document.querySelectorAll(".collapsible");
    for (let i = 0; i < collapsibles.length; i++) {
        let collapsible = collapsibles[i];
        collapsible.addEventListener("click", toggleMenuCategory);
    }

    const menuIcon = document.querySelector("#menu-icon");
    menuIcon.addEventListener("click", toggleMenu);
}


// Hide the menu on small screen
if (window.innerWidth <= 770) {
    toggleMenu();
}

// Fetch data from JSON file and display content
fetch("data.json")
    .then(response => response.json())
    .then(json => {
        displayContent(json);
        attachEventListeners();
    });
