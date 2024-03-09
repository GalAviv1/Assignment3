//לחצני האכלה
const openButton = document.querySelector("[data-open-modal]")
const closeButton = document.querySelector("[data-close-modal]")
const modal = document.querySelector("[data-modal]")

openButton.addEventListener("click",() => { modal.showModal() })
closeButton.addEventListener("click",() => { modal.close()  })
//רינדורים
function renderAnimal() {
  const selectedAnimalData = localStorage.getItem("selectedAnimal");
  if (!selectedAnimalData) {
      console.error("No animal selected!");
      return;
  }

  const selectedAnimal = JSON.parse(selectedAnimalData);
  if (!selectedAnimal) {
      console.error("Selected animal data is invalid!");
      return;
  }
  //רינדור לחיה הנבחרת ולפרטים שלה
  const imageElement = document.getElementById("image");
  imageElement.innerHTML = ""; //פה ננקה מה שלא צריך
  const animalImage = document.createElement("img");
  animalImage.src = selectedAnimal.image;
  animalImage.alt = selectedAnimal.name;
  imageElement.appendChild(animalImage);

  document.getElementById("name").textContent = selectedAnimal.name;
  document.getElementById("weight").textContent = `Weight: ${selectedAnimal.weight} kg`;
  document.getElementById("height").textContent = `Height: ${selectedAnimal.height} cm`;
  document.getElementById("color").textContent = `Color: ${selectedAnimal.color}`;
  document.getElementById("habitat").textContent = `Habitat: ${selectedAnimal.habitat}`;
  document.getElementById("isPredator").textContent = `Is Predator: ${selectedAnimal.isPredator ? "Yes" : "No"}`;
}

// הפעלת רינדור כאשר האתר נטען
document.addEventListener("DOMContentLoaded", function() {
    renderAnimal();
    renderRelatedAnimals();
    populateVisitorDropdown();

    const currentVisitorName = localStorage.getItem('currentVisitor');

    if (currentVisitorName) {
 
        const visitorsString = localStorage.getItem("visitors");
        const visitors = visitorsString ? JSON.parse(visitorsString) : [];

        const currentVisitor = visitors.find(visitor => visitor.name === currentVisitorName);

        if (currentVisitor && currentVisitor.coins !== undefined) {
            updateVisitorNameAndCoinsInNav(currentVisitorName, currentVisitor.coins);
        } else {
            console.error("Current visitor coins not found!");
        }
    } else {
        console.error("No current visitor set!");
    }
    if (currentVisitor && currentVisitorCoins) {
        updateVisitorNameAndCoinsInNav(currentVisitor, currentVisitorCoins);
        
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
        updateVisitorNameAndCoinsInNav(selectedVisitor.name, selectedVisitor.coins);
      }
    });
    

    const currentVisitor = localStorage.getItem('currentVisitor');
    if (currentVisitor) {
      dropdown.value = currentVisitor;
    }
  }
//עדכון חיות קשורות לפי אזור מחיה
function renderRelatedAnimals() {
    const selectedAnimalData = localStorage.getItem("selectedAnimal");
    if (!selectedAnimalData) {
        console.error("No animal selected!");
        return;
    }

    const selectedAnimal = JSON.parse(selectedAnimalData);
    if (!selectedAnimal) {
        console.error("Selected animal data is invalid!");
        return;
    }

    const relatedAnimals = animals.filter(animal => animal.habitat === selectedAnimal.habitat && animal.name !== selectedAnimal.name);
    const relatedAnimalsContainer = document.getElementById("related-animals");
    relatedAnimalsContainer.innerHTML = ""; 

    relatedAnimals.forEach((animal) => {
        const card = createAnimalCard(animal); 
        card.addEventListener("click", function() {
            visitAnimal(animal.name);
        });
        relatedAnimalsContainer.appendChild(card);
    });


    function createAnimalCard(animal) {
        const card = document.createElement("div");
        card.classList.add("animal-card");
        
        const name = document.createElement("h2");
        name.textContent = animal.name;
        card.appendChild(name);
        
        const detailsList = document.createElement("ul");
        detailsList.innerHTML = 
            `<li>Is Predator: ${animal.isPredator ? "Yes" : "No"}</li>
            <li>Weight: ${animal.weight} kg</li>
            <li>Height: ${animal.height} cm</li>
            <li>Color: ${animal.color}</li>
            <li>Habitat: ${animal.habitat}</li>`
        card.appendChild(detailsList);
        return card;
    }  
    
}
function feedAnimal() {
    console.log("Attempting to feed animal...");
    const currentVisitorName = localStorage.getItem("currentVisitor");
    if (!currentVisitorName) {
        console.error("No current visitor set!");
        return;
    }

    const selectedAnimalData = localStorage.getItem("selectedAnimal");
    if (!selectedAnimalData) {
        console.error("No animal selected!");
        return;
    }

    let selectedAnimal = JSON.parse(selectedAnimalData);
    

    const visitorsString = localStorage.getItem("visitors");
    const visitors = visitorsString ? JSON.parse(visitorsString) : [];
    const currentVisitor = visitors.find(visitor => visitor.name === currentVisitorName);
    if (!currentVisitor) {
        console.error("Current visitor not found in visitors list!");
        return;
    }

    const fedKey = currentVisitorName + "_fedAnimals";
    const fedAnimals = JSON.parse(localStorage.getItem(fedKey)) || [];

    if (!fedAnimals.includes(selectedAnimal.name)) {
        fedAnimals.push(selectedAnimal.name);
        localStorage.setItem(fedKey, JSON.stringify(fedAnimals));
        console.log("Animal added to the fed list.");
    } else {
        console.log("Animal was already in the fed list.");
    }

    console.log(`Visitor coins before feeding: ${currentVisitor.coins}`);


    if (currentVisitor.coins < 2) {
        console.log("You don't have enough coins to feed the animal.");
        return;
    }


    currentVisitor.coins -= 2;
    console.log("Coins deducted for feeding.");


    localStorage.setItem("visitors", JSON.stringify(visitors));


    updateVisitorNameAndCoinsInNav(currentVisitorName, currentVisitor.coins);

    const modal = document.querySelector("[data-modal]");
    if (modal) modal.showModal();
    else console.error("Modal element not found.");
}




function visitorGotEaten() {

    const currentVisitor = localStorage.getItem('currentVisitor');
    const visitors = JSON.parse(localStorage.getItem("visitors"));
    

    const index = visitors.findIndex(visitor => visitor.name === currentVisitor);
    
    if (index !== -1) {
        visitors.splice(index, 1);
        localStorage.setItem("visitors", JSON.stringify(visitors));
    }
    localStorage.removeItem('currentVisitor');
    localStorage.removeItem('currentVisitorCoins');
    window.location.href = "signup.html";
}

function animalEscaped() {

    const selectedAnimalData = localStorage.getItem("selectedAnimal");
    if (!selectedAnimalData) {
        console.error("No animal selected!");
        return;
    }

    let selectedAnimal = JSON.parse(selectedAnimalData);
    

    const index = animals.findIndex(animal => animal.name === selectedAnimal.name);
    if (index !== -1) {
        animals.splice(index, 1);
        localStorage.setItem('animals', JSON.stringify(animals));
    }
    

    window.location.href = "signup.html";
}





 
