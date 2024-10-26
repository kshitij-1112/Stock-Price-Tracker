const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver'); // Ensure chromedriver is installed

(async function runTests() {
    // Initialize the WebDriver
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Open the login page
        await driver.get('http://localhost:3000/login');

        // Find and fill in the login form
        await driver.findElement(By.name('username')).sendKeys('user@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('123456', Key.RETURN);

        // Wait for redirection to the stocks page
        await driver.wait(until.urlIs('http://localhost:3000/stocks'), 5000);

        // Verify redirection to the stocks page
        let currentUrl = await driver.getCurrentUrl();
        if (currentUrl === 'http://localhost:3000/stocks') {
            console.log('Login test passed!');
        } else {
            console.log('Login test failed. Current URL:', currentUrl);
        }

        // Optionally, add more tests here

    } catch (error) {
        console.error('Error during testing:', error);
    } finally {
        // Quit the WebDriver session
        //await driver.quit();
    }
})();
