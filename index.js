const puppeteer = require('puppeteer');

async function scrapePages(urls) {
    const browser = await puppeteer.launch({
        headless:false
    });
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
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        results.push({ url, totalPages });
    }

    await browser.close();
    return results;
}

(async () => {
    const urls =["https://www.lacuracaonline.com/guatemala/c/muebles/camas-y-colchones", "https://www.lacuracaonline.com/guatemala/c/muebles/cocina"]

    const data = await scrapePages(urls);

    // Generar el CSV, solo el valor de maxPage
    // const csvOutput = data.map(item => `${item.url},${item.totalPages}`).join("\n");
    const csvOutput = data.map(item => `${item.totalPages}`).join("\n");


    // Mostrar la salida para copiar y pegar en Excel
    console.log("URL,Max Page");
    console.log(csvOutput);
})();
