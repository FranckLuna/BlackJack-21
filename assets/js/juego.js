/**
 * 2C = CLUBD
 * 2D = DIAMONDS
 * 2H = HEARTS
 * 2S = SPADES
 */

(() => {
    'use stric'

    let deck = [], //baraja
        tipos = ['C', 'D', 'H', 'S'], //tipos de carta 
        especiales = ['A','J','Q','K']; //tipos de cartas especiales

    let puntosJugadores = [];

// REFERENCIAS HTML
const btnPedir = document.querySelector("#btnPedir"),
      btnDetener = document.querySelector('#btnDetener'),
      btnNuevo = document.querySelector('#btnNuevo');
const divCartasJugadores = document.querySelectorAll('.divCartas'),
      puntosHtml = document.querySelectorAll('small');
const divMonedas = document.getElementById('monedas-apostadas');
const fichas = document.querySelectorAll('.monedas');
const totalSpan = document.getElementById('total');
const btnBorrar = document.getElementById('btnBorrar');
const dineroGanado = document.getElementById('dinero-ganado');
let dinero = 250;
dineroGanado.textContent = dinero;
let total = 0;

// inicia el juego
const inicializarJuego = ( numJugadores = 2 ) => {
    deck = craerDeck();
    
    puntosJugadores = [];

    for (let i = 0; i < numJugadores; i++){
        puntosJugadores.push(0);
    }
    
    puntosHtml.forEach( elem => elem.innerText = 0 );
    divCartasJugadores.forEach( elem => elem.innerHTML = '');

    if(total != 0){
        btnPedir.disabled = false;
        btnDetener.disabled = false;
    }
}

//funcion para crear la baraja
const craerDeck = () =>{
    //el primer for es para el numero de carta ej. 2
    for(let i = 2; i <= 10; i++){
        //segundo for para el tipo de carta ej H
        for(let tipo of tipos){
            //se agrega el numero de carta y el tipo ej 2H = 2 de corazon
            deck.push(i + tipo);
        }
    }
    //for para crear tipo de carta especial ej JC = J pika
    for(let tipo of tipos){
        for(esp of especiales){
            deck.push(esp + tipo);
        }
    }
    // al arreglo lo mezclamos utilizando la libreria nueva, nos devuleve el arreglo mezclado
    return _.shuffle(deck);
}

//funcion pedir carta
const pedirCarta = () => {
    if(deck.length === 0){
        throw 'No hay cartas en la baraja'
    }
    return deck.pop(); // SACA LA ULTTMA CARTA DEL ARREGLO Y LA DEVUELVE
}

// EXTRAE EL VALOR DE LA CARTA DEL ARREGLO Y LA SUMA 
const valorCarta = ( carta ) => {
    let valor = carta.substring(0, carta.length - 1); // SACAMOS SOLO LA PARTE QUE CONTIENE EL N°
    
    return ( isNaN( valor )) ? // SI ES UN NUMERO LO REGRESA
            ( valor === 'A' ) ? 11 : 10 // SI ES UNA LETRA REGRESA 10 U 11 SI ES A
        :   valor * 1;    // LOS MULTIPLICAMOS POR 1 PARA CONVERTIRLO EN NUMERO
}

//Turno 0 al primero jugador ulitmo la computadora
const acumularPuntos =  ( carta, turno ) =>{
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);   
    puntosHtml[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
}

const crearCarta = (carta, turno) =>{
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/img/cartas/${ carta }.png`;
    imgCarta.classList.add('carta');
    divCartasJugadores[turno].append(imgCarta);
}

const crearFicha = (nombreFicha) => {
  const imgFicha = document.createElement('img');
  imgFicha.src = `assets/img/fichas/${nombreFicha}.png`;
  imgFicha.classList.add('ficha-apostada');

  // Tamaño del contenedor
  const contenedorWidth = divMonedas.clientWidth;
  const contenedorHeight = divMonedas.clientHeight;

  // Tamaño de la ficha
  const fichaWidth = 40;
  const fichaHeight = 40;

  // Coordenadas aleatorias dentro del contenedor
  const x = Math.random() * (contenedorWidth - fichaWidth);
  const y = Math.random() * (contenedorHeight - fichaHeight);

  imgFicha.style.left = `${x}px`;
  imgFicha.style.top = `${y}px`;

  divMonedas.appendChild(imgFicha);
}

// Determinar ganador y dar o quitar puntos
const determinarGanador = () => {
  const [puntosJugador, puntosComputadora] = puntosJugadores;

  setTimeout(() => {
    if (puntosJugador > 21) {

      alert('Te pasaste de 21. Perdiste');
      disminuirDinero();

    } else if (puntosComputadora > 21) {

      alert('¡Ganaste!');
      acumularDinero();
   
    } else if (puntosJugador === puntosComputadora) {
      alert('Empate');
    } else if (puntosJugador > puntosComputadora) {

      alert('¡Ganaste!');
      acumularDinero();

    } else {
      alert('Perdiste');
      disminuirDinero();
    }

    inicializarJuego();
    habilitarFichas();
    btnNuevo.disabled = true;
    btnBorrar.disabled = false;
  }, 500);
};


// TURNO COMPUTADORA
const turnoComutadora = ( puntosMinimos ) =>{ //RECIBE COMO ARGUMENTO EL PUNTO DEL JUGADOR
    let puntosComputadora = 0;
    do {
        //MISMA LOGICA QUE EL TURNO DEL JUGADOR
        const carta = pedirCarta();
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
        crearCarta(carta, puntosJugadores.length - 1);

        //SI EL PUNTAJE DEL JUGADOR ES MAYOR A 21 SALIMOS DEL CICLO
        if(puntosMinimos > 21){
            break;
        }
        // MIENTRAS EL PUNTAJE DE LA COMPU SEA MENOR
    } while ( (puntosComputadora < puntosMinimos) && puntosMinimos <= 21 );

    determinarGanador();
};

                        //EVENTOS
//BOTON PEDIR CARTA 
btnPedir.addEventListener('click', () => {
    // PEDIMOS UNA CARTA Y LA GUARDAMOS
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);
    crearCarta(carta, 0);

    if( puntosJugador > 21){
        console.warn('Perdiste');
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComutadora(puntosJugador);

    } else if( puntosJugador === 21 ){

        console.warn('21 !!! Ganaste');
        btnPedir.disabled = true;
        btnDetener.disabled = true;

        turnoComutadora(puntosJugadores);
    }
});

// BOTON DETENER
btnDetener.addEventListener('click', () =>{
    //DESHABILITAMOS LOS BOTONES
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    // SE LLAMA AL TURNO DE LA COMPU
    turnoComutadora( puntosJugadores[0] );
});

// BOTON PEDRI CARTA JUEGO
btnNuevo.addEventListener('click', () =>{
    if(total > 0 ){

        inicializarJuego();
        deshabilitarFichas();

        btnNuevo.disabled = true;
        btnBorrar.disabled = true;

    } else{
        alert('El total apostado no debe ser 0')
    }
});
// BOTON FICHAS
fichas.forEach(ficha => {
  ficha.addEventListener('click', (e) => {
    const valor = parseInt(e.target.dataset.valor);
    const nombreFicha = e.target.dataset.img;
    const actual = parseInt(dineroGanado.textContent);

    total += valor;
    totalSpan.textContent = total;
    
    if(total > 1){
        btnNuevo.disabled = false;

        if(total > actual){
            btnNuevo.disabled = true;
        }
    }

    crearFicha(nombreFicha);

    // Efecto visual
    e.target.classList.add('monedas_hover');
    setTimeout(() => {
      e.target.classList.remove('monedas_hover');
    }, 200);
  });
});

// Acumular dinero
const acumularDinero = () => {
    const actual = parseInt(dineroGanado.textContent);
    dineroGanado.textContent = actual + total;
    // Reiniciamos la apuesta
    total = 0;
    totalSpan.textContent = '0';
    divMonedas.innerHTML = '';
};

const disminuirDinero = () => {
    const actual = parseInt(dineroGanado.textContent);
    dineroGanado.textContent = actual - total;
    // Reiniciamos la apuesta
    total = 0;
    totalSpan.textContent = '0';
    divMonedas.innerHTML = '';
};

// boton para elimnar las fichas apostadas
btnBorrar.addEventListener('click', () => {
    divMonedas.innerHTML = '';   
    total = 0;                  
    totalSpan.textContent = '0';
    btnNuevo.disabled = true;
});

// Deshabilitar los inputs
const deshabilitarFichas = () => {
  document.querySelectorAll('.monedas').forEach(ficha => {
    ficha.disabled = true;
  });
};

// Habilitar los inputs
const habilitarFichas = () => {
  document.querySelectorAll('.monedas').forEach(ficha => {
    ficha.disabled = false;
  });
};

})();