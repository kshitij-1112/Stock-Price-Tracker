const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testBuyStocks() {
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

    // Wait for 6 seconds as mentioned
    await driver.sleep(15000);

    // Click the buy button of the first stock
    await driver.findElement(By.name('buyStock')).click();

    // Wait for the BuyStocks page to load
    await driver.wait(until.urlContains('/buy'), 10000);

    // Enter 101 in the number of stocks field
    await driver.findElement(By.name('numStocks')).sendKeys('101');
    await driver.findElement(By.name('buyButton')).click();

    // Handle the alert for exceeding the stock limit
    await driver.wait(until.alertIsPresent(), 10000);
    let alert = await driver.switchTo().alert();
    assert.strictEqual(await alert.getText(), 'Number of stocks cannot exceed 100.');
    await alert.accept();

    // Enter 4 in the number of stocks field
    let numStocksField = await driver.findElement(By.name('numStocks'));
    await numStocksField.clear();
    await numStocksField.sendKeys('4');
    await driver.findElement(By.name('buyButton')).click();

    // Wait for a potential alert or page change after purchase
    await driver.sleep(3000); // Adjust this as needed based on actual response time

    // Optionally, verify the purchase or the redirect to the stocks page
    // For example:
    // assert.strictEqual(await driver.getCurrentUrl(), 'http://localhost:3000/stocks');

    console.log('Test completed successfully.');
  } finally {
    await driver.quit();
  }
})();
