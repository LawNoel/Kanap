let params = new URLSearchParams(document.location.search);
let id = params.get("id");
let urlKanap = "http://localhost:3000/api/products/" + id;

fetch(urlKanap)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then((data) => {
    kanapProduct(data);
  })

  .catch(function (err) {
    alert(err);
  });

let kanapProduct = (product) => {
  const imgProduct = document.createElement("img");
  document.getElementsByClassName("item__img")[0].appendChild(imgProduct);
  imgProduct.src = product.imageUrl;
  imgProduct.alt = product.altTxt;

  const titleProduct = document.getElementById("title");
  titleProduct.innerHTML = product.name;

  const priceProduct = document.getElementById("price");
  priceProduct.innerHTML = product.price;

  const descriptionProduct = document.getElementById("description");
  descriptionProduct.innerHTML = product.description;

  product.colors.forEach((color) => {
    const optionColor = document.createElement("option");
    document.getElementById("colors").appendChild(optionColor);
    optionColor.innerHTML = color;
    optionColor.value = color;
  });
};

// ****************** LocalStorage ********************

//Sélection du bouton "Ajouter au panier"
const btnAjoutPanier = document.getElementById("addToCart");

//******Fonction qui envoi les choix du client dans le localStorage*/
const addCart = () => {
  btnAjoutPanier.addEventListener("click", (e) => {
    e.preventDefault();
    //Récupération des données du produit
    const selectColor = document.getElementById("colors");
    const formQuantity = document.getElementById("quantity").value;
    const infoKanap = {
      id: id,
      color: selectColor.value,
      quantity: formQuantity,
    };

    //vérification de la présence d'un produit dans le localStorage
    let currentCart = JSON.parse(localStorage.getItem("produit"));

    //Ajout du produit dans le localStorage
    if (!currentCart) {
      currentCart = [];
      currentCart.push(infoKanap);
      localStorage.setItem("produit", JSON.stringify(currentCart));
    } else {
      //Vérification de la présence ou non de doublon dans le localStorage
      const indice = currentCart.findIndex(
        (kanap) => infoKanap.id == kanap.id && infoKanap.color == kanap.color
      );
      //si oui, incrémenter la quantité du produit existant
      if (indice > -1) {
        currentCart[indice].quantity =
          parseInt(currentCart[indice].quantity) + parseInt(infoKanap.quantity);
        localStorage.setItem("produit", JSON.stringify(currentCart));
        //si non, incrémenter un nouvel objet dans le tableau
      } else {
        currentCart.push(infoKanap);
        localStorage.setItem("produit", JSON.stringify(currentCart));
      }
    }
  });
};
addCart();
