String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

//String(n).padStart(4, '0'); --> ES2017 Update

//const getImagePokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`


const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const getPokemonSpeciesUrl = id => `https://pokeapi.co/api/v2/pokemon-species/${id}`


const generatePokemonPromises = () => Array(126).fill().map((_, index) =>
    fetch(getPokemonUrl(index + 1)).then(response => response.json()));


const generatePokemonCount = () => {
    return fetch(getPokemonUrl(''))
        .then(response => response.json())
        .then(pokemon => pokemon.count)
}

const generatePokemonPromisesList = () => {
    return generatePokemonCount().then(count => {
        return Array(count).fill().map((_, index) =>
            fetch(getPokemonUrl(index + 1))
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        return response.text();
                        // throw new Error('Something went wrong');
                    }
                }).catch(error => {
                    console.error(error)
                })
        );
    })
}


const generateHTML = pokemons => pokemons.reduce((accumulator, pokemon) => {

    if (pokemon instanceof Object) {
        const types = pokemon.types.map(typeInfo => typeInfo.type.name)

        accumulator += `
          <li class="card ${types[0]}">
           <img class="card-image" alt="${pokemon.name}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg"/>
           <h2 class="card-title">${pokemon.id}. ${pokemon.name}</h2>
           <p class="card-subtitle">${types.join(' | ')}</p>
          </li >
        `
    }
    return accumulator;


}, '')

const insertPokemonsIntoPage = pokemos => {
    const ul = document.querySelector('[data-js="pokedex"]')
    ul.innerHTML = pokemos
}

const fetchPokemon = () => {

    generatePokemonPromisesList().then(function (pokemonPromises) {
        Promise.all(pokemonPromises)
            .then(generateHTML)
            .then(insertPokemonsIntoPage)
    });


}


//fetchPokemon()
