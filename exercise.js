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

const getFilmsForPerson = (person) => {
  let films = [];
  
  person.films.forEach(async (film) => {
    let data = await fetch(film);
    let response = await data.json();
    films.push(response.title);
  });
  
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

  const newPersons = arrPersons.map((person) => {
    person.films = getFilmsForPerson(person);
    return person
  })

  // let arrFimls = [];
  // newPersons.forEach((person, ) => {
  //   console.log(person.films)
  //   arrFimls[index] = person.films;
  // })

  let html = `
    <ul>
      ${newPersons.map((person) => 
        `<li>Name: ${person.name}, Gender: ${person.gender}, Films: ${JSON.stringify(person.films)}</li>`)
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
  console.log(objPersons)
  showPersonsHTML(persons)
})();
