document.addEventListener("DOMContentLoaded", function() {
  const currentVisitor = localStorage.getItem('currentVisitor');
  
  if (currentVisitor) {
    displayVisitedAnimals(currentVisitor);
    displayFedAnimals(currentVisitor);
    displayFavoriteAnimal(currentVisitor);
    const currentVisitorCoins = currentVisitor.coins
    updateVisitorNameAndCoinsInNav(currentVisitor, currentVisitorCoins);
  }
  
  populateVisitorDropdown();
  const currentVisitorName = localStorage.getItem('currentVisitor');
  
  if (currentVisitorName) {
    const visitorsString = localStorage.getItem("visitors");
    const visitors = visitorsString ? JSON.parse(visitorsString) : [];
    const currentVisitor = visitors.find(visitor => visitor.name === currentVisitorName);
    if (currentVisitor) {
      displayVisitedAnimals(currentVisitorName);
      displayFedAnimals(currentVisitorName);
      displayFavoriteAnimal(currentVisitorName);
      if (currentVisitor.coins !== undefined) {
        updateVisitorNameAndCoinsInNav(currentVisitorName, currentVisitor.coins);
      }
    }
  }
  document.getElementById("logout-button").addEventListener("click", function() {
      logout();
  });

  document.getElementById("reset-button").addEventListener("click", function() {
    localStorage.clear();
    window.location.reload();
  });
});

function populateVisitorDropdown() {
  const visitorsString = localStorage.getItem("visitors");
  const visitors = visitorsString ? JSON.parse(visitorsString) : [];
  const dropdown = document.getElementById("visitor-dropdown");
  dropdown.innerHTML = '';

  visitors.forEach(visitor => {
    const option = document.createElement("option");
    option.textContent = visitor.name;
    option.value = visitor.name; 
    dropdown.appendChild(option);
  });


  dropdown.addEventListener("change", function() {
    const selectedVisitor = visitors.find(v => v.name === this.value);
    if (selectedVisitor) {
      localStorage.setItem("currentVisitor", selectedVisitor.name);
      displayVisitedAnimals(selectedVisitor.name);
      displayFedAnimals(selectedVisitor.name);
      displayFavoriteAnimal(selectedVisitor.name);
      updateVisitorNameAndCoinsInNav(selectedVisitor.name, selectedVisitor.coins);
    }
  });
  

  const currentVisitor = localStorage.getItem('currentVisitor');
  if (currentVisitor) {
    dropdown.value = currentVisitor;
  }
}
function displayVisitedAnimals(visitorName) {
  const visitedKey = visitorName + "_visitedAnimals";
  const visitedAnimals = JSON.parse(localStorage.getItem(visitedKey)) || {};
  const list = document.getElementById("list-visited-animals");
  list.innerHTML = ''; 

  Object.entries(visitedAnimals).forEach(([animalName, visits]) => {
    const card = document.createElement("div");
    card.className = "animal-card";
    
    const name = document.createElement("h3");
    name.textContent = animalName;

    const visitCount = document.createElement("p");
    visitCount.textContent = `Visits: ${visits}`;
    
    card.appendChild(name);
    card.appendChild(visitCount);
    
    list.appendChild(card);
  });
}



function displayFedAnimals(visitorName) {
  const fedKey = visitorName + "_fedAnimals";
  const fedAnimals = JSON.parse(localStorage.getItem(fedKey)) || [];
  const list = document.getElementById("list-fed-animals");
  list.innerHTML = '';

  fedAnimals.forEach(animalName => {
    const card = document.createElement("div");
    card.className = "animal-card";
    
    const name = document.createElement("h3");
    name.textContent = animalName;
    
    card.appendChild(name);
    
    list.appendChild(card);
  });
}

function displayFavoriteAnimal(visitorName) {
  const visitedKey = visitorName + "_visitedAnimals";
  const visitedAnimals = JSON.parse(localStorage.getItem(visitedKey)) || {};
  let favoriteAnimal = "";
  let maxVisits = 0;
  Object.entries(visitedAnimals).forEach(([animal, visits]) => {
    if (visits > maxVisits) {
      favoriteAnimal = animal;
      maxVisits = visits;
    }
  });

  const container = document.getElementById("favorite-animal");

  if (favoriteAnimal) {
    const card = document.createElement("div");
    card.className = "animal-card favorite";

    const name = document.createElement("h3");
    name.textContent = favoriteAnimal;

    const visitCount = document.createElement("p");
    visitCount.textContent = `Favorite with ${maxVisits} visits`;

    card.appendChild(name);
    card.appendChild(visitCount);

    container.innerHTML = "";
    container.appendChild(card);
  } else {
    container.textContent = "No favorite animal found";
  }
}

