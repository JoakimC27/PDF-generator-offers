let datosJSON = [];
let seleccionadosx4 = [];
let seleccionadosA4 = [];
const {jsPDF} = window.jspdf;
const A4PDF = new jsPDF({format:"a4"});
const x4PDF = new jsPDF({format:"a4"});
function renderizado(){
    document.getElementById('fileInput').addEventListener('change', function(e){
        const archivo = e.target.files[0];
        const lector = new FileReader();
        lector.readAsArrayBuffer(archivo);      
        lector.onload = function(e){
            const datos = new Uint8Array(e.target.result);
            const workbook = XLSX.read(datos, {type: 'array'});
            const nombreHoja = workbook.SheetNames[0];
            const hoja = workbook.Sheets[nombreHoja];
            datosJSON = XLSX.utils.sheet_to_json(hoja, {header:1});
            let html = "<table border='1'>";
            const encabezados = datosJSON[0];
            html += "<thead><tr>";
            encabezados.forEach(titulo =>{
                html += `<th>${titulo ?? ''}</th></th>`;
            });
            html += `<th>A4</th>`;
            html += `<th>x4</th>`;
            html += "</tr></thead>";
            for (let i = 1; i < datosJSON.length; i++){
                html += "<tr>";
                datosJSON[i].forEach(celda =>{
                    html += `<td>${celda ?? ''}</td>`;
                });
                html += `<td><input type="checkbox" class='seleccionA4' value='A4' data-index="${i}"></td>`;
                html += `<td><input type="checkbox" class='seleccionx4' value='x4' data-index="${i}"></td>`;
                html += "</tr>";
            }
            html += "</table>";
            document.getElementById("output").innerHTML = html;
            console.log(datosJSON);
            document.getElementById('leer').style.display = "none";
            document.getElementById('generar').style.display ="block";
        }
    })  
}

