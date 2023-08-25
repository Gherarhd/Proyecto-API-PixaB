const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");
const registrosPorPaginas = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
  formulario.addEventListener("submit", validarFormulario);
};

function validarFormulario(e) {
  e.preventDefault();

  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mensajeAlerta("Agrega un termino de búsqueda");

    return;
  }

  buscarImagenes();
}

function mensajeAlerta(mensaje) {
  const existeAlerta = document.querySelector(".bg-red-100");

  if (!existeAlerta) {
    const alerta = document.createElement("P");

    alerta.classList.add(
      "text-center",
      "bg-red-100",
      "text-red-700",
      "border-red-400",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6"
    );
    alerta.innerHTML = ` <strong class='font-bold'>Error!</strong>
  <span class='block'>  ${mensaje} </span>`;
    formulario.appendChild(alerta);
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

function buscarImagenes() {
  const termino = document.querySelector("#termino").value;
  const key = "39022147-1136426b0408e526473737c18";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPaginas}&page=${paginaActual}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      totalPaginas = calcularPaginas(resultado.totalHits);

      mostrarImagenes(resultado.hits);
    });
}
//Generador de paginas

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / registrosPorPaginas));
}

function mostrarImagenes(imagenes) {
  limpiarHTML(resultado);

  //iterar sobre el arreglo de imagenes y crear el html

  imagenes.forEach((imagen) => {
    const { previewURL, likes, views, largeImageURL } = imagen;

    resultado.innerHTML += `

<div class=' w-1/2 md:w-1/3 lg:w-1/4 py-4 px-3'>

    <div class='bg-white'>
    <img class='w-full' src='${previewURL}'>
<div class='p-4'>

<p class='font-bold '> ${likes} <span class='font-light' >- Me gusta</span> </p>
<p class='font-bold '> ${views} <span class='font-light' >- Visitas</span> </p>

<a class='block w-full bg-blue-800 hover:bg-blue-500 text-white font-bold text-center rounded mt-5 p-1 cursor-pointer' href='${largeImageURL}' target="_blank" rel='noopener noreferrer'> Ver imagen</a>
</div>



    </div>
    
    </div>`;
  });
  limpiarHTML(paginacion);
  imprimirPaginador();
}

function imprimirPaginador() {
  iterador = crearPaginador(totalPaginas);

  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    //caso contrario genera lo siguiente.

    const boton = document.createElement("button");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-3",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-4",
      "rounded"
    );

    boton.onclick = () => {
      paginaActual = value;
      buscarImagenes();
    };

    paginacion.appendChild(boton);
  }
}

function limpiarHTML(selector) {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}
