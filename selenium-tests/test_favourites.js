const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testMyStocks() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    // Navigate to login page
    await driver.get('http://localhost:3000/login');

    // Log in with user credentials
    await driver.findElement(By.name('username')).sendKeys('user@gmail.com');
    await driver.findElement(By.name('password')).sendKeys('123456');
    await driver.findElement(By.name('submit')).click();

    // Wait for the stocks page to load
    await driver.wait(until.urlContains('/stocks'), 10000);
    await driver.findElement(By.name('favorites')).click();
    // Navigate to the MyStocks page (adjust this step according to your app's navigation)
    await driver.get('http://localhost:3000/favorites');

    // Wait for the MyStocks page to load
    //await driver.wait(until.elementLocated(By.css('.mystocks-container')), 10000);
    await driver.sleep(6000);
    // Click the first "Analyse" button
    await driver.findElement(By.name('remove')).click();

    console.log('Test completed successfully.');
  } finally {
    //await driver.quit();
  }
})();
