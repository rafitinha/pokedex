String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

//const getImagePokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
//const getImagePokemon = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemon.id}.svg`

const getImagePokemon = id => `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(id).padStart(3, '0')}.png`

const getPokemonUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`

const getPokemonSpeciesUrl = id => `https://pokeapi.co/api/v2/pokemon-species/${id}`

const getIsLegendary = id => {
    return fetch(getPokemonSpeciesUrl(id))
        .then(response => response.json())
        .then(pokemonSpecies => pokemonSpecies.is_legendary)
}


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
                        return { error: response.text() };
                        // throw new Error('Something went wrong');
                    }
                }).then(data => {
                    return getIsLegendary(data.id).then(dataIsLegendary => {
                        return { ...data, isLegendary: dataIsLegendary }
                    }).catch(error => {
                        return "Not Found";
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        );
    })
}


const generateHTML = pokemons => pokemons.reduce((accumulator, pokemon) => {

    if (pokemon instanceof Object) {
        const types = pokemon.types.map(typeInfo => typeInfo.type.name)
        const isLegendary = pokemon.isLegendary ? "isLegendary" : "notLegendary"

        accumulator += `
          <li class="card ${types[0]} ${isLegendary}">
           <img class="card-image" alt="${pokemon.name}" src="${getImagePokemon(pokemon.id)}"/>
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
