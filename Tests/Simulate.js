require('geckodriver');
var sleep = require('sleep');
const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const fs = require('fs');
const chai = require('chai');
require('mocha-allure-reporter');

let file = 1;

// const urlAdmin = 'http://localhost:8080/scs/scsverwaltung/frameset.jsp'
// const urlHome = 'http://localhost:8080/scs/index.jsp'
const urlAdmin = 'https://www.iwi.hs-karlsruhe.de/scs6/scsverwaltung/frameset.jsp'
const urlHome = 'https://www.iwi.hs-karlsruhe.de/scs6/index.jsp'

describe('Simulate Group 7', function() {
    this.retries(4);
    const driver = new Builder().forBrowser('firefox').build();

    it('should go to scs and delete the mod (init purge)', async function() {
        try{
            // await driver.manage().setTimeouts({implicit: 100000, pageLoad: 100000, script: 100000});        
            //open admin page
            await driver.get(urlAdmin);
        
            //login as admin
            await driver.switchTo().defaultContent();
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("admin");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("padmin");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();
        
            //goto all Mods
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(0);
            await driver.findElement(By.xpath("//*[contains(text(),'Alle Moderatoren')]")).click();
        
            //delete mod
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            await driver.findElement(By.xpath("//*[contains(text(),'testModerator')]/../td[8]/input[2]")).click();
            await driver.switchTo().alert().accept();

        } catch{
            console.log("TestModerator was not found. Execution continues...")
        }
    });

    it('should go to scs and create a mod', async function() {
       //open admin page
       await driver.switchTo().defaultContent();
       await driver.get(urlAdmin);
       await driver.switchTo().defaultContent();
    
        //login as admin
        await driver.switchTo().defaultContent();
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("admin");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("padmin");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();

        //goto Neuer Moderator
        await driver.switchTo().defaultContent();
        sleep.sleep(1);
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("//*[contains(text(),'Neuer Moderator')]")).click();
    
        //create Mod
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[2]/input")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[5]/td[2]/input[1]")).clear();
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[5]/td[2]/input[1]")).sendKeys("4200");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[7]/td[2]/input")).click();
    });

    it('should go to scs and create a new game and group', async function() {
        //open admin page
        await driver.switchTo().defaultContent();
        await driver.get(urlAdmin);
        await driver.switchTo().defaultContent();

        //login as mod
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();

        //goto new game
        sleep.sleep(2);
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[1]/td/a")).click();
        //create Game
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testSpiel");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[4]/td[2]/input")).click();
        //TODO -->Fallback wenn Spiel letztes mal nicht gelöscht wurde

        //goto new Group
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[6]/td/a")).click();

        //create Group
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testGroup");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[2]/input")).sendKeys("testGroup");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[6]/td[2]/input")).click();
    });
    
    //send all XML Files
    for(var i = 1;i<8;++i){
        it('should go to scs and send the xml_'+i, async function() {
            let value = true;
            //go to home
            await driver.switchTo().defaultContent();
            await driver.get(urlHome);
            
            //go to XML Upload
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(0);
            await driver.findElement(By.xpath("//*[@href='./simulate/upload.jsp']")).click();
            
            //login as testGroup
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("testGroup");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("testGroup");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();
    
            //upload XML
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            var filePath = process.cwd()+'\\data\\WS 2019\\g7\\210_7_'+file+'input.xml';
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/input[1]")).sendKeys(filePath);
            await driver.findElement(By.xpath("//*[@id='simulateButton']")).click();

            //assert
            while(value == true){
                //await driver.switchTo().defaultContent();
                //await driver.switchTo().frame(1);
                sleep.sleep(1); // Prüfe jede Sekunde ob Simulate Button sichtbar ist
                console.log('warte');
                await driver.findElement(By.xpath("//*[@id='simulateButton']")).then(null, async function (err) {
                    if (err.name == "NoSuchElementError"){ //wartet bis simulate button weg ist --> nächste Seite wurde geladen
                        console.log('CATCH')
                        value=false;
                        await driver.switchTo().defaultContent();
                        await driver.switchTo().frame(1);
                        await driver.switchTo().frame(1);
                        sleep.sleep(5);
                        let text = await driver.findElement(By.xpath("/html/body/p/table/tbody/tr[2]/td")).getText();
                        expect(text).to.eql("Hier können Sie die Ergebnisse von Periode "+(file)+" sehen.");
                        ++file;
                    }
                }); 
            }
        });
    }
   
    after(async function() {
        driver.quit()
    });

    beforeEach(async function() {
        console.log('Führe Test aus mit Datei '+file);
    });

    afterEach(async function() {
        console.log('Logout');
         //logout
         await driver.switchTo().defaultContent();
         await driver.switchTo().frame(0);

         console.log(this.currentTest.title);
         console.log('should go to scs and send the xml_'+(file-1));


         if (this.currentTest.title=='should go to scs and send the xml_'+(file-1)){
            await driver.findElement(By.xpath("/html/body/table/tbody/tr/td[1]/a[10]")).click();
         } else{
            await driver.findElement(By.xpath("//*[contains(text(),'Logout')]")).click();
         }
         
    });

});

