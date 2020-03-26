var ProgressBar = require('progress');
 const jsdom = require("jsdom");
 const {JSDOM} = jsdom;
 const  $$ = (html) => {
  const fd= (require('jquery'))((new JSDOM(html)).window);
  fd.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) { 
                var allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});
  return fd;
}
 const newJquery = $$;
const fs = require("fs");
const  wait  =(ms) => {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}
function convertJSONtocsv(json,filename) {
    if (json.length === 0) {
        return;
    }

    json.sort(function(a,b){ 
       return Object.keys(b).length - Object.keys(a).length;
    });

    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(json[0])
    let csv = json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    csv.unshift(header.join(','))
    csv = csv.join('\r\n')

    fs.writeFileSync("dist/"+filename+'.csv', csv)
}
const puppeteer = require('puppeteer');

const getR =async (page,nb)=> {
  await page.waitForSelector('#region_id > .multiselect > .multiselect',{timeout: 2000 })
  await page.click('#region_id > .multiselect > .multiselect')
    
  await page.waitForSelector('.open > .multiselect-container > .multiselect-item > .multiselect-all > .checkbox',{timeout: 2000 })
  await page.click('.open > .multiselect-container > .multiselect-item > .multiselect-all > .checkbox')
  
  await wait(1000);
  await page.waitForSelector('.open > .multiselect-container > .multiselect-item > .multiselect-all > .checkbox',{timeout: 2000 })
  await page.click('.open > .multiselect-container > .multiselect-item > .multiselect-all > .checkbox')
  
  await page.waitForSelector('.open > .multiselect-container > li:nth-child('+nb+') > a > .checkbox',{timeout: 2000 })
  await page.click('.open > .multiselect-container > li:nth-child('+nb+') > a > .checkbox')
  
  await page.waitForSelector('#aside > #rechercheForm #rechercheButton',{timeout: 2000 })
  await page.click('#aside > #rechercheForm #rechercheButton')
  
  return await getDatas(page);
}

const getDatas = async (page)  => {
  //rea
  const selectA=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(22) > :nth-child(3)"
  await page.waitForSelector(selectA,{timeout: 2000 });

  //usic
  const selectB=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(22) > :nth-child(3)"
  //usic unv
  const selectC=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(22) > :nth-child(4)"
  //usic autres
  const selectD=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(22) > :nth-child(5)"
  //usic all
  const selectE=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(22) > :nth-child(6)"
   
   const selectF=":nth-child(2) > :nth-child(3) > :nth-child(2) > :nth-child(3) > :nth-child(6) > :nth-child(1) > :nth-child(2) > :nth-child(30) > :nth-child(3)"

  let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  const $ = newJquery(bodyHTML);
  var rea=$(selectA).text().replace(" ","").replace("-","");
  var usic=$(selectB).text().replace(" ","").replace("-","");
  var usicUNV=$(selectC).text().replace(" ","").replace("-","");
  var usicAutres = $(selectD).text().replace(" ","").replace("-","");
  var usicAll = $(selectE).text().replace(" ","").replace("-","");
  var usc = $(selectF).text().replace(" ","").replace("-","");

  var d= [$("#region_id .multiselect-container.dropdown-menu .active").text().trim().split(' - '),rea,usic,usicUNV,usicAutres,usicAll,usc];
  d=d.flat();
  return d;
}

(async () => {
  const browser = await puppeteer.launch({ headless: true})
  const page = await browser.newPage()
   
  console.log("Début du scap pour les régions...");
  await page.goto('https://www.sae-diffusion.sante.gouv.fr/sae-diffusion/recherche.htm')
  
  await page.setViewport({ width: 1680, height: 916 })
  
  await page.waitForSelector('.panel > #collapseImplantation > .panel-body > .radio:nth-child(3) > label',{timeout: 2000 })
  await page.click('.panel > #collapseImplantation > .panel-body > .radio:nth-child(3) > label')
  
  await page.waitForSelector('.radio > .radioListe > #region_id > .multiselect > .multiselect',{timeout: 2000 })
  await page.click('.radio > .radioListe > #region_id > .multiselect > .multiselect')
  
  await page.waitForSelector('.open > .multiselect-container > li:nth-child(3) > a > .checkbox',{timeout: 2000 })
  await page.click('.open > .multiselect-container > li:nth-child(3) > a > .checkbox')
  
  await page.waitForSelector('#recherche > .container-fluid > #aside > #rechercheForm > .form-block:nth-child(1)',{timeout: 2000 })
  await page.click('#recherche > .container-fluid > #aside > #rechercheForm > .form-block:nth-child(1)')
  
  await page.waitForSelector('#accordion > .panel > #bordereauFsAccordeon > .panel-title > a',{timeout: 2000 })
  await page.click('#accordion > .panel > #bordereauFsAccordeon > .panel-title > a')
  
  await page.waitForSelector('.panel > #collapseBordereauFS #bordereauSelected',{timeout: 2000 })
  await page.click('.panel > #collapseBordereauFS #bordereauSelected')
  
   await wait(1000);
  await page.select('.panel > #collapseBordereauFS #bordereauSelected', '392')
  
  await wait(1000);
  await page.waitForSelector('#aside > #rechercheForm #rechercheButton',{timeout: 2000 })
  await page.click('#aside > #rechercheForm #rechercheButton')

  var bar = new ProgressBar('[:bar] :percent :etas (:n)', { total: 18 });
  const a = [];
  const first=await getDatas(page);
  bar.tick({"n":first[1]});
  a.push(first);
  await page.waitForSelector('#accordion > .panel > #implantationAccordeon > .panel-title > a',{timeout: 2000 })
  await page.click('#accordion > .panel > #implantationAccordeon > .panel-title > a')
  
  for (var i = 1; i < 18; i++) {
      
      const c=await getR(page,i+3);
      bar.tick({"n":c[1]});
       a.push(c)
       await wait(200);
       // console.log(c);
  }
  // console.log(a);
  await browser.close();

  const jsonR=a;
  convertJSONtocsv(jsonR,"regions.csv")

})()