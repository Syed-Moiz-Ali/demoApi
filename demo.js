const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');

const app = express();

async function scrapeWebsite(type) {
  const browser = await puppeteer.launch({ headless: 'new' }); // Launch a headless browser
  const page = await browser.newPage();
  
  // Set a random User-Agent to mimic different browsers/devices
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36';
  await page.setUserAgent(userAgent);

  const baseURL = 'https://spankbang.party/'; // Replace with your base URL
  const URL = `${baseURL}${type}`;

  // Emulate human-like behavior (e.g., waiting, navigating)
  await page.goto(URL, { waitUntil: 'networkidle2' });
  await page.waitForTimeout(3000); // Add delay to mimic human behavior
  
  const html = await page.content();
  const $ = cheerio.load(html);

  const allCoupon = [];

  $(".video-list > .video-item").each(function (index, element) {
    const title = $(this).find(".n ").text();

    const id = $(this).find(" .thumb").attr("href");
    const dataId = $(this).attr("data-id");
    const image = $(this).find(" .thumb > picture > img").attr("data-src");
    const preview = $(this)
      .find(" .thumb > picture > img")
      .attr("data-preview");
    const duration = $(this).find(".thumb > .t > .l ").text();
    const quality = $(this)
      .find(".thumb > .t > .h")

      .text();

    const percentage = $(this).find(".stats > .d").text();
    const views = $(this).find(" .stats > .v ").text();
    const time = $(this).find(" .stats > .v ").text();

    allCoupon.push({
      title,
      dataId,
      id,
      image,
      preview,
      duration,
      quality,
      percentage,
      views,
      time,
    });
  });

  await browser.close();
  return allCoupon;
}

app.get('/api/trending', async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite('trending_videos');
    res.json(scrapedData); // Send scraped data as JSON response
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});
app.get('/api/upcoming', async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite('upcoming');
    res.json(scrapedData); // Send scraped data as JSON response
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});
app.get('/api/new', async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite('new_videos');
    res.json(scrapedData); // Send scraped data as JSON response
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});
app.get('/api/popular', async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite('most_popular');
    res.json(scrapedData); // Send scraped data as JSON response
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

const PORT = 3000; // Replace with your desired port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
