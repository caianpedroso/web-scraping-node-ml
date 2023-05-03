const pup = require('puppeteer');

const url = "https://www.mercadolivre.com.br/";
const searchFor = "macbook";

let c = 1;
let list = [];

(async () => {
  const browser = await pup.launch({
    headless: false
  });
  const page = await browser.newPage();
  console.log('teste ')
  
  await page.setExtraHTTPHeaders({
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
  });
  
  await page.goto(url);
  
  console.log('teste1 ')
  
  await page.waitForSelector('#cb1-edit');
  
  await page.type('#cb1-edit', searchFor);
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('.nav-search-btn')
  ])
  
  const links = await page.$$eval('.andes-card > div > a', e => e.map(link => link.href))
  console.log("links ", links)
  for(const link of links){
    console.log('Pagina ', c)
    await page.goto(link);
    await page.waitForSelector('.ui-pdp-title')
    
    const title = await page.$eval('.ui-pdp-title', element => element.innerText);
    const price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);
    
    const seller = await page.evaluate(() => {
      const el = document.querySelector('.ui-pdp-seller__link-trigger');
      if(!el) return null;
      return el.innerText;
    })
    
    const obj = {};
    obj.title = title;
    obj.price = price;
    (seller ? obj.seller = seller : '');
    obj.link = link;
    
    list.push(obj);
    
    c++;
  }
  console.log(list)
  
  await page.waitForTimeout(3000);
  await browser.close();
})();