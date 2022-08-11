// https://swapi.dev/api/people/
// 1. Fetch API STAR WARS
// 2. Obtener las personas
// 3. Dividir las personas por genero en un objeto.
// 4. Ordenarlas por orden alfabético
// 5. Mostar el nombre, genero

// OPTIONAL
// 7. Obtener el nombre de todas las peliculas donde participa la persona

let male = [];
let female = [];
let other = [];
let objPersons = {};
const body = document.querySelector("body");

async function getPersonsApi() {
  let data = await fetch("https://swapi.dev/api/people/");
  let response = await data.json();
  return response.results;
}

const getFilmsForPerson = async (person) => {
  let films = [];
  person.films.forEach(async (film) => {
    let data = await fetch(film);
    let response = await data.json();
    // console.log('response: ',response)
    const {title, producer} = response
    // console.log(title,producer)
    person.pelis.push(`peli: ${title}`)
  });
  
  console.log('pelis: ',person.pelis)
  return films;
}

function sortPersons(arrPersons){
  arrPersons.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    } else {
      return -1;
    }
  });
} 

function showPersonsHTML(arrPersons){

  // console.log(arrPersons[0].pelis)
  let html = `
    <ul>
      ${arrPersons.map((person) => 
        `<li>Name: ${person.name}, Gender: ${person.gender}, Films: ${person.pelis}</li>`)
        .join("")}
    </ul>`;

  body.innerHTML = html;
}

function groupPersonsByGender(persons) {
  sortPersons(persons);
  persons.forEach((person) => {
    switch (person.gender) {
      case "male":
        male.push(person);
        break;

      case "female":
        female.push(person);
        break;

      case "n/a":
        other.push(person);
        break;

      default:
        console.log("hemos encontrado otro");
    }
  });
}

(async () => {
  let persons = await getPersonsApi();
  groupPersonsByGender(persons);
  objPersons = {male, female, other}
  let data = [];
  for (const person of persons) {
    person.pelis = [];
    let dataFilms = await getFilmsForPerson(person);
    data.push(dataFilms)
    // person.pelis = Array.prototype.concat.apply([], dataFilms);
    // console.log(dataFilms[0])
    dataFilms.forEach(film => console.log(film))
  }
  let data2 = await Promise.all(data.map(async (film) => {
    return await film[0];
  }))
  // console.log(data2)
  // console.log(persons)
  // showPersonsHTML(persons)
})();
