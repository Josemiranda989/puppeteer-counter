const puppeteer = require('puppeteer');

async function scrapePages(urls) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const results = [];

    for (let url of urls) {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Extraer texto del elemento y calcular total de ítems
        const totalItems = await page.evaluate(() => {
            const toolbarElement = document.querySelector('.toolbar-amount');
            if (toolbarElement) {
                const text = toolbarElement.textContent.trim();
                // Extraer el número total usando regex
                const match = text.match(/(\d+)\s*Resultados/);
                return match ? parseInt(match[1], 10) : 0;
            }
            return 0;
        });

        // Definir el número de ítems por página (puedes ajustarlo dinámicamente)
        const itemsPerPage = 24;  // Cambiar a 22, 23 o el valor que necesites

        // Si no se encuentra el número de ítems, asignar 1 página
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;

        results.push({ url, totalPages });
    }

    await browser.close();
    return results;
}

(async () => {
    const urls =["https://www.lacuracaonline.com/honduras/c/hogar/menaje-de-cocina", "https://www.lacuracaonline.com/honduras/c/hogar/menaje-de-mesa", "https://www.lacuracaonline.com/honduras/c/hogar/organizacion-y-almacenamiento", "https://www.lacuracaonline.com/honduras/c/optica/aros-y-lentes-oftalmicos", "https://www.lacuracaonline.com/honduras/c/optica/lentes-y-accesorios", "https://www.lacuracaonline.com/honduras/c/salud-y-belleza/bienestar-y-salud", "https://www.lacuracaonline.com/honduras/c/salud-y-belleza/bolsos-mochilas-y-organizadores", "https://www.lacuracaonline.com/honduras/c/salud-y-belleza/cuidado-personal", "https://www.lacuracaonline.com/honduras/c/tecnologia/audio", "https://www.lacuracaonline.com/honduras/c/tecnologia/camaras", "https://www.lacuracaonline.com/honduras/c/tecnologia/computacion", "https://www.lacuracaonline.com/honduras/c/tecnologia/gaming", "https://www.lacuracaonline.com/honduras/c/tecnologia/reproductores", "https://www.lacuracaonline.com/honduras/c/tecnologia/smartwatches-y-wearables", "https://www.lacuracaonline.com/honduras/c/tecnologia/telefonia-1", "https://www.lacuracaonline.com/elsalvador/c/promociones-sv", "https://www.lacuracaonline.com/elsalvador/c/lo-mas-nuevo", "https://www.lacuracaonline.com/elsalvador/catalog/category/view/s/pantallas/id/4679/", "https://www.lacuracaonline.com/elsalvador/catalog/category/view/s/controles-de-tv/id/4688/", "https://www.lacuracaonline.com/elsalvador/c/tv-y-video/monitores", "https://www.lacuracaonline.com/elsalvador/catalog/category/view/s/rack-y-soportes/id/4694/", "https://www.lacuracaonline.com/elsalvador/c/tv-y-video/reproductores-de-streaming", "https://www.lacuracaonline.com/elsalvador/c/tv-y-video/switches-y-splitters", "https://www.lacuracaonline.com/elsalvador/c/tv-y-video/muebles-de-tv", "https://www.lacuracaonline.com/elsalvador/c/colchones/camas", "https://www.lacuracaonline.com/elsalvador/c/colchones/colchones", "https://www.lacuracaonline.com/elsalvador/c/colchones/camarotes", "https://www.lacuracaonline.com/elsalvador/c/colchones/juegos-de-dormitorio", "https://www.lacuracaonline.com/elsalvador/c/telefonia/accesorios-de-celulares", "https://www.lacuracaonline.com/elsalvador/c/telefonia/celulares-y-telefonos", "https://www.lacuracaonline.com/elsalvador/c/telefonia/powerbanks-y-cargadores", "https://www.lacuracaonline.com/elsalvador/c/telefonia/radiocomunicacion", "https://www.lacuracaonline.com/elsalvador/c/telefonia/smartwatches-y-wearables-1", "https://www.lacuracaonline.com/elsalvador/c/muebles/camas-y-colchones", "https://www.lacuracaonline.com/elsalvador/c/muebles/cocina", "https://www.lacuracaonline.com/elsalvador/c/muebles/comedor", "https://www.lacuracaonline.com/elsalvador/c/muebles/dormitorio", "https://www.lacuracaonline.com/elsalvador/c/muebles/exteriores", "https://www.lacuracaonline.com/elsalvador/c/muebles/oficina", "https://www.lacuracaonline.com/elsalvador/c/muebles/sala", "https://www.lacuracaonline.com/elsalvador/c/linea-blanca/climatizacion", "https://www.lacuracaonline.com/elsalvador/c/linea-blanca/cocina", "https://www.lacuracaonline.com/elsalvador/c/linea-blanca/lavadoras-y-secadoras", "https://www.lacuracaonline.com/elsalvador/c/linea-blanca/refrigeracion", "https://www.lacuracaonline.com/elsalvador/c/electrodomesticos/accesorios-de-electrodomesticos", "https://www.lacuracaonline.com/elsalvador/c/electrodomesticos/arroceras", "https://www.lacuracaonline.com/elsalvador/c/electrodomesticos/batidoras", "https://www.lacuracaonline.com/elsalvador/c/electrodomesticos/cafeteras", "https://www.lacuracaonline.com/elsalvador/c/electrodomesticos/cuidado-de-ropa-y-limpieza", "https://www.lacuracaonline.com/elsalvador/c/automotriz/accesorios-y-repuestos", "https://www.lacuracaonline.com/elsalvador/c/automotriz/audio-para-autos", "https://www.lacuracaonline.com/elsalvador/c/automotriz/motocicletas", "https://www.lacuracaonline.com/elsalvador/c/deportes-y-aire-libre/barbacoas", "https://www.lacuracaonline.com/elsalvador/c/deportes-y-aire-libre/bicicletas", "https://www.lacuracaonline.com/elsalvador/c/deportes-y-aire-libre/campamento", "https://www.lacuracaonline.com/elsalvador/c/deportes-y-aire-libre/equipos-de-ejercicio", "https://www.lacuracaonline.com/elsalvador/catalog/category/view/s/muebles-de-exterior/id/264/", "https://www.lacuracaonline.com/elsalvador/c/ferreteria/baterias", "https://www.lacuracaonline.com/elsalvador/c/ferreteria/herramientas-electricas", "https://www.lacuracaonline.com/elsalvador/c/ferreteria/herramientas-manuales", "https://www.lacuracaonline.com/elsalvador/c/ferreteria/iluminacion-y-electricidad", "https://www.lacuracaonline.com/elsalvador/c/hogar/complementos-de-hogar-y-oficina", "https://www.lacuracaonline.com/elsalvador/c/hogar/decoracion", "https://www.lacuracaonline.com/elsalvador/c/hogar/decoracion-navidena", "https://www.lacuracaonline.com/elsalvador/c/hogar/menaje-de-cocina", "https://www.lacuracaonline.com/elsalvador/c/hogar/menaje-de-mesa", "https://www.lacuracaonline.com/elsalvador/c/hogar/organizacion-y-almacenamiento", "https://www.lacuracaonline.com/elsalvador/c/hogar/edredones-y-sabanas", "https://www.lacuracaonline.com/elsalvador/c/hogar/almohadas", "https://www.lacuracaonline.com/elsalvador/c/infantil-y-bebe/articulos-para-bebes", "https://www.lacuracaonline.com/elsalvador/c/infantil-y-bebe/jugueteria", "https://www.lacuracaonline.com/elsalvador/c/optica/aros-y-lentes-oftalmicos", "https://www.lacuracaonline.com/elsalvador/c/optica/lentes-y-accesorios", "https://www.lacuracaonline.com/elsalvador/c/salud-y-belleza/bienestar-y-salud", "https://www.lacuracaonline.com/elsalvador/c/salud-y-belleza/bolsos-mochilas-y-organizadores", "https://www.lacuracaonline.com/elsalvador/c/salud-y-belleza/cuidado-personal", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/almacenamiento", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/audio", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/cables-y-adaptadores", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/camaras", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/computacion", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/gaming", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/hogar-inteligente", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/smartwatches-y-wearables", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/telefonia-1", "https://www.lacuracaonline.com/elsalvador/c/tecnologia/tv-y-video"]

    const data = await scrapePages(urls);

    // Generar el CSV, solo el valor de maxPage
    const csvOutput = data.map(item => `${item.url},${item.totalPages}`).join("\n");
    // const csvOutput = data.map(item => `${item.totalPages}`).join("\n");


    // Mostrar la salida para copiar y pegar en Excel
    console.log("URL,Max Page");
    console.log(csvOutput);
})();
