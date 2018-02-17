import puppeteer from "puppeteer";

const HOME = "https://quote.solaranalyzer.com/";

let page;
let browser;
const width = 1280;
const height = 720;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});

afterAll(() => {
  browser.close();
});

describe("Navigation", () => {
  test(
    "assert that logo redirect is correct",
    async () => {
      await page.goto(HOME);
      const logo = await page.$eval("header a.logo", el => (el ? true : false));
      expect(logo).toBe(true);
      await page.click(".header a.logo");
      const title = await page.title();
      expect(title).toBe("Solar Analyze | Home");
    },
    16000
  );

  test(
    "assert that navigations text and href is correct",
    async () => {
      await page.goto(HOME);
      const allResultsSelector = ".main-navbar .main-menu li a";

      const links = await page.evaluate(allResultsSelector => {
        const list = Array.from(document.querySelectorAll(allResultsSelector));

        return list.map(link => {
          const linkText = link.textContent.split("|")[0].trim();
          return { text: linkText, href: link.href };
        });
      }, allResultsSelector);

      const expected = [
        { text: "Home", href: "https://quote.solaranalyzer.com/" },
        {
          text: "About Us",
          href: "https://quote.solaranalyzer.com/about-us.html"
        },
        {
          text: "FAQ",
          href: "https://quote.solaranalyzer.com/faq.html"
        },
        {
          text: "Contact Us",
          href: "https://quote.solaranalyzer.com/contact-us.html"
        },
        {
          text: "Get Started",
          href: "https://quote.solaranalyzer.com/form.html"
        }
      ];

      expect(links).toEqual(expected);
    },
    16000
  );
});
