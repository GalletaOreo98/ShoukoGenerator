// Json Data Inicial
const dataImgJSON = [
    {
        name: "Base",
        src: "assets/data/Base.png",
        options: [{}]
    },
    {
        name: "Book",
        src: "assets/data/books/Python.png",
        options: [
            {
                name: "Python",
                src: "assets/data/books/Python.png"
            },
            {
                name: "Java",
                src: "assets/data/books/Java.png"
            },
            {
                name: "C",
                src: "assets/data/books/C.png"
            },
            {
                name: "Kotlin",
                src: "assets/data/books/Kotlin.png"
            }
        ]
    },
    {
        name: "Hands",
        src: "assets/data/Manos.png",
        options: [{}]
    }
]

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
    // Ajustar canvas a tamaño de imagen real (657x657px)
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
        dataImgArray[1].src = src;
        drawImages([dataImgArray[1]]);
    });
}

// Agregar al HTML
document.body.appendChild(ul);

// Boton para guardar canvas
downloadBtn.addEventListener('click', function () {
    // Obtener la imagen del canvas como una URL de datos
    const imgData = canvas.toDataURL();

    // Crear un elemento a
    const a = document.createElement('a');

    // Asignar la URL de datos como el enlace del elemento a
    a.href = imgData;

    // Asignar un nombre al archivo
    a.download = 'mi-imagen.png';

    // Añadir el elemento a al documento
    document.body.appendChild(a);

    // Hacer clic en el elemento a para descargar la imagen
    a.click();

    // Eliminar el elemento a del documento
    document.body.removeChild(a);
});
