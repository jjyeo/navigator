// Expand or collapse the menu
function toggleMenu() {
    const menu = document.querySelector("#menu");
    const body = document.body;
    const isMobile = window.innerWidth <= 770;

    // Hide the menu on small screens
    if (isMobile) {
        document.querySelector("#menu-flex")?.classList.toggle("hide");
    }

    // Collapse all categories
    document.querySelectorAll(".container").forEach(container => {
        const expandIcon = container.querySelector(".expand-icon");
        const subcategory = container.querySelector(".subcategory");
        if (expandIcon && subcategory) {
            expandIcon.textContent = "▶";
            subcategory.classList.add("hide");
        }
    });

    // Adjust the menu and body
    menu.classList.toggle("shrink");
    body.classList.toggle("expand");
}


// Expand or collapse categories in menu
function toggleMenuCategory() {
    const menu = document.querySelector("#menu");
    const isMenuExpanded = !menu.classList.contains("shrink");
    const isDesktop = window.innerWidth > 770;
    const isMobile = window.innerWidth <= 770;

    if (isMenuExpanded && (isDesktop || isMobile)) {
        const expandIcon = this.querySelector(".expand-icon");
        const subcategory = this.nextElementSibling;

        const isCollapsed = this.classList.contains("collapse");
        expandIcon.textContent = isCollapsed ? "▼" : "▶";
        subcategory.classList.toggle("hide", !isCollapsed);
        this.classList.toggle("collapse");
    }
}


// Create categories in menu
function createMenuCategory(categoryName, categoryObj) {
    // Create a category container
    const categoryContainer = document.createElement("div");
    categoryContainer.className = "container";

    // Category link
    const categoryLink = document.createElement("a");
    categoryLink.className = "category";

    // Category icon
    if (categoryObj.icon) {
        const categoryIcon = document.createElement("img");
        categoryIcon.className = "category-icon";
        categoryIcon.src = categoryObj.icon;
        categoryLink.appendChild(categoryIcon);
    }

    // Category name
    const categoryLabel = document.createElement("p");
    categoryLabel.className = "category-name";
    categoryLabel.textContent = categoryName;
    categoryLink.appendChild(categoryLabel);

    // Expand icon
    const expandIcon = document.createElement("div");
    expandIcon.className = "expand-icon";
    categoryLink.appendChild(expandIcon);

    categoryContainer.appendChild(categoryLink);

    return categoryContainer;
}


// Create a tag for the main category
function createCategoryTag(imgLink, categoryName) {
    const main = document.querySelector("#main");
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "tag-flex";

    const tagImg = document.createElement("img");
    tagImg.src = imgLink;

    const tagText = document.createElement("p");
    tagText.id = categoryName.toLowerCase().replace(/[\s&]+/g, '-');
    tagText.textContent = categoryName;

    categoryDiv.appendChild(tagImg);
    categoryDiv.appendChild(tagText);
    main.appendChild(categoryDiv);
}


// Create a tag for the subcategory
function createSubcategoryTag(subcategoryName) {
    const main = document.querySelector("#main");
    const subcategoryText = document.createElement("p");
    subcategoryText.className = "subcategory-text";
    subcategoryText.id = subcategoryName.toLowerCase().replace(/[\s&]+/g, '-');
    subcategoryText.textContent = subcategoryName;
    main.appendChild(subcategoryText);
}


// Create a card for each item and add it to the grid
function createCards(grid, item) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const cardLink = document.createElement("a");
    cardLink.href = item.link;
    cardLink.target = "_blank";

    const cardLogo = document.createElement("img");
    cardLogo.className = "card-logo";
    cardLogo.src = item.logo;
    cardLink.appendChild(cardLogo);
    
    const cardTextDiv = document.createElement("div");

    const cardTitle = document.createElement("p");
    cardTitle.className = "title";
    cardTitle.textContent = item.title;
    cardTextDiv.appendChild(cardTitle);

    if (item.desc) {
        const cardDesc = document.createElement("p");
        cardDesc.className = "desc";
        cardDesc.textContent = item.desc;
        cardTextDiv.appendChild(cardDesc);
    }

    cardLink.appendChild(cardTextDiv);
    cardDiv.appendChild(cardLink);
    grid.appendChild(cardDiv);
}


// Display the menu and body content
function displayContent(data) {
    const main = document.querySelector("#main");
    const menuFlex = document.querySelector("#menu-flex");
    const tagImgLink = "assets/images/icon/tag.svg";

    for (const category in data) {
        // Create category in body and menu
        createCategoryTag(tagImgLink, category);
        const categoryContainer = createMenuCategory(category, data[category]);
        const subcategories = data[category]["subcategories"];
        const subcategoryList = document.createElement("ul");
        subcategoryList.className = "subcategory hide";

        const hasSubcategories = Object.keys(subcategories).length > 0;
        if (hasSubcategories) {
            const expandIcon = categoryContainer.querySelector('.expand-icon');
            expandIcon.textContent = "▶";
            const categoryLink = categoryContainer.querySelector('.category');
            categoryLink.classList.add("collapsible", "collapse");
        }

        for (const subcategory in subcategories) {
            createSubcategoryTag(subcategory);

            // Add subcategory link to menu
            const subLink = document.createElement("a");
            subLink.href = `#${subcategory.toLowerCase().replace(/[\s&]+/g, '-')}`;
            const subLi = document.createElement("li");
            subLi.className = "subcategory-name";
            subLi.textContent = subcategory;
            subLink.appendChild(subLi);
            subcategoryList.appendChild(subLink);

            // Create cards for each item in subcategory
            const infoGrid = document.createElement("div");
            infoGrid.id = "info-grid";
            const items = subcategories[subcategory];
            items.forEach(item => createCards(infoGrid, item));
            main.appendChild(infoGrid);
        }

        // Only append subcategoryList if it has children
        if (subcategoryList.children.length > 0) {
            categoryContainer.appendChild(subcategoryList);
        }

        menuFlex.appendChild(categoryContainer);
    }
}


// Move the logo to the header or menu based on screen size
function moveLogo() {
    const header = document.querySelector("#header");
    const menuFlex = document.querySelector("#menu-flex");
    
    if (window.innerWidth <= 770) {
        const logoInMenu = document.querySelector('#menu-flex > a');
        if (logoInMenu && !header.contains(logoInMenu)) {
            header.insertBefore(logoInMenu, header.firstChild);
        }
    } else {
        const logoInHeader = document.querySelector('#header > a');
        if (logoInHeader && !menuFlex.contains(logoInHeader)) {
            menuFlex.insertBefore(logoInHeader, menuFlex.firstChild);
        }
    }
}


// Add event listeners
function attachEventListeners() {
    document.querySelectorAll(".collapsible").forEach(collapsible => {
        collapsible.addEventListener("click", toggleMenuCategory);
    });
    document.querySelector("#menu-icon")?.addEventListener("click", toggleMenu);
}


// Initialize the application
function initApp() {
    // Hide the menu on small screens
    if (window.innerWidth <= 770) {
        toggleMenu();
    }

    // Fetch data from JSON file and display content
    fetch("data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            displayContent(json);
            attachEventListeners();
        })
        .catch(error => {
            console.error("Failed to load data.json:", error);
        });
}

initApp();
window.addEventListener('resize', moveLogo);
window.addEventListener('DOMContentLoaded', moveLogo);
