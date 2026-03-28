const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
};

/**
 * Searches Flipkart for the product title and extracts its full details.
 * @param {string} query The product title to search
 * @returns {Promise<{ images: string[], specifications: Object, description: string }>}
 */
async function fetchLiveProductDetails(query) {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    const { data: searchHtml } = await axios.get(searchUrl, { headers: HEADERS });
    
    const $search = cheerio.load(searchHtml);
    let productUrl = '';
    
    // Find the first product link
    const linkKeys = ['a[rel="noopener noreferrer"]', 'a._1fQZEK', 'a.s1Q9rs', 'a.IRpwTa', 'a._2UzuFa'];
    for (const selector of linkKeys) {
       $search(selector).each((_, el) => {
         const href = $search(el).attr('href');
         if (href && href.includes('/p/it') && !productUrl) {
           productUrl = 'https://www.flipkart.com' + href;
         }
       });
       if (productUrl) break;
    }

    if (!productUrl) {
      throw new Error("No matching product found on Flipkart for the query.");
    }

    // Fetch the product page
    const { data: detailHtml } = await axios.get(productUrl, { headers: HEADERS });
    const $ = cheerio.load(detailHtml);

    // 1. EXTRACT SPECIFICATIONS
    // Different layouts exist on Flipkart. Usually, specifications are in table format.
    const specifications = {};
    
    // Attempt 1: Standard specs table
    $('table._14cfVK tbody tr').each((_, row) => {
      const key = $(row).find('td._1hKmbr').text().trim();
      const val = $(row).find('td.URwL2w ul li').text().trim() || $(row).find('td.URwL2w').text().trim();
      if (key && val) specifications[key] = val;
    });

    // Attempt 2: Generic Row approach (if _14cfVK fails)
    if (Object.keys(specifications).length === 0) {
      $('.row').each((_, row) => {
        const tds = $(row).find('td');
        if (tds.length === 2) {
          const key = $(tds[0]).text().trim();
          const val = $(tds[1]).text().trim();
          if (key && val && key.length < 50) {
             specifications[key] = val;
          }
        }
      });
    }

    // 2. EXTRACT HIGHLIGHTS / DESCRIPTION
    const highlights = [];
    $('div._2418kt ul li, ul._1mXcCf li, div.X3BRvc ul li').each((_, el) => {
       const text = $(el).text().trim();
       if (text) highlights.push(text);
    });

    // Combine highlights into a generic description
    let description = highlights.length > 0 
      ? highlights.map(h => `• ${h}`).join('\n') 
      : $('.MocXoX p, ._1an1q2').text().trim() || `Authentic product fetched directly from Flipkart. ${query} is curated for quality and value.`;

    // 3. EXTRACT MULTIPLE HIGH-RES IMAGES
    const images = [];
    // Mobile/Slider Layout
    $('.q6DClP').each((_, el) => {
      let bg = $(el).css('background-image') || $(el).attr('style') || '';
      let match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match) {
         images.push(match[1].replace(/\/(128\/128|50\/50|image\/\d+\/\d+)\//, '/image/800/800/'));
      } else {
         let src = $(el).find('img').attr('src');
         // convert thumbnail to high-res
         if (src && src.includes('rukminim')) {
           images.push(src.replace(/\/(128\/128|50\/50|image\/\d+\/\d+)\//, '/image/800/800/'));
         }
      }
    });

    // Desktop Carousel Layout
    $('li._20A0O0 img, li._1N1M1r img').each((_, el) => {
      let src = $(el).attr('src');
      if (src && src.includes('rukminim')) {
         images.push(src.replace(/\/(128\/128|50\/50|image\/\d+\/\d+)\//, '/image/800/800/'));
      }
    });

    // Fallback if no specific img tags found but there are images in the raw HTML script tags
    if (images.length === 0) {
      const regex = /"url":"(https:\/\/rukminim[^\"]*?)"/g;
      let match;
      while ((match = regex.exec(detailHtml)) !== null) {
        images.push(match[1].replace(/{@width}/g, '800').replace(/{@height}/g, '800'));
      }
    }

    const uniqueImages = [...new Set(images)].slice(0, 8); // Top 8 high res images

    // Prepare Return Data
    return {
      success: true,
      data: {
        images: uniqueImages,
        specifications: Object.keys(specifications).length > 0 ? specifications : { "Information": "Specifications not explicitly provided by Flipkart for this item." },
        description: description
      }
    };

  } catch (error) {
    console.error("Live Fetch Error:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { fetchLiveProductDetails };
