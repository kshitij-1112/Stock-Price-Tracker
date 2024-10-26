const { Builder, By, until } = require('selenium-webdriver');

// Replace with your local project URL (including port if necessary)
const baseUrl = 'http://localhost:3000/register';

async function testRegister() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the registration page
    await driver.get(baseUrl);

    // Find email input and enter a valid email
    const emailInput = await driver.findElement(By.name('email'));
    await emailInput.sendKeys('test@example.com');

    // Find password input and enter a strong password
    const passwordInput = await driver.findElement(By.name('password'));
    await passwordInput.sendKeys('StrongPassword123!');

    // Find confirm password input and re-enter the password
    const confirmPasswordInput = await driver.findElement(By.name('confirm_password'));
    await confirmPasswordInput.sendKeys('StrongPassword123!');

    // Find the register button
    const registerButton = await driver.findElement(By.name('submit'));

    // Wait until the button is clickable
    await driver.wait(until.elementLocated(By.name('submit')), 5000);
    await driver.wait(until.elementIsVisible(registerButton), 5000);

    // Click the register button
    await registerButton.click();

    // **Assuming successful registration redirects to login page**
    // Check if login page title is present (adjust selector as needed)
    await driver.wait(until.titleContains('Login'), 5000);
    const loginTitle = await driver.findElement(By.css('h2')).getText();
    if (loginTitle && loginTitle.includes('Login')) {
      console.log('Registration successful (redirected to login page)');
    } else {
      console.error('Registration failed or did not redirect to login page.');
    }
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    //await driver.quit();
  }
}

testRegister();
