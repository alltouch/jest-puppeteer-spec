import puppeteer from "puppeteer";

const APP = "https://quote.solaranalyzer.com/";

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
      await page.goto(APP);
      await page.waitForSelector(".header a.logo");
      await page.click(".header a.logo");
      const title = await page.title();
      expect(title).toBe("Solar Analyze | Home");
    },
    16000
  );
});