function seleccionarArticulo(){
    const checkboxesA4 = document.querySelectorAll(".seleccionA4");
    const checkboxesx4 = document.querySelectorAll(".seleccionx4");
    checkboxesA4.forEach(cb =>{
        if (cb.checked){
            const index = parseInt(cb.dataset.index);
            seleccionadosA4.push(datosJSON[index]);
        }
    });
    checkboxesx4.forEach(cb =>{
        if (cb.checked){
            const index = parseInt(cb.dataset.index);
            seleccionadosx4.push(datosJSON[index]);
        };
    });
    console.log("SeleccionadosA4:", seleccionadosA4);
    console.log("Seleccionadosx4;", seleccionadosx4);
    const A4Flat = seleccionadosA4.flat();
    console.log(A4Flat);
    for(let i = 0; i<A4Flat.length;){
        A4PDF.setFillColor(0,0,0);
        A4PDF.setLineWidth(1);
        A4PDF.rect(30,215,150,38, "FD");
        A4PDF.setFillColor(225,225,225);
        A4PDF.setLineWidth(1);
        A4PDF.rect(30, 175, 150, 38, "S" )
        A4PDF.setFontSize(30);
        A4PDF.setFont("normal", "bold");
        A4PDF.setTextColor(0,0,0);
        A4PDF.text("PRECIO", 35, 193);
        A4PDF.text("PLUS",35,203);
        A4PDF.setTextColor(255,255,255);
        A4PDF.text("12", 52, 233);
        A4PDF.text("CUOTAS", 35,243);
        A4PDF.line(93,175,93,213);
        A4PDF.setDrawColor(255,255,255);
        A4PDF.line(93,214,93,260);
        A4PDF.setTextColor(0,0,0);
        A4PDF.setDrawColor(0,0,0);
        A4PDF.setFontSize(15);
        A4PDF.setTextColor(0,0,0);
        A4PDF.text(String("Estadistico: " + A4Flat[i]), 30, 173);
        i++
        A4PDF.setFontSize(40);
        let texto = String(A4Flat[i]);
        let y;
        if(texto.length <= 40){
            y = 100;
        }else{y = 65};
        const maxChars = 13;
        const pageWidth = A4PDF.internal.pageSize.getWidth();
        while (texto.length > 0) {
            let corte = texto.slice(0, maxChars);
            let ultimoEspacio = corte.lastIndexOf(" ");
            if (ultimoEspacio !== -1 && texto.length > maxChars) {
                corte = texto.slice(0, ultimoEspacio);
            }
            const textWidth = A4PDF.getTextWidth(corte.trim());
            const x = (pageWidth - textWidth) / 2;
            A4PDF.text(corte.trim(), x, y);
            texto = texto.slice(corte.length).trim();
            y +=15;
        }
        i++
        A4PDF.setFontSize(15);
        if(A4Flat[i+2] == "$"){
            A4PDF.setLineWidth(0.8);
            A4PDF.setDrawColor(0,0,0);
            A4PDF.line(181,170,167,173);
            A4PDF.setFontSize(15);
            A4PDF.text("Precio Regular:   " + A4Flat[i], 130,173);
            A4PDF.setFontSize(10);
            A4PDF.text("$",168,173);
        }
        if(A4Flat[i+2] == "USD"){
            A4PDF.setLineWidth(0.8);
            A4PDF.setDrawColor(0,0,0);
            A4PDF.line(181,170,164,173);
            A4PDF.setFontSize(15);
            A4PDF.text("Precio Regular:      " + A4Flat[i], 127,173);
            A4PDF.setFontSize(10);
            A4PDF.text("USD",164,173);
        }
        i++
        let entero = String(A4Flat[i]).split(/[.,]/)[0];
        let resta = entero - A4Flat[i];
        if(resta < 0.5 && resta !==0){
            entero = parseInt(entero) + 1;
        }
        if(parseInt(entero) <= 99){
            A4PDF.setFontSize(100);
            A4PDF.text(entero, 130, 207);
        }
        if(parseInt(entero) > 99 && parseInt(A4Flat[i]) < 1000){
            A4PDF.setFontSize(100);
            A4PDF.text(String(entero), 125,207);
        }
        if(parseInt(entero) >= 1000){
            A4PDF.setFontSize(90);
            A4PDF.text(String(entero), 115,207);
        }
        A4PDF.setTextColor(0,0,0);
        if(parseInt(entero) <= 99){
            A4PDF.setFontSize(100);
            A4PDF.text(String(entero), 130, 207);
        }
        if(parseInt(entero) > 99 && parseInt(A4Flat[i]) < 1000){
            A4PDF.setFontSize(100);
            A4PDF.text(String(entero), 125,207);
        }
        if(parseInt(entero) >= 1000){
            A4PDF.setFontSize(90);
            A4PDF.text(String(entero), 115,207);
        }
        let cuotas = entero / 12;
        let cuotasP = String(cuotas).split(/[.,]/)[0];
        if(parseInt(cuotasP) <= 999){
            
        }
        let parte = String(cuotas).split(/[.,]/);
        let decimal = parte[1] || "0";
        decimal = decimal.padEnd(4,"0");
        let primeros = decimal.slice(0,2);
        console.log(primeros);
        let siguientes = decimal.slice(2,4);
        if(parseInt(siguientes) > 46){
            primeros ++
            primeros = String(primeros).padStart(1, "0");
            console.log(primeros);
        }
        A4PDF.setTextColor(255,255,255);
        parte = parseInt(parte);
        if(A4Flat[i+1] == "USD"){
            if(parte <=9){
                A4PDF.text(String(parseInt(parte)) + ".", 132,247);
                A4PDF.setFontSize(70);
                A4PDF.text(String(primeros),155,234);
                A4PDF.setFontSize(40);
                A4PDF.text(A4Flat[i+1],98,247);
            }
            console.log(parte);
            if( parte >= 10 && parte < 100){
                A4PDF.setFontSize(100);
                A4PDF.text(String(parte) + ".",115,247);
                A4PDF.setFontSize(70)
                A4PDF.text(String(primeros),155,234);
                A4PDF.setFontSize(20);
                A4PDF.text(A4Flat[i+1], 100,247);
            }
            if(parte >= 100){
                A4PDF.setFontSize(95);
                A4PDF.text(String(parte) + ".",107,247);
                A4PDF.setFontSize(50)
                A4PDF.text(String(primeros),160,230);
                A4PDF.setFontSize(20);
                A4PDF.text(A4Flat[i+1], 95,247);
            }
        } 
        if(A4Flat[i+1] == "$"){
            if(parte <=9){
                A4PDF.text(String(parseInt(parte)) + ".", 132,247);
                A4PDF.setFontSize(70);
                A4PDF.text(String(primeros),155,234);
                A4PDF.setFontSize(60);
                A4PDF.text(A4Flat[i+1],113,247);
            }
            console.log(parte);
            if( parte >= 10 && parte < 100){
                A4PDF.setFontSize(100);
                A4PDF.text(String(parte) + ".",115,247);
                A4PDF.setFontSize(70)
                A4PDF.text(String(primeros),155,234);
                A4PDF.setFontSize(50);
                A4PDF.text(A4Flat[i+1], 105,247);
            }
            if(parte >= 100){
                A4PDF.setFontSize(95);
                A4PDF.text(String(parte) + ".",107,247);
                A4PDF.setFontSize(50)
                A4PDF.text(String(primeros),160,230);
                A4PDF.setFontSize(50);
                A4PDF.text(A4Flat[i+1],98,247);
            }
        }
        i++
        if(A4Flat[i] == "USD"){
            if(A4Flat[i-1] < 99){
                A4PDF.setFontSize(40);
                A4PDF.setTextColor(0,0,0);
                A4PDF.text(A4Flat[i],98, 207); 
            }
            if(A4Flat[i-1] <=999){
                A4PDF.setFontSize(40);
                A4PDF.setTextColor(0,0,0);
                A4PDF.text(A4Flat[i],98, 207)
            }
            if(A4Flat[i-1] > 999){
                A4PDF.setFontSize(25);
                A4PDF.setTextColor(0,0,0);
                A4PDF.text(A4Flat[i],98,207)    
            }
        }
        if(A4Flat[i] == "$"){
            A4PDF.setFontSize(60);
            A4PDF.setTextColor(0,0,0);
            A4PDF.text(A4Flat[i],105, 207)
        }        
        if(A4Flat[i] == "$"){
            A4PDF.setFontSize(60);
            A4PDF.setTextColor(0,0,0);
            A4PDF.text(A4Flat[i],105, 207)
        }
        A4PDF.addPage("a4");
        i++
    }
    const x4Flat = seleccionadosx4.flat();
    console.log(x4Flat[0]);
    console.log(x4Flat[5]);
    for(let i = 0; i<x4Flat.length;){
        //DIseño PDF x4
        x4PDF.setFillColor(0,0,0);
        x4PDF.setDrawColor(0,0,0);
        x4PDF.setLineWidth(0.5);
        x4PDF.line(105,0,105,297);
        x4PDF.line(0,148.5,210,148.5);
        x4PDF.rect(32,87,65,18); //cuadrado 1
        x4PDF.line(48,87,48,105) //linea 1
        x4PDF.rect(112,87,65,18); //cuadrado 2
        x4PDF.line(128,87,128,105) //linea 2
        x4PDF.rect(32,210,65,18); //cuadrado 3
        x4PDF.line(48,210,48,228); //linea 3
        x4PDF.rect(112,210,65,18); //cuadrado 4
        x4PDF.line(128,210,128,228); //linea 4
        x4PDF.rect(32,107,65,18,"FD"); //cuadradoNegro 1
        x4PDF.rect(112,107,65,18,"FD"); //cuadradoNegro 2
        x4PDF.rect(32,230,65,18, "FD"); //cuadradoNegro 3
        x4PDF.rect(112,230,65,18,"FD");//cuadradoNegro 4
        x4PDF.setDrawColor(255,255,255);
        x4PDF.line(48,107,48,125); //lineaBlanca 1
        x4PDF.line(128,107,128,125); //lineBlanca 2
        x4PDF.line(48,230,48,248); //lineaBlanca 3
        x4PDF.line(128,230,128,248);// lineaBlanca 4
        //Texto PRECIO
        x4PDF.setFontSize(10)
        x4PDF.setFont("helvetica","bold");
        x4PDF.text("PRECIO",33.5,95); //1
        x4PDF.text("PRECIO",113.5,95);//2
        x4PDF.text("PRECIO",33.5,218);//3
        x4PDF.text("PRECIO",113.5,218);//4
        //Texto OFERTA
        x4PDF.text("OFERTA",33,100);//1
        x4PDF.text("OFERTA",113,100);//2
        x4PDF.text("OFERTA",33,223);//3
        x4PDF.text("OFERTA",113,223);//4
        //Texto 12
        x4PDF.setFontSize(20);
        x4PDF.setTextColor(255,255,255);
        x4PDF.text("12",35.5,117);//1
        x4PDF.text("12",115.5,117);//2
        x4PDF.text("12",35.5,240);//3
        x4PDF.text("12",115.5,240);//4
        //Texto CUOTAS
        x4PDF.setFontSize(10);
        x4PDF.text("CUOTAS",32.5,121);//1
        x4PDF.text("CUOTAS",112.5,121);//2
        x4PDF.text("CUOTAS",32.5,244);//3
        x4PDF.text("CUOTAS",112.5,244);//4
        //Estadistico articulo 1
        x4PDF.setTextColor(0,0,0);
        x4PDF.setFontSize(5);
        x4PDF.text(String("Estadistico: " + x4Flat[i]), 32, 86);
        i++ //Descirpcion arituculo 1
        x4PDF.setFont("helvetica","bold");
        x4PDF.setFontSize(15);
        let texto1 = String(x4Flat[i]);
        const maxChars1 = 13;
        const lineas1 = [];
        while (texto1.length > 0) {
                let corte = texto1.slice(0, maxChars1);
            let ultimoEspacio = corte.lastIndexOf(" ");
            if (ultimoEspacio !== -1 && texto1.length > maxChars1) {
                corte = texto1.slice(0, ultimoEspacio);
            } else {
                corte = texto1.slice(0, maxChars1);
            }
            lineas1.push(corte.trim());
            texto1 = texto1.slice(corte.length).trim();
        }
        const spacing1 = 5;
        let y1;
        let x1;
        if (lineas1.length === 1 && lineas1[0].length <= 15) {
            y1 = 60;
            x1 = 55;
        } else {
            y1 = 50;
            x1 = 45;
        }
        for (let j = 0; j < lineas1.length; j++) {
            x4PDF.text(lineas1[j], x1, y1);
            y1 += spacing1;
        }
        x4PDF.setFont("helvetica","normal");        
        i++ // Regular articulo 1
        x4PDF.setFontSize(5);
        if(x4Flat[i+2] == "$"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(92,86,98,84.5);
            x4PDF.text("Precio Regular:    " + x4Flat[i], 79,86);
            x4PDF.setFontSize(3.5);
            x4PDF.text("$", 92,86);
        }else{
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(92,86,98,84.5);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 77,86);
            x4PDF.setFontSize(3.5);
            x4PDF.text("USD", 90,86);
        }
        i++ //Oferta articulo 1
        x4PDF.setTextColor(0,0,0);
        let entero = String(x4Flat[i]).split(/[.,]/)[0];
        let resta = entero - x4Flat[i];
        console.log(entero);
        if(resta < 0.5 && resta !== 0){
            entero = parseInt(entero) + 1;
        }
        if(parseInt(entero) <= 99){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero), 70,103);
        }
        if(parseInt(entero) > 99 && parseInt(x4Flat[i]) < 1000){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero), 65,103);
        }
        if(parseInt(entero) >= 1000){
            
            x4PDF.setFontSize(40);
            x4PDF.text(String(entero), 61,102);
        }

        let cuotas = entero / 12;
        let cuotasP = String(cuotas).split(/[.,]/)[0];
        if(parseInt(cuotasP) <= 999){
            
        }
        let parte = String(cuotas).split(/[.,]/);
        let decimal = parte[1] || "0";
        decimal = decimal.padEnd(4,"0");
        let primeros = decimal.slice(0,2);
        console.log(primeros);
        let siguientes = decimal.slice(2,4);
        if(parseInt(siguientes) > 46){
            primeros ++
            primeros = String(primeros).padStart(1, "0");
            console.log(primeros);
        }
        x4PDF.setTextColor(255,255,255);
        parte = parseInt(parte);
        if(x4Flat[i+1] == "USD"){
            if(parte <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte)) + ".", 74,123);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],55,123);
            }
            if( parte >= 10 && parte < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte) + ".",67,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(22);
                x4PDF.text(x4Flat[i+1], 49,123);
            }
            if(parte >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte) + ".",60,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1], 49,123);
            }
        }
        if(x4Flat[i+1] == "$"){
            if(parte <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte)) + ".", 74,123);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],68,123);
            }
            console.log(parte);
            if( parte >= 10 && parte < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte) + ".",65,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1], 60,123);
            }
            if(parte >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte) + ".",60,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros),87,115);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1],55,123);
            }
        }
        i++ // Moneda articulo 1
        x4PDF.setTextColor(0,0,0);
        if(x4Flat[i] == "USD"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i],53,103);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 49,103);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(15);
                x4PDF.text(x4Flat[i],51,102);
            }
        }
        if(x4Flat[i] =="$"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],65,102);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],60,102);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i], 55,102);
            }
        }
        i++ // Codigo articulo 2
        console.log(x4Flat[i]);
        x4PDF.setFontSize(5);        
        x4PDF.text(String("Estadistico: " + x4Flat[i]), 112,86);
        i++ // Detalle articulo 2
        x4PDF.setFontSize(15);
        x4PDF.setFont("helvetica","bold");
        let texto2 = String(x4Flat[i]);
        const maxChars2 = 13;
        const lineas2 = [];
        while (texto2.length > 0) {
                let corte = texto2.slice(0, maxChars2);
            let ultimoEspacio = corte.lastIndexOf(" ");
            if (ultimoEspacio !== -1 && texto2.length > maxChars2) {
                corte = texto2.slice(0, ultimoEspacio);
            } else {
                corte = texto2.slice(0, maxChars2);
            }
            lineas2.push(corte.trim());
            texto2 = texto2.slice(corte.length).trim();
        }
        const spacing2 = 5;
        let y2;
        let x2;
        if (lineas2.length === 1 && lineas2[0].length <= 15) {
            y2 = 60;
            x2 = 135;
        } else {
            y2 = 50;
            x2 = 125;
        }
        for (let j = 0; j < lineas2.length; j++) {
            x4PDF.text(lineas2[j], x2, y2);
            y2 += spacing2;
        }
        x4PDF.setFont("helvetica","normal");        
        i++ // Regular articulo 2
        x4PDF.setFontSize(5);
        if(x4Flat[i+2] == "$"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(172,86,178,84.5);
            x4PDF.text("Precio Regular:    " + x4Flat[i], 159,86);
            x4PDF.setFontSize(3.5);
            x4PDF.text("$", 172,86);
        }if(x4Flat[i+2] == "USD"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(172,86,178,84.5);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 157,86);
            x4PDF.setFontSize(3.5);
            x4PDF.text("USD", 170,86);
        }else if(x4Flat[i+2] == undefined){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 153,86);     
        }
        i++ // Oferta articulo 2
        x4PDF.setTextColor(0,0,0);
        let entero2 = String(x4Flat[i]).split(/[.,]/)[0];
        let resta2 = entero2 - x4Flat[i];
        if(resta2 < 0.5 && resta2 !== 0){
            entero2 = parseInt(entero2) + 1;
        }
        if(parseInt(entero2) <= 99){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero2), 150,103);
        }
        if(parseInt(entero2) > 99 && parseInt(x4Flat[i]) < 1000){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero2), 145,103);
        }
        if(parseInt(entero2) >= 1000){
            
            x4PDF.setFontSize(40);
            x4PDF.text(String(entero2), 142,102);
        }
        let cuotas2 = entero2 / 12;
        let cuotasP2 = String(cuotas2).split(/[.,]/)[0];
        if(parseInt(cuotasP2) <= 999){
            
        }
        let parte2 = String(cuotas2).split(/[.,]/);
        let decimal2 = parte2[1] || "0";
        decimal2 = decimal2.padEnd(4,"0");
        let primeros2 = decimal2.slice(0,2);
        let siguientes2 = decimal2.slice(2,4);
        if(parseInt(siguientes2) > 46){
            primeros2 ++
            primeros2 = String(primeros2).padStart(1, "0");
            console.log(primeros2);
        }
        x4PDF.setTextColor(255,255,255);
        parte2 = parseInt(parte2);
        if(x4Flat[i+1] == "USD"){
            if(parte2 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte2)) + ".", 154,123);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],132,123);
            }
            if( parte2 >= 10 && parte2 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte2) + ".",146,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(22);
                x4PDF.text(x4Flat[i+1], 130,123);
            }
            if(parte2 >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte2) + ".",141,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1], 130,123);
            }
        }
        if(x4Flat[i+1] == "$"){
            if(parte2 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte2)) + ".", 154,123);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],147,123);
            }
            if( parte2 >= 10 && parte2 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte2) + ".",147,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1], 142,123);
            }
            if(parte2 >= 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte2) + ".",136,123);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros2),167,115);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],130,123);
            }
        }
        i++ // Moneda articulo 2
        x4PDF.setTextColor(0,0,0);
        if(x4Flat[i] == "USD"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i],132,103);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 130,103);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(15);
                x4PDF.text(x4Flat[i],131,102);
            }
        }
        if(x4Flat[i] =="$"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],145,102);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],140,102);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 138,102);
            }
        }
        i++ // Codigo articulo 3
        x4PDF.setFontSize(5);
        x4PDF.text(String("Estadistico: " + x4Flat[i]), 32, 209);
        i++ // Detalle articulo 3
        x4PDF.setFont("helvetica","bold");
        x4PDF.setFontSize(15);
        let texto3 = String(x4Flat[i]);
        const maxChars3 = 13;
        const lineas3 = [];
        while (texto3.length > 0) {
                let corte = texto3.slice(0, maxChars3);
            let ultimoEspacio = corte.lastIndexOf(" ");
            if (ultimoEspacio !== -1 && texto3.length > maxChars3) {
                corte = texto3.slice(0, ultimoEspacio);
            } else {
                corte = texto3.slice(0, maxChars3);
            }
            lineas3.push(corte.trim());
            texto3 = texto3.slice(corte.length).trim();
        }
        const spacing3 = 5;
        let y3;
        let x3;
        if (lineas3.length === 1 && lineas3[0].length <= 15) {
            y3 = 190;
            x3 = 55;
        } else {
            y3 = 175;
            x3 = 45;
        }
        for (let j = 0; j < lineas3.length; j++) {
            x4PDF.text(lineas3[j], x3, y3);
            y3 += spacing3;
        }
        x4PDF.setFont("helvetica","normal");        
        i++ // Regular articulo 3
        x4PDF.setFontSize(5);
        if(x4Flat[i+2] == "$"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(92,209,98,207.5);
            x4PDF.text("Precio Regular:    " + x4Flat[i], 79,209);
            x4PDF.setFontSize(3.5);
            x4PDF.text("$", 92,209);
        }if(x4Flat[i+2] == "USD"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(92,209,98,207.5);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 77,209);
            x4PDF.setFontSize(3.5);
            x4PDF.text("USD", 90,209);
        }else if(x4Flat[i+2] == undefined){
            x4PDF.text("Precio Regular:        " + x4Flat[i], 72,209);      
        }
        i++ // Oferta articulo 3
        x4PDF.setTextColor(0,0,0);
        let entero3 = String(x4Flat[i]).split(/[.,]/)[0];
        let resta3 = entero3 - x4Flat[i];
        console.log(entero3);
        if(resta3 < 0.5 && resta3 !== 0){
            entero3 = parseInt(entero3) + 1;
        }
        if(parseInt(entero3) <= 99){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero3), 70,225);
        }
        if(parseInt(entero3) > 99 && parseInt(x4Flat[i]) < 1000){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero3), 67,225);
        }
        if(parseInt(entero3) >= 1000){
            
            x4PDF.setFontSize(40);
            x4PDF.text(String(entero3), 65,225);
        }
        let cuotas3 = entero3 / 12;
        let cuotasP3 = String(cuotas3).split(/[,.]/)[0];
        let parte3 = String(cuotas3).split(/[.,]/);
        let decimal3 = parte3[1] || "0";
        decimal3 = decimal3.padEnd(4,"0");
        let primeros3 = decimal3.slice(0,2);
        let siguientes3 = decimal3.slice(2,4);
        if(parseInt(siguientes3) > 46){
            primeros3 ++
            primeros3 = String(primeros3).padStart(1, "0");
            console.log(primeros3);
        }
        x4PDF.setTextColor(255,255,255);
        parte3 = parseInt(parte3);
        if(x4Flat[i+1] == "USD"){
            if(parte3 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte3)) + ".", 74,245);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],55,245);
            }
            if( parte3 >= 10 && parte3 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte3) + ".",67,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(22);
                x4PDF.text(x4Flat[i+1], 49,245);
            }
            if(parte3 >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte3) + ".",60,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1],49,245);
            }
        }
        if(x4Flat[i+1] == "$"){
            if(parte3 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte3)) + ".", 74,245);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],68,245);
            }
            if( parte3 >= 10 && parte3 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte3) + ".",65,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1], 60,245);
            }
            if(parte3 >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte3) + ".",60,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros3),87,237);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1],55,245);
            }
        }
        i++ // Moneda articulo 3
        x4PDF.setTextColor(0,0,0);
        if(x4Flat[i] == "USD"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i],53,225);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 49,225);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(15);
                x4PDF.text(x4Flat[i],51,225);
            }
        }
        if(x4Flat[i] =="$"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],65,225);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],60,225);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 55,225);
            }
        }
        i++ // Codigo articulo 4
        x4PDF.setFontSize(5);
        x4PDF.text(String("Estadistico: " + x4Flat[i]), 112,209);
        i++ // Detalle articulo 4
        x4PDF.setFont("helvetica","bold");
        x4PDF.setFontSize(15);
        let texto4 = String(x4Flat[i]);
        const maxChars4 = 13;
        const lineas4 = [];
        while (texto4.length > 0) {
                let corte = texto4.slice(0, maxChars4);
            let ultimoEspacio = corte.lastIndexOf(" ");
            if (ultimoEspacio !== -1 && texto4.length > maxChars4) {
                corte = texto4.slice(0, ultimoEspacio);
            } else {
                corte = texto4.slice(0, maxChars4);
            }
            lineas4.push(corte.trim());
            texto4 = texto4.slice(corte.length).trim();
        }
        const spacing4 = 5;
        let y4;
        let x4;
        if (lineas4.length === 1 && lineas4[0].length <= 15) {
            y4 = 190;
            x4 = 135;
        } else {
            y4 = 175;
            x4 = 125;
        }
        for (let j = 0; j < lineas4.length; j++) {
            x4PDF.text(lineas4[j], x4, y4);
            y4 += spacing4;
        }
        x4PDF.setFont("helvetica","normal");        
        i++ // Regular articulo 4
        x4PDF.setFontSize(5);
        if(x4Flat[i+2] == "$"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(172,209,178,207.5);
            x4PDF.text("Precio Regular:    " + x4Flat[i], 159,209);
            x4PDF.setFontSize(3.5);
            x4PDF.text("$", 172,209);
        }if(x4Flat[i+2] == "USD"){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.line(172,209,178,207.5);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 157,209);
            x4PDF.setFontSize(3.5);
            x4PDF.text("USD", 170,209);
        }else if(x4Flat[i+2] == undefined){
            x4PDF.setLineWidth(0.1);
            x4PDF.setDrawColor(0,0,0);
            x4PDF.text("Precio Regular:        " + x4Flat[i], 153,209);
        }
        i++ // Oferta articulo 4
        x4PDF.setTextColor(0,0,0);
        let entero4 = String(x4Flat[i]).split(/[.,]/)[0];
        let resta4 = entero4 - x4Flat[i];
        console.log(entero4);
        if(resta4 < 0.5 && resta4 !== 0){
            entero4 = parseInt(entero4) + 1;
        }
        if(parseInt(entero4) <= 99){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero4), 150,225);
        }
        if(parseInt(entero4) > 99 && parseInt(x4Flat[i]) < 1000){
            x4PDF.setFontSize(50);
            x4PDF.text(String(entero4), 145,225);
        }
        if(parseInt(entero4) >= 1000){
            
            x4PDF.setFontSize(40);
            x4PDF.text(String(entero4), 142,225);
        }


        let cuotas4 = entero4 / 12;
        let cuotasP4 = String(cuotas4).split(/[,.]/)[0];
        let parte4 = String(cuotas4).split(/[.,]/);
        let decimal4 = parte4[1] || "0";
        decimal4 = decimal4.padEnd(4,"0");
        let primeros4 = decimal4.slice(0,2);
        let siguientes4 = decimal4.slice(2,4);
        if(parseInt(siguientes4) > 46){
            primeros4 ++
            primeros4 = String(primeros4).padStart(1, "0");
            console.log(primeros4);
        }
        x4PDF.setTextColor(255,255,255);
        parte4 = parseInt(parte4);
        if(x4Flat[i+1] == "USD"){
            if(parte4 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte4)) + ".", 154,245);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],132,245);
            }
            if( parte4 >= 10 && parte4 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte4) + ".",146,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(22);
                x4PDF.text(x4Flat[i+1], 130,245);
            }
            if(parte4 >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte4) + ".",141,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1],130,245);
            }
        }
        if(x4Flat[i+1] == "$"){
            if(parte4 <=9){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parseInt(parte4)) + ".", 154,245);
                x4PDF.setFontSize(20);
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1],147,245);
            }
            if( parte4 >= 10 && parte4 < 100){
                x4PDF.setFontSize(50);
                x4PDF.text(String(parte4) + ".",147,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(25);
                x4PDF.text(x4Flat[i+1], 142,245);
            }
            if(parte4 >= 100){
                x4PDF.setFontSize(45);
                x4PDF.text(String(parte4) + ".",136,245);
                x4PDF.setFontSize(20)
                x4PDF.text(String(primeros4),167,237);
                x4PDF.setFontSize(18);
                x4PDF.text(x4Flat[i+1],130,245);
            }
        }


        i++ //Moneda articulo 4
        x4PDF.setTextColor(0,0,0);
        if(x4Flat[i] == "USD"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i],132,225);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 130,225);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(15);
                x4PDF.text(x4Flat[i],131,225);
            }
        }
        if(x4Flat[i] =="$"){
            if(x4Flat[i-1] <= 99){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],145,225);
            }
            if(x4Flat[i-1] > 99 && x4Flat[i-1] < 1000){
                x4PDF.setFontSize(30);
                x4PDF.text(x4Flat[i],140,225);
            }
            if(x4Flat[i-1] >= 1000){
                x4PDF.setFontSize(20);
                x4PDF.text(x4Flat[i], 140,225);
            }
        }
        i++
        x4PDF.addPage("a4");
    }
    x4PDF.save("x4.pdf");
    A4PDF.save("A4.pdf");
}