describe('Simulate Group 6', function() {
    this.retries(4);
    const driver = new Builder().forBrowser('firefox').build();

    it('should go to scs and delete the mod (init purge)', async function() {
        try{
            // await driver.manage().setTimeouts({implicit: 100000, pageLoad: 100000, script: 100000});        
            //open admin page
            await driver.get(urlAdmin);
        
            //login as admin
            await driver.switchTo().defaultContent();
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("admin");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("padmin");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();
        
            //goto all Mods
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(0);
            await driver.findElement(By.xpath("//*[contains(text(),'Alle Moderatoren')]")).click();
        
            //delete mod
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            await driver.findElement(By.xpath("//*[contains(text(),'testModerator')]/../td[8]/input[2]")).click();
            await driver.switchTo().alert().accept();

        } catch{
            console.log("TestModerator was not found. Execution continues...")
        }
    });

    it('should go to scs and create a mod', async function() {
       //open admin page
       await driver.switchTo().defaultContent();
       await driver.get(urlAdmin);
       await driver.switchTo().defaultContent();
    
        //login as admin
        await driver.switchTo().defaultContent();
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("admin");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("padmin");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();

        //goto Neuer Moderator
        await driver.switchTo().defaultContent();
        sleep.sleep(1);
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("//*[contains(text(),'Neuer Moderator')]")).click();
    
        //create Mod
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[2]/input")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[5]/td[2]/input[1]")).clear();
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[5]/td[2]/input[1]")).sendKeys("4200");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[7]/td[2]/input")).click();
    });

    it('should go to scs and create a new game and group', async function() {
        //open admin page
        await driver.switchTo().defaultContent();
        await driver.get(urlAdmin);
        await driver.switchTo().defaultContent();

        //login as mod
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("testModerator");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();

        //goto new game
        sleep.sleep(2);
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[1]/td/a")).click();
        //create Game
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testSpiel");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[4]/td[2]/input")).click();
        //TODO -->Fallback wenn Spiel letztes mal nicht gelöscht wurde

        //goto new Group
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(0);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[6]/td/a")).click();

        //create Group
        await driver.switchTo().defaultContent();
        await driver.switchTo().frame(1);
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[1]/td[2]/input")).sendKeys("testGroup");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td[2]/input")).sendKeys("testGroup");
        await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/table/tbody/tr[6]/td[2]/input")).click();
    });
    
    //send all XML Files
    for(var i = 1;i<8;++i){
        it('should go to scs and send the xml_'+i, async function() {
            let value = true;
            //go to home
            await driver.switchTo().defaultContent();
            await driver.get(urlHome);
            
            //go to XML Upload
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(0);
            await driver.findElement(By.xpath("//*[@href='./simulate/upload.jsp']")).click();
            
            //login as testGroup
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[1]")).sendKeys("testGroup");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[2]")).sendKeys("testGroup");
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/table/tbody/tr[2]/td/form/input[3]")).click();
    
            //upload XML
            await driver.switchTo().defaultContent();
            await driver.switchTo().frame(1);
            var filePath = process.cwd()+'\\data\\WS 2019\\g6\\210_6_'+file+'input.xml';
            await driver.findElement(By.xpath("/html/body/table/tbody/tr[2]/td/form/input[1]")).sendKeys(filePath);
            await driver.findElement(By.xpath("//*[@id='simulateButton']")).click();

            //assert
            while(value == true){
                //await driver.switchTo().defaultContent();
                //await driver.switchTo().frame(1);
                sleep.sleep(1); // Prüfe jede Sekunde ob Simulate Button sichtbar ist
                console.log('warte');
                await driver.findElement(By.xpath("//*[@id='simulateButton']")).then(null, async function (err) {
                    if (err.name == "NoSuchElementError"){ //wartet bis simulate button weg ist --> nächste Seite wurde geladen
                        console.log('CATCH')
                        value=false;
                        await driver.switchTo().defaultContent();
                        await driver.switchTo().frame(1);
                        await driver.switchTo().frame(1);
                        sleep.sleep(5);
                        let text = await driver.findElement(By.xpath("/html/body/p/table/tbody/tr[2]/td")).getText();
                        expect(text).to.eql("Hier können Sie die Ergebnisse von Periode "+(file)+" sehen.");
                        ++file;
                    }
                }); 
            }
        });
    }
   
    after(async function() {
        driver.quit()
    });

    beforeEach(async function() {
        console.log('Führe Test aus mit Datei '+file);
    });

    afterEach(async function() {
        console.log('Logout');
         //logout
         await driver.switchTo().defaultContent();
         await driver.switchTo().frame(0);

         console.log(this.currentTest.title);

         if (this.currentTest.title=='should go to scs and send the xml_'+(file-1)){
            await driver.findElement(By.xpath("/html/body/table/tbody/tr/td[1]/a[10]")).click();
         } else{
            await driver.findElement(By.xpath("//*[contains(text(),'Logout')]")).click();
         }
         
    });

});

