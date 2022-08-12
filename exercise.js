let male = [];
let female = [];
let other = [];
let objPersons = {};
const body = document.querySelector('body');

function groupBy(xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}

async function fetchAPI(_URL) {
	let data = await fetch(_URL);
	return data.json();
}

async function getPersonsApi() {
	let data = await fetchAPI('https://swapi.dev/api/people/');
	return data.results;
}

const getFilmsForPerson = async (person) => {
	let films = [];

	const personFilms = person.films;
	for (const film of personFilms) {
		let data = await fetch(film);
		let response = await data.json();
		films.push(response.title);
	}

	return films;
};

function sortPersons(arrPersons) {
	arrPersons.sort((a, b) => {
		return a.name > b.name ? 1 : -1;
	});
}

async function showPersonsHTML(arrPersons) {
	const newPersons = await Promise.all(
		arrPersons.map(async (person) => {
			person.films = await getFilmsForPerson(person);
			return person;
		})
	);

	let html = `
    <ul>
      ${newPersons
				.map(
					(person) =>
						`<li>Name: ${person.name}
						<br/>Gender: ${person.gender}
						<br/>Films: ${person.films.join(", ")}</li>
						<br/>`
				)
				.join('')}
    </ul>`;

	body.innerHTML = html;
}

function groupPersonsByGender(persons) {
	sortPersons(persons);
	return groupBy(persons, 'gender');
}

(async () => {
	let persons = await getPersonsApi();
	groupPersonsByGender(persons);
	objPersons = { male, female, other };
	console.log(objPersons);
	showPersonsHTML(persons);
})();
