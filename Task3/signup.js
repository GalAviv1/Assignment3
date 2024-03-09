

function createNewVisitor(event) {
  event.preventDefault();
  
  const name = document.querySelector('input[name="user_name"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const gender = document.querySelector('input[name="gender"]:checked').value;
  
  if (!validateFormInputs(name, email, gender)) {
    return; 
  }
  
  if (visitorExists(name)) {
    alert("you are already a member, try to log in :)");
    return; 
  }
  
  var newVisitor = {
    name: name,
    email: email,
    gender: gender,
    coins: 50 
  };
  
  
  visitors.push(newVisitor);
  
  localStorage.setItem("visitors", JSON.stringify(visitors));
  window.location.href = "/login.html?name=" + name + "&coins=" + newVisitor.coins;
}
  

const createForm = document.getElementById("create-visitor-form");

if (createForm) {
  createForm.addEventListener("submit", createNewVisitor);}
  
  const validateFormInputs = (name, email, gender) => {
    if (!name || !email || !gender) {
      alert("Please fill in all the fields!");
      return false;
    }
    return true;
  }
  
  const visitorExists = (name) => {return visitors.some(visitor => visitor.name === name);}
  
  const makeVisitor = (name) => { 
    if (!visitorExists(name)) {
      const newVisitor = { 
        name: name,
        coins: 50 
      };
      return newVisitor;
    } else {
      return null; 
    }
  }

  
  
  
  /**************************************
   מימשתי עבורכם את ההאזנה לאירוע שליחת טופס
   שימו לב כי האיידי של createForm
   זהה לאיידי של הטופס בעמוד signup.html
   אין לשנות אותו */
   