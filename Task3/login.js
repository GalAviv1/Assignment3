document.addEventListener("DOMContentLoaded", function () {
  const visitorCardsContainer = document.getElementById("visitor-cards");
  const filterInput = document.getElementById("filter");

  function createVisitorCard(visitor) {
    const card = document.createElement("div");
    card.classList.add("visitor-card");

    const name = document.createElement("h2");
    name.textContent = visitor.name;
    card.appendChild(name);

    const image = document.createElement("img");
    image.src = "images/visitor.png"; 
    card.appendChild(image);

    const coins = document.createElement("p");
    coins.classList.add("coins"); 

    const currency = document.createElement("span");
    currency.classList.add("currency");
    currency.textContent = "💰"; 

    coins.appendChild(currency);
    coins.appendChild(document.createTextNode(visitor.coins)); 
    card.appendChild(coins);

    card.addEventListener("click", function () {
      selectVisitor(visitor.name, visitor.coins);
    });

    return card;
  }

  const getEmptyCardsHTMLTemplate = () => {
    const templateWrapper = document.createElement("div");
    templateWrapper.className = "empty-result";
  
    const template = `
      <h2>No Visitor Found</h2>
      <p>We're sorry, but no visitors match your search or filter criteria.</p>
      <button id="clear-filter-btn" class="btn btn-dark">Clear search text</button>
      `;
    templateWrapper.innerHTML = template;
    templateWrapper.className ="none-visitors";
    templateWrapper.children["clear-filter-btn"].addEventListener("click",clearSearchBox);
    return templateWrapper;
  };


  function renderAvailableVisitors(filteredVisitors) {
    visitorCardsContainer.innerHTML = "";
    filteredVisitors.forEach((visitor) => {
      const card = createVisitorCard(visitor);
      card.addEventListener("click", function() {
        SearchSpecificVisitor(visitor.name);
      });
      visitorCardsContainer.appendChild(card);
      
    });
  }


  function filterVisitorsByName(searchTerm) {
    const filteredVisitors = visitors.filter((visitor) => {
      return visitor.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    renderAvailableVisitors(filteredVisitors);
    SearchSpecificVisitor(searchTerm);
  }

  filterInput.addEventListener("keyup", function () {
    const searchTerm = filterInput.value.trim();
    filterVisitorsByName(searchTerm);
  });

  renderAvailableVisitors(visitors);
});


  getVisitorNameFromURL();

  function SearchSpecificVisitor(visitorName) {
    const selectedVisitor = visitor.find(visitor => visitor.name === visitorName);
    if (!selectedVisitor) {
        console.error("Selected visitor not found!");
        return;
    }
  }


function selectVisitor(visitorName, visitorCoins) {
  localStorage.setItem('currentVisitor', visitorName);
  localStorage.setItem('currentVisitorCoins', visitorCoins);
  updateVisitorNameAndCoinsInNav(visitorName, visitorCoins);
}

function getVisitorNameFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const visitorName = urlParams.get('name');
  const visitorCoins = urlParams.get('coins');
  const visitorNameElement = document.getElementById("visitor-name");
  const visitorCoinsElement = document.getElementById("visitor-coins");
  const switchVisitorButton = document.getElementById("switch-visitor-button");
  
  if (visitorNameElement && visitorCoinsElement) {
    if (visitorName) {
      localStorage.setItem('currentVisitor', visitorName);
      localStorage.setItem('currentVisitorCoins', visitorCoins);
      updateVisitorNameAndCoinsInNav(visitorName, visitorCoins);
    } else {
      const currentVisitor = localStorage.getItem('currentVisitor');
      const currentCoins = localStorage.getItem('currentVisitorCoins');
      if (currentVisitor && currentCoins) {
        updateVisitorNameAndCoinsInNav(currentVisitor, currentCoins);
      } else {
        visitorNameElement.textContent = "Guest";
        visitorCoinsElement.textContent = "0";
      }
    }
  }

  if (switchVisitorButton) {
    switchVisitorButton.addEventListener("click", function () {
      selectVisitor();
    });
  }
}

document.getElementById('enter-zoo').addEventListener('click', function() {
  document.getElementById('visitor-dialog').showModal();
});


document.getElementById('yes-button').addEventListener('click', function() {
  window.location.href = 'zoo.html';
});
