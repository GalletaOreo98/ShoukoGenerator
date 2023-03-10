// Json Data Inicial
const dataImgJSON = [];

async function loadJSON() {
  const response = await fetch('assets/data/json/Shouko_Komi.json'); 
  const data = await response.json();
  dataImgJSON.push(...data);
}

//Cargar data JSON
loadJSON().then(() => {
//Run main una vez cargado el .json
// Obtén una referencia al canvas y al contexto de dibujo
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const downloadBtn = document.getElementById('download-btn');

// Ajustar el tamaño del canvas al % del ancho y al % del alto de la pantalla
const isMobile = window.matchMedia('(max-width: 768px)').matches;

if (isMobile) {
    // Ajustar el tamaño del canvas al % del ancho y al % del alto de la pantalla en dispositivos móviles
    canvas.width = window.innerWidth * 0.85;
    canvas.height = canvas.width;
} else {
    // Ajustar canvas a tamaño para pc
    canvas.width = window.innerWidth * 0.40;
    canvas.height = canvas.width;
}



// Array-data de la imagen y sus partes
let dataImgArray = [];

dataImgJSON.forEach((element, i) => {
    const img = new Image();
    img.src = element.src;
    img.alt = element.name;
    dataImgArray.push(img);
});


async function drawImages(UpdatedArray) {
    await Promise.all(UpdatedArray.map(img => new Promise(resolve => img.onload = resolve)));
    dataImgArray.forEach(element => {
        ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
    });
}

// async function redrawImages(UpdatedArray) {
//     return new Promise(resolve => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       UpdatedArray.forEach(element => {
//         ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
//       });
//       resolve();
//     });
// }

// Pintar imagenes de inicio
drawImages(dataImgArray);


// Listado de opciones de la imagen
const ul = document.createElement('ul');

for (const item of dataImgJSON) {

    const select = document.createElement('select');
    select.id = item.name;

    const label = document.createElement('label');
    label.textContent = item.name + ":";
    label.htmlFor = item.name;

    ul.appendChild(label);
    ul.appendChild(select);

    for (const itemj of item.options) {
        const option = document.createElement('option');
        option.textContent = itemj.name;
        option.value = itemj.src;
        select.appendChild(option);
    }

    select.addEventListener('change', function () {
        const src = this.value;
        dataImgArray[item.layer].src = src;
        drawImages([dataImgArray[item.layer]]);
    });
}

document.body.appendChild(ul);

// Boton para descargar imagen del canvas
downloadBtn.addEventListener('click', async function () {
    // Crear el canvas que dibujará la imagen en tamaño original al momento de descargar
    const canvasToDownload = document.createElement('canvas');
    // Asignar ancho y alto al canvas nuevo (imagen base por defecto 657px) para la descarga solamente
    canvasToDownload.width = 657;
    canvasToDownload.height = 657;
    
    await drawImagesToDownload(dataImgArray, canvasToDownload);

    // Obtener la imagen del canvas como una URL de datos
    const imgData = canvasToDownload.toDataURL();

    // Crear un elemento a
    const a = document.createElement('a');

    // Asignar la URL de datos como el enlace del elemento a
    a.href = imgData;

    // Asignar un nombre al archivo
    a.download = 'my-shouko.png';

    // Añadir el elemento a al documento
    document.body.appendChild(a);

    // Hacer clic en el elemento a para descargar la imagen
    a.click();

    // Eliminar el elemento a del documento
    document.body.removeChild(a);
});

async function drawImagesToDownload(UpdatedArray, canvas) {
    const ctxToDownload = canvas.getContext('2d');
    return new Promise(resolve => {
      UpdatedArray.forEach(element => {
        ctxToDownload.drawImage(element, 0, 0, canvas.width, canvas.height);
      });
      resolve();
    });
}

});

