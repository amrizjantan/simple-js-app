
let pokemonRepository = (function (){
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=148';
    
   function add(pokemon) {
    pokemonList.push(pokemon);
   }

   function getAll(){
    return pokemonList;
    }

   function addListItem(pokemon){
    let pokemonList = document.querySelector('.pokemon-list');
    let listpokemon = document.createElement('li');
    let button = document.createElement('button');
    button.innerText = pokemon.name;
    button.classList.add('button-class');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
    listpokemon.appendChild(button);
    pokemonList.appendChild(listpokemon);
    button.addEventListener('click', function () {
    showDetails(pokemon);
      });
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
          return response.json();
        }).then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            }; 
            add(pokemon);
            console.log(pokemon);
          });
        }).catch(function (e) {
          console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
          return response.json();
        }).then(function (details) {
          // Now we add the details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.weight = details.weight;
          item.types = details.types;
        }).catch(function (e) {
          console.error(e);
        });
      }

    
function showDetails(pokemon){
   loadDetails(pokemon).then(function()
    {
        showModal(pokemon);  
    });
}

function showModal(pokemon) {
  let modalBody = $('.modal-body');
  let modalTitle = $('.modal-title');
  modalTitle.empty();
  modalBody.empty();

  let nameElement = $('<h1>' + pokemon.name + '</h1>');
  let imageElement = $('<img class="modal-img" style="width:50%">');
  imageElement.attr('src', pokemon.imageUrl);

  let heightElement = $('<p>' + 'Height : ' + pokemon.height + ' m' + '</p>');
  let weightElement = $('<p>' + 'Weight : ' + pokemon.weight + ' kg' + '</p>');
  let typesElement = $(`<p> Type(s) : ${pokemon.types.map(p => p.type.name).join(', ')}</p>`);

  modalTitle.append(nameElement);
  modalBody.append(imageElement);
  modalBody.append(heightElement);
  modalBody.append(weightElement);
  modalBody.append(typesElement);

  $('#exampleModalLive').modal();
}
    return {        
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList:loadList,
        loadDetails:loadDetails,
        showModal: showModal
    };

 })();  

 pokemonRepository.loadList().then(function() {
  document
    .querySelector('.search-pokemon')
    .addEventListener('submit', function(event) {
      event.preventDefault();
      let query = document.querySelector('#myInput').value;
      document.querySelector('.pokemon-list').innerHTML = '';
      if (query === '') {
        pokemonRepository.getAll().forEach(function(pokemon) {
          pokemonRepository.addListItem(pokemon);
        });
      } else {
        pokemonRepository.getAll().forEach(function(pokemon) {
          if (pokemon.name.indexOf(query) > -1) {
            pokemonRepository.addListItem(pokemon);
          }
        });
      }
    });


    pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
    });
})