const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver'); // Ensure chromedriver is installed

(async function runStockListTests() {
    let driver = await new Builder().forBrowser('chrome').build();

    // Function to handle any alerts
    async function handleAlert() {
        try {
            let alert = await driver.switchTo().alert();
            await alert.accept();
            console.log('Alert accepted.');
        } catch (error) {
            // No alert present
        }
    }

    // Function to click an element using JavaScript
    async function clickElement(element) {
        try {
            await driver.executeScript("arguments[0].scrollIntoView(true);", element); // Scroll into view
            await driver.executeScript("arguments[0].click();", element); // Click using JavaScript
        } catch (error) {
            console.error('Error clicking element:', error);
        }
    }

    try {
        // Navigate to login page
        await driver.get('http://localhost:3000/login');

        // Debug: Check if login page is loaded
        let loginPageTitle = await driver.getTitle();
        console.log('Login Page Title:', loginPageTitle);

        // Log in
        await driver.findElement(By.name('username')).sendKeys('user@gmail.com');
        await driver.findElement(By.name('password')).sendKeys('123456');
        await driver.findElement(By.name('submit')).click();

        // Handle any alert that appears after login
        await handleAlert();

        // Wait for redirection to stock list page
        await driver.wait(until.urlIs('http://localhost:3000/stocks'), 20000);

        // Debug: Verify URL
        let currentUrl = await driver.getCurrentUrl();
        console.log('Current URL after login:', currentUrl);

        // Ensure we are on the stock list page
        if (currentUrl !== 'http://localhost:3000/stocks') {
            console.log('Failed to reach stock list page. Current URL:', currentUrl);
            return;
        }

        await driver.sleep(20000);

        // Sort stocks by all options in the dropdown
        const sortOptions = ['alphabetical-asc', 'alphabetical-desc', 'price-asc', 'price-desc'];
        for (const option of sortOptions) {
            let sortDropdown = await driver.findElement(By.name('sortDropdown'));
            await sortDropdown.sendKeys(option);
            await driver.sleep(2000); // Wait for stocks to sort
            // Handle any alert that appears after sorting
            await handleAlert();
        }

        // Add a stock to compare list
        let addToCompareButtons = await driver.findElements(By.name('addToCompare'));
        if (addToCompareButtons.length > 1) {
            await clickElement(addToCompareButtons[0]); // Click on the first "Compare" button
            await driver.sleep(2000); // Wait for the action to complete
            // Handle any alert that appears after adding to compare list
            await handleAlert();
            await clickElement(addToCompareButtons[1]); // Click on the second "Compare" button
            await driver.sleep(2000); // Wait for the action to complete
            // Handle any alert that appears after adding to compare list
            await handleAlert();

            // Remove a stock from compare list
            let compareTable = await driver.findElement(By.name('compareTable'));
            let removeButtons = await compareTable.findElements(By.name('removeFromCompare'));
            if (removeButtons.length > 0) {
                await clickElement(removeButtons[0]); // Click on the first "Remove" button
                await driver.sleep(2000); // Wait for the action to complete
                // Handle any alert that appears after removing from compare list
                await handleAlert();
            } else {
                console.log('No remove buttons found in compare table.');
            }
        } else {
            console.log('Not enough compare buttons found.');
        }

        // Add a stock to favorites
        let addToFavoritesButtons = await driver.findElements(By.name('addToFavorites'));
        if (addToFavoritesButtons.length > 0) {
            await clickElement(addToFavoritesButtons[0]); // Click on the first "Add to Favorites" button
            await driver.sleep(2000); // Wait for the action to complete
            // Handle any alert that appears after adding to favorites
            await handleAlert();
        } else {
            console.log('No add to favorites buttons found.');
        }

        // Click on the Favorites button in the header
        await clickElement(await driver.findElement(By.name('favoritesLink')));
        await driver.wait(until.urlIs('http://localhost:3000/favorites'), 20000);

        // Handle any alert that appears after navigating to favorites page
        await handleAlert();

        // Verify redirection to the favorites page
        currentUrl = await driver.getCurrentUrl();
        console.log('Current URL after navigating to Favorites page:', currentUrl);
        if (currentUrl !== 'http://localhost:3000/favorites') {
            console.log('Failed to navigate to Favorites page. Current URL:', currentUrl);
        } else {
            console.log('Successfully navigated to Favorites page!');
        }

    } catch (error) {
        console.error('Error during stock list testing:', error);
    } finally {
        // Quit the WebDriver session
        await driver.quit();
    }
})();
