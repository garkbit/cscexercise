const CONN_LIMIT = 3;
const TOTAL_REQUIRED = 22;
const URL = "https://cataas.com/cat?json=true";

let openConnections = 0;
let cats = [];

const fetchCat = () => {
  openConnections++;
  fetch(URL)
    .then(d => d.json())
    .then(cat => {
      openConnections--;
      cats.push(cat);
      if (cats.length + openConnections < TOTAL_REQUIRED) {
        fetchCats();
      }
      if (openConnections === 0) {
        console.log(cats);
      }
    });
}

const fetchCats = () => {
  while (openConnections < CONN_LIMIT) {
    fetchCat();
  }
}

fetchCats();
