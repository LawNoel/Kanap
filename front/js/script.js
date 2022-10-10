// ***** Fonction permettant de créer les variables contenant les balises de description des produits *****

let createKanap = (product) => {
  // ***** Création de la balise <a> *****
  const link = document.createElement("a");
  // ***** On rattache la balise <a> à son élément parent *****
  document.getElementById("items").appendChild(link);
  // ***** Création d'un lien via l'id du produit *****
  link.href = "./product.html?id=" + product._id;

  const myArticle = document.createElement("article");
  link.appendChild(myArticle);

  const myImg = document.createElement("img");
  myArticle.appendChild(myImg);
  myImg.src = product.imageUrl;
  myImg.alt = product.altTxt;

  const myH3 = document.createElement("h3");
  myArticle.appendChild(myH3);
  myH3.classList.add("productName");
  myH3.innerHTML = product.name;

  const myP = document.createElement("p");
  myArticle.appendChild(myP);
  myP.classList.add("productDescription");
  myP.innerHTML = product.description;
};

// ***** Récupération des données de l'API avec fetch *****

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })

  .then((data) => {
    // ***** Boucle générant les produits Kanap *****
    data.forEach((element) => {
      createKanap(element);
    });
  })

  .catch(function (err) {
    alert(err);
  });
