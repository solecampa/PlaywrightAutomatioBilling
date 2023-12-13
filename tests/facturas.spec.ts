import { test } from '@playwright/test';
import config from '../config';
//set the credentials (cuit and password as environment variables in the terminal)
let cuit = config.cuit
let password = config.password
let nombre = 'MARIA SOLEDAD CAMPANA'

test('generar facturas', async ({  browser}) => {
  console.log(config.cuit)
  console.log(config.password)
  test.setTimeout(900000)
  let page;
  let context;
  let periodoFacturadoDesde = '01/11/2023'
  let periodoFacturadoHasta = '30/11/2023'
  let fechaEmisionComprobante = '29/11/2023'
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto('https://auth.afip.gob.ar/contribuyente_/login.xhtml');
  await page.locator('#F1\\:username').fill(cuit)
  await page.locator('#F1\\:btnSiguiente').click()
  await page.locator('#F1\\:password').fill(password)
  await page.locator('#F1\\:btnIngresar').click()
  await page.waitForLoadState('domcontentloaded')
  
  
 
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.locator('a').filter({ hasText: 'Monotributo' }).click(),
  ]);

  await newPage.waitForLoadState();
  await newPage.bringToFront();
  await newPage.locator('//*[@id="menuLateral"]/li[3]/a').click()

  const [facturacion] = await Promise.all([
    context.waitForEvent("page"),
    newPage.locator('#bBtn1').first().click()
  ])
  
  
  await facturacion.locator('#F1\\:username').fill(cuit)
  await facturacion.locator('#F1\\:btnSiguiente').click()
  await facturacion.locator('#F1\\:password').fill(password)
  await facturacion.locator('#F1\\:btnIngresar').click()
  await facturacion.waitForLoadState('domcontentloaded')
  //await facturacion.locator('#bBtn1').first().click()
  
  //await facturacion.waitForLoadState('networkidle')
  await facturacion.getByRole('button', { name: 'CAMPANA MARIA SOLEDAD' }).click();
  for (let i = 0; i < 5; i++) {
    
    await facturacion.locator('text=Generar Comprobantes').click()
    await facturacion.locator('#puntodeventa').selectOption('3');
    await facturacion.waitForLoadState('networkidle')
    await facturacion.getByRole('button', { name: 'Continuar >' }).click();
    await facturacion.locator('#idconcepto').selectOption('2');
    await facturacion.locator('#fc').fill(fechaEmisionComprobante);

    await facturacion.locator('#fsd').fill(periodoFacturadoDesde)
    await facturacion.locator('#fsh').fill(periodoFacturadoHasta)
    await facturacion.locator('#actiAsociadaId').selectOption('620100');
    await facturacion.getByRole('button', { name: 'Continuar >' }).click();
    await facturacion.locator('#idivareceptor').selectOption('5');
    await facturacion.getByLabel('Contado').check();
    
    await facturacion.locator('input[name="cmpAsociadoPtoVta"]').fill('00003');
    
    await facturacion.locator('input[name="cmpAsociadoNro"]').fill('0000001');
    
    await facturacion.getByRole('button', { name: 'Continuar >' }).click();
  
    await facturacion.locator('input[name="detalleCodigoArticulo"]').fill('1');
    await facturacion.locator('#detalle_descripcion1').fill('it');
    await facturacion.locator('#detalle_precio1').fill('20000');
    await facturacion.getByRole('button', { name: 'Continuar >' }).click();
    //facturacion.on('dialog', async (dialog) => dialog.accept());
    facturacion.once('dialog', async function(dialog) {
      await dialog.accept();
    });
  
  
    await facturacion.locator('#btngenerar').click()
  

    await facturacion.getByRole('button',{name: 'Menú Principal'}).click()
  } 
});

