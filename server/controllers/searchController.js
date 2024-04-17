const puppeteer = require('puppeteer');

const searchController = {};

searchController.searchZipRecruiter = async (req, res, next) => {
  res.locals.now = 'test';
  console.log(
    'Inside searchCONTROLLER --->',
    req.body,
    req.body.jobLocation,
    req.body.jobTitle
  );

  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: false,
    });

    const page = await browser.newPage();
    await page.goto(
      `https://www.ziprecruiter.com/jobs-search?search=${req.body.jobTitle}&location=${req.body.jobLocation}&radius=${req.body.jobRadius}`
    );

    const data = await page.evaluate(() => {
      console.log('DATATA');
      const parentElements = document.querySelectorAll(
        '.group.flex.w-full.flex-col.text-black'
      ); // Assuming each job listing is encapsulated within a parent element with class 'group.flex.w-full.flex-col.text-black'
      const results = [];

      parentElements.forEach((parentElement) => {
        const jobTitleElement = parentElement.querySelector(
          'h2.font-bold.text-black.text-header-sm a'
        );
        const jobTitle = jobTitleElement
          ? jobTitleElement.textContent.trim()
          : 'Job title not found';

        const priceTitleElement = parentElement.querySelector(
          'div.flex.items-center div.mr-8 p'
        );
        const priceTitle = priceTitleElement
          ? priceTitleElement.textContent.trim()
          : 'Salary not found';

        // Selecting anchor elements directly by their href attribute
        const quickApplyLinkElement = parentElement.querySelector(
          'a[href^="https://www.ziprecruiter.com/"]'
        );
        const quickApplyLink = quickApplyLinkElement
          ? quickApplyLinkElement.href
          : null;

        results.push({ jobTitle, priceTitle, quickApplyLink });
      });

      return results;
    });
    res.locals.zipResults = data;
    await browser.close();
    return next();
  } catch (error) {
    next(error);
  }
};

module.exports = searchController;
