let currentCart = JSON.parse(localStorage.getItem("produit"));
console.log(currentCart);

//Fonction d'affichage du panier vide
function emptyCart() {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  const listArticles = document
    .querySelector("#cart__items")
    .appendChild(article);
  listArticles.innerHTML = "<p>Le panier est vide</p>";
}

//Fonction permettant l'affichage, des produits choisis, dans le panier
const cartProductDisplay = async () => {
  if (
    !currentCart ||
    (Array.isArray(currentCart) && currentCart.length === 0)
  ) {
    emptyCart();
  } else {
    let quantityTotals = 0;
    let priceTotals = 0;
    for (let product of currentCart) {
      await fetch("http://localhost:3000/api/products/" + product.id)
        .then(function (res) {
          if (res.ok) {
            return res.json();
          }
        })
        .then((data) => {
          //Création de la balise <article> pour afficher les produits
          const article = document.createElement("article");
          article.classList.add("cart__item");
          article.setAttribute("data-id", product.id);
          article.setAttribute("data-color", product.color);
          const listArticles = document.getElementById("cart__items");
          listArticles.appendChild(article);

          //Sélection de la balise <article> pour afficher les produits

          //Ajout du code HTML permettant l'affichage des produits dans le panier
          article.innerHTML = `
      <div class="cart__item__img">
      <img
          src="${data.imageUrl}"
          alt="${data.alt}"
      />
      </div>
      <div class="cart__item__content">
      <div class="cart__item__content__description">
          <h2>${data.name}</h2>
          <p>${product.color}</p>
          <p>${data.price} €</p>
      </div>
      <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input
              type="number"
              class="itemQuantity"
              name="itemQuantity"
              min="1"
              max="100"
              value=${parseInt(product.quantity)}
          />
          </div>
          <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
          </div>
      </div>
      </div>
      `;
          quantityTotals += parseInt(product.quantity);
          priceTotals += data.price * parseInt(product.quantity);
          document.getElementById("totalQuantity").innerHTML = quantityTotals;
          document.getElementById("totalPrice").innerHTML = priceTotals;
        });
    }
    modifQuantity();
    useBtnSuppr();
  }
};
cartProductDisplay();

// *******************************************************

const totalsProductAndPrice = () => {
  if (currentCart) {
    for (let t = 0; t < currentCart.length; t++) {
      console.log(
        productPriceAndId[currentCart[t].id],
        currentCart[t].quantity
      );
    }
  }
};

// *******************************************************
const displayResults = (quantityTotals, priceTotals) => {
  document.getElementById("totalQuantity").innerHTML = quantityTotals;
  document.getElementById("totalPrice").innerHTML = priceTotals;
};

// *******************************************************

//******Fonction supprimer****** */
function deleteItem(item) {
  //Suppréssion dans le tableau, puis mise à jour du localStorage
  currentCart.splice([item], 1);
  localStorage.setItem("produit", JSON.stringify(currentCart));
  //Confirmation de la suppréssion
  alert("Ce produit a été supprimer du panier");
  window.location.href = "cart.html";
}
//****************************************************************** */

//******Fonction de modification des prix et quantités totaux, après suppréssion */
function cartRefresh(total) {
  let quantityTotals = 0;
  let priceTotals = 0;
  if (currentCart) {
    quantityTotals -= parseInt(currentCart[total].quantity);
    priceTotals -=
      parseInt(currentCart[total].price) *
      parseInt(currentCart[total].quantity);
  }
}
//**************************************************** */

// Fonction pour le changement des quantités et prix des produit
// lors d'un changement de quantité dans le panier
const modifQuantity = () => {
  //******Modification de la quantité et du prix dans le panier */

  //Sélection des balises à modifier
  const formQuantity = document.querySelectorAll(".itemQuantity");

  if (currentCart) {
    let quantityTotals = parseInt(
      document.getElementById("totalQuantity").innerHTML
    );
    let priceTotals = parseInt(document.getElementById("totalPrice").innerHTML);
    let priceProduct = parseInt(
      document.querySelectorAll(
        ".cart__item__content__description p:nth-child(3)"
      )[0].innerHTML
    );
    for (let c = 0; c < currentCart.length; c++) {
      formQuantity[c].addEventListener("change", function () {
        if (formQuantity[c].value > 0) {
          //Modification des totaux + affichage
          let quantityDiff = formQuantity[c].value - currentCart[c].quantity;
          quantityTotals += quantityDiff;
          priceTotals += quantityDiff * priceProduct;
          displayResults(quantityTotals, priceTotals);
          //Ajout des modifications dans le localStorage
          currentCart[c].quantity = formQuantity[c].value;
          localStorage.setItem("produit", JSON.stringify(currentCart));
          //Affichage du nouveau prix du produit
        } else {
          cartRefresh(c);
          displayResults(0, 0);
          deleteItem(c);
        }
      });
    }
  }
};

