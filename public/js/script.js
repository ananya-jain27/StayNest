(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// tax switch
let taxSwitch = document.getElementById("switchCheckDefault");
taxSwitch.addEventListener("click" , () => {
  let taxInfo = document.querySelectorAll(".tax-info");
  for(info of taxInfo){
    if(info.style.display != "inline"){
      info.style.display = "inline";
    }
    else{
      info.style.display = "none";
    }
    
  }
})

// Navbar toggler
let navbarToggler = document.querySelector(".navbar-toggler");
navbarToggler.addEventListener("click" , () => {
  let navbar = document.querySelector(".navbar-collapse");
  if(navbar.style.backgroundColor != "rgba(245, 244, 244, 1)"){
    navbar.style.backgroundColor = "rgba(245, 244, 244, 1)";
    navbar.style.paddingLeft = "1rem";
    navbar.style.paddingRight = "1rem";
  }
  else{
    navbar.style.backgroundColor = "rgb(255, 255, 255)";
  }
});

