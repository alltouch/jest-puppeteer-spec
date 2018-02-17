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
    20000
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
    20000
  );

  test(
    "assert that redirect from home page is correctly",
    async () => {
      await page.goto(HOME);
      await page.click(".main-navbar .main-menu li a[href='/']");
      const titleHome = await page.title();
      expect(titleHome).toBe("Solar Analyze | Home");

      await page.goto(HOME);
      await page.click(".main-navbar .main-menu li a[href='/about-us.html']");
      const titleAboutUs = await page.title();
      expect(titleAboutUs).toBe("Solar Analyze | About Us");

      await page.goto(HOME);
      await page.click(".main-navbar .main-menu li a[href='/faq.html']");
      const titleFAQ = await page.title();
      expect(titleFAQ).toBe("Solar Analyze | FAQ");

      await page.goto(HOME);
      await page.click(".main-navbar .main-menu li a[href='/contact-us.html']");
      const titleContactUs = await page.title();
      expect(titleContactUs).toBe("Solar Analyzer | Contact Us");

      await page.goto(HOME);
      await page.click(".main-navbar .main-menu li a[href='/form.html']");
      const titleForm = await page.title();
      expect(titleForm).toBe("Solar Analyze | Form");
    },
    20000
  );

  test(
    "assert that copyrights text and href is correct",
    async () => {
      await page.goto(HOME);
      const allResultsSelector = ".copyright a";

      const links = await page.evaluate(allResultsSelector => {
        const list = Array.from(document.querySelectorAll(allResultsSelector));

        return list.map(link => {
          const linkText = link.textContent.split("|")[0].trim();
          return { text: linkText, href: link.href };
        });
      }, allResultsSelector);

      const expected = [
        {
          text: "Privacy Policy",
          href: "https://quote.solaranalyzer.com/privacy-policy.html"
        },
        {
          text: "Terms of Use",
          href: "https://quote.solaranalyzer.com/terms-of-use.html"
        }
      ];

      expect(links).toEqual(expected);
    },
    20000
  );

  test(
    "assert that privacy policy and terms of use redirect is correct",
    async () => {
      await page.goto(HOME);
      await page.click(".copyright a[href='/privacy-policy.html']");
      const titlePrivacy = await page.title();
      expect(titlePrivacy).toBe("Solar Analyzer | Privacy Policy");

      await page.goto(HOME);
      await page.click(".copyright a[href='/terms-of-use.html']");
      const titleTerms = await page.title();
      expect(titleTerms).toBe("Solar Analyzer | Terms Of Use");
    },
    20000
  );
});