// ****************************************************************** */

//******Gestion de la suppression d'un produit dans la page panier */

//Fonction pour la supression dans le panier et dans le localStorage,
//du produit selectionné, après avoir appuyé sur le bouton "Supprimer"
const useBtnSuppr = () => {
  if (Array.isArray(currentCart) && currentCart.length > 0) {
    const deleteBtn = document.querySelectorAll(".deleteItem");
    for (let d = 0; d < deleteBtn.length; d++) {
      deleteBtn[d].addEventListener("click", function (e) {
        e.preventDefault;
        //Modification des totaux, prix et quantités
        cartRefresh(d);
        displayResults();
        deleteItem(d);
      });
    }
  }
};

// **************************FORMULAIRE****************************** */
//****************************************************************** */

//******Fonction de validation des champs Nom, prénom, adresse et ville */
const validInput = function (input) {
  let textError = input.nextElementSibling;
  if (input.value.length > 0) {
    textError.innerHTML = "";
    return true;
  } else {
    textError.innerHTML = "Veuillez renseigner ce champ";
    return false;
  }
};

//Variable du champ Prénom
const firstName = document.getElementById("firstName");
firstName.addEventListener("change", function () {
  validInput(firstName);
});

//Variable du champ Nom
const lastName = document.getElementById("lastName");
lastName.addEventListener("change", function () {
  validInput(lastName);
});

//Variable du champ Adresse
const address = document.getElementById("address");
address.addEventListener("change", function () {
  validInput(address);
});

//Variable du champ Ville
const city = document.getElementById("city");
city.addEventListener("change", function () {
  validInput(city);
});

//Ecoute du champ Email
const email = document.getElementById("email");
email.addEventListener("change", function () {
  validEmail(email);
});

//******Fonction de validation du champ email */
const validEmail = (inputEmail) => {
  console.log(inputEmail.value);
  //Création des conditions d'acceptation de l'email
  let emailRegExp = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
  let textError = inputEmail.nextElementSibling;
  if (inputEmail.value.length > 0) {
    if (emailRegExp.test(inputEmail.value)) {
      textError.innerHTML = "";
      return true;
    } else {
      textError.innerHTML = "Format de l'email incorrect. Ex : user@gmail.com";
      return false;
    }
  } else {
    textError.innerHTML = "Veuillez renseigner ce champ";
    return false;
  }
};
//****************************************************************** */

//******Fonction de récupération des id des produits dans le panier */
const idItems = [];
const idItem = () => {
  if (currentCart) {
    for (element of currentCart) {
      idItems.push(element.id);
      console.log(element.id);
    }
  }
};
idItem();
//****************************************************************** */

//Sélection du bouton "Commander !"
const order = document.getElementById("order");

//******Fonction d'envoi du formulaire pour récuperer le numéro de commande */
const sendOrder = () => {
  order.addEventListener("click", function (event) {
    event.preventDefault();
    //Récupération des informations du formulaire
    const contactClient = {
      firstName: firstName.value,
      lastName: lastName.value,
      address: address.value,
      city: city.value,
      email: email.value,
    };
    //Regroupement des informations à envoyer à l'API
    const dataItem = {
      contact: contactClient,
      products: idItems,
    };
    //Vérification si tout le formulaire est correct avant l'envoi
    let formIsOk = true;

    [firstName, lastName, address, city, email].forEach((e) => {
      if (!validInput(e)) formIsOk = false;
    });

    if (formIsOk) {
      try {
        async function urlByPost() {
          console.log(JSON.stringify(dataItem));
          let response = await fetch(
            "http://localhost:3000/api/products/order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataItem),
            }
          );
          let data = await response.json();
          alert("Commande validée");
          localStorage.clear();
          idOrder = data.orderId;
          window.location.href = "./confirmation.html?id-order=" + idOrder;
        }
        urlByPost();
      } catch (err) {
        alert(`${err}`);
      }
    } else {
      alert("Le formulaire est incomplet ou incorrecte");
    }
  });
};
sendOrder();
