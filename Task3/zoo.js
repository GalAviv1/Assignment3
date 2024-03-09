document.addEventListener("DOMContentLoaded", function() {
  animals.forEach(animal => {
      switch (animal.name) {
          case "Lion":
              animal.image = "images/lion.png";
              break;
          case "Elephant":
              animal.image = "images/elephant.png";
              break;
          case "Cheetah":
              animal.image = "images/Cheetah.png";
              break;
          case "Giraffe":
              animal.image = "images/Giraffe.png";
              break;
          case "Kangaroo":
              animal.image = "images/Kangeroo.png";
              break;
          case "Monkey":
              animal.image = "images/Monkey.png";
              break;
          case "Penguin":
              animal.image = "images/Penguin.png";
              break;
          case "Zebra":
              animal.image = "images/Zebra.png";
              break;
          case "Tiger":
              animal.image = "images/tiger.png";
              break;
      }
  });

  populateVisitorDropdown();
  setupFilterListeners();
  renderAvailableAnimals(animals);

  const currentVisitorName = localStorage.getItem('currentVisitor');
  if (currentVisitorName) {
      const visitors = JSON.parse(localStorage.getItem("visitors")) || [];
      const currentVisitor = visitors.find(visitor => visitor.name === currentVisitorName);
      if (currentVisitor) {
          updateVisitorNameAndCoinsInNav(currentVisitor.name, currentVisitor.coins);
      }
  }

  document.getElementById("logout-button").addEventListener("click", logout);
  document.getElementById("reset-button").addEventListener("click", function() {
      localStorage.clear();
      window.location.reload();
  });
});

function createAnimalCard(animal) {
  const card = document.createElement("div");
  card.classList.add("animal-card");

  const name = document.createElement("h2");
  name.textContent = animal.name;
  card.appendChild(name);

  const image = document.createElement("img");
  image.src = animal.image;
  card.appendChild(image);

  const detailsList = document.createElement("ul");
  detailsList.innerHTML = `<li>Is Predator: ${animal.isPredator ? "Yes" : "No"}</li>
                           <li>Weight: ${animal.weight} kg</li>
                           <li>Height: ${animal.height} cm</li>
                           <li>Color: ${animal.color}</li>
                           <li>Habitat: ${animal.habitat}</li>`;
  card.appendChild(detailsList);
  card.addEventListener("click", function() {
    visitAnimal(animal.name);
});
  return card;
}

function renderAvailableAnimals(filteredAnimals) {
  const animalCardsContainer = document.getElementById("animal-cards");
  animalCardsContainer.innerHTML = '';

  filteredAnimals.forEach(animal => {
    const card = createAnimalCard(animal);
    animalCardsContainer.appendChild(card);
  });
}

function applyFilters() {
  const searchTerm = document.getElementById("filter").value.trim().toLowerCase();
  const weightMin = parseInt(document.getElementById("weightMin").value) || 0;
  const heightMin = parseInt(document.getElementById("heightMin").value) || 0;
  const habitat = document.querySelector('input[name="habitat"]:checked') ? document.querySelector('input[name="habitat"]:checked').value.toLowerCase() : "";
  const color = document.getElementById("animal-color").value.toLowerCase();
  const isPredatorChecked = document.getElementById("predator").checked; 

  const filteredAnimals = animals.filter(animal => {
    const predatorMatch = !isPredatorChecked || (animal.isPredator === isPredatorChecked);
    return animal.name.toLowerCase().includes(searchTerm) &&
           animal.weight >= weightMin &&
           animal.height >= heightMin &&
           (habitat === "" || animal.habitat.toLowerCase() === habitat) &&
           (color === "all colors" || animal.color.toLowerCase() === color) &&
           predatorMatch;
  });

  renderAvailableAnimals(filteredAnimals);
}

function setupFilterListeners() {
  document.getElementById("filter").addEventListener("keyup", applyFilters);
  document.getElementById("weightMin").addEventListener("input", applyFilters);
  document.getElementById("heightMin").addEventListener("input", applyFilters);
  document.querySelectorAll('input[name="habitat"]').forEach(radio => radio.addEventListener("change", applyFilters));
  document.getElementById("animal-color").addEventListener("change", applyFilters);
  document.getElementById("predator").addEventListener("change", applyFilters);
}

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
      updateVisitorNameAndCoinsInNav(selectedVisitor.name, selectedVisitor.coins);
    }
  });

  const currentVisitor = localStorage.getItem('currentVisitor');
  if (currentVisitor) {
    dropdown.value = currentVisitor;
  }
}

function updateVisitorNameAndCoinsInNav(visitorName, visitorCoins) {
  const visitorNameElement = document.getElementById("visitor-name");
  const visitorCoinsElement = document.getElementById("visitor-coins");
  if (visitorNameElement && visitorCoinsElement) {
    visitorNameElement.textContent = visitorName;
    visitorCoinsElement.textContent = `${visitorCoins} coins`;
  }
}

function visitAnimal(animalName) {
  const selectedAnimal = animals.find(animal => animal.name === animalName);
  if (!selectedAnimal) {
      console.error("Selected animal not found!");
      return;
  }
  const currentVisitor = localStorage.getItem("currentVisitor");
  if (!currentVisitor) {
    console.error("No current visitor set!");
    return;
  }
  
  const visitedKey = currentVisitor + "_visitedAnimals";
  const visitedAnimals = JSON.parse(localStorage.getItem(visitedKey)) || {};

  if (visitedAnimals[animalName]) {
    visitedAnimals[animalName] += 1;
  } else {
    visitedAnimals[animalName] = 1;
  }
  localStorage.setItem(visitedKey, JSON.stringify(visitedAnimals));

  localStorage.setItem("selectedAnimal", JSON.stringify({
      name: selectedAnimal.name,
      image: selectedAnimal.image,
      isPredator: selectedAnimal.isPredator,
      weight: selectedAnimal.weight,
      height: selectedAnimal.height,
      color: selectedAnimal.color,
      habitat: selectedAnimal.habitat,
  }));

  window.location.href = "animal.html";
}

document.addEventListener("DOMContentLoaded", function() {
  populateVisitorDropdown();
  setupFilterListeners();
  renderAvailableAnimals(animals);


  document.getElementById("logout-button").addEventListener("click", function() {
    logout();
  });

  document.getElementById("reset-button").addEventListener("click", function() {
    localStorage.clear();
    window.location.reload();
  });
});
