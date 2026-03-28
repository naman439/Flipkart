const axios = require('axios');
const cheerio = require('cheerio');

async function debugScrape(query) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      }
    });
    const $ = cheerio.load(data);
    
    const results = [];
    
    // Flipkart usually has two main layouts: Grid and List
    // We'll look for common patterns
    
    // Title discovery: Find elements that contain "iPhone" (case-insensitive)
    const possibleTitles = [];
    $('*').each((i, el) => {
      const text = $(el).text().trim();
      if (text.toLowerCase().includes('iphone') && text.length > 5 && text.length < 100) {
        const tagName = $(el).prop('tagName');
        const className = $(el).attr('class');
        possibleTitles.push({ tagName, className, text });
      }
    });

    console.log('Possible Title Elements:', possibleTitles.slice(0, 10));

  } catch (e) {
    console.error('Error:', e.message);
  }
}

debugScrape('iphone 15');
