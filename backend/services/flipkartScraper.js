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
    $('table tr').each((_, row) => {
      const tds = $(row).find('td');
      if (tds.length === 2) {
        const key = $(tds[0]).text().trim();
        const val = $(tds[1]).find('li').text().trim() || $(tds[1]).text().trim();
        if (key && val && key.length < 50 && !val.includes('More Details')) {
          specifications[key] = val;
        }
      }
    });

    // Attempt 2: Extract from window.__INITIAL_STATE__ (Most robust for modern Flipkart)
    if (Object.keys(specifications).length === 0) {
      const stateMatch = detailHtml.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*<\/script>/s);
      if (stateMatch) {
        try {
          const state = JSON.parse(stateMatch[1]);
          
          // Agnostic Specification Pair Extractor (Most resilient to Flipkart's dynamic JSON keys)
          const stateStr = stateMatch[1];
          const allTexts = [];
          const textRegex = /"text":\s*(?:"([^"]+)"|\["([^"]+)"\])/g;
          let m;
          while ((m = textRegex.exec(stateStr)) !== null) {
              const val = m[1] || m[2];
              if (val) allTexts.push({ val: val.trim(), index: m.index });
          }

          // Heuristic: Specification labels and values are usually within 400 characters of each other in the JSON
          const keywords = ['Model', 'Type', 'Size', 'RAM', 'ROM', 'Memory', 'Display', 'Processor', 'Camera', 'SIM', 'Color', 'Dimensions', 'OS', 'Battery', 'Feature', 'Resolution', 'Weight', 'Width', 'Height', 'Depth'];
          
          for (let i = 0; i < allTexts.length - 1; i++) {
              const t1 = allTexts[i];
              const t2 = allTexts[i+1];
              
              if (t2.index - t1.index < 400) {
                  const checkPair = (label, value) => {
                      // Filter for common specification-like labels (Model, Name, Type, Features, RAM, ROM, etc.)
                      const isNoise = 
                        label.includes("Fee") || label.includes("₹") || label.includes("Delivery") ||
                        label.includes("Resolution in") || label.includes("issue resolution") ||
                        label.includes("Selected Color") || label.includes("View Similar") ||
                        label.includes("Trust Shield") || label.includes("installation") ||
                        label.includes("attributes and feature");

                      const looksLikeSpec = 
                        !isNoise &&
                        label.length > 2 && label.length < 50 && 
                        value.length > 0 && label !== value &&
                        !label.includes("Buy") && !label.includes("Add") && !label.includes("Rating");
                      
                      if (looksLikeSpec) {
                          // Common spec patterns (broadened)
                          const isTargetSpec = keywords.some(k => label.toLowerCase().includes(k.toLowerCase()));
                          
                          if (isTargetSpec) {
                              // Clean value: remove leading bullets, trim
                              const cleanValue = value.replace(/^[•\-\s]+/, '').trim();
                              if (!specifications[label] || specifications[label].length < cleanValue.length) {
                                  specifications[label] = cleanValue;
                              }
                          }
                      }
                  };

                  checkPair(t1.val, t2.val);
                  checkPair(t2.val, t1.val);
              }
          }
        } catch (e) {
          console.error("Error parsing specs with agnostic extractor:", e.message);
        }
      }
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

    // Find all images that contain 'rukminim' and are product images '/image/'
    $('img').each((_, el) => {
      let src = $(el).attr('src');
      if (src && src.includes('rukminim') && src.includes('/image/')) {
        images.push(src.replace(/\/image\/\d+\/\d+\//, '/image/800/800/'));
      }
    });

    // Look for background images too
    $('*[style*="rukminim"]').each((_, el) => {
      let bg = $(el).css('background-image') || $(el).attr('style') || '';
      let match = bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1].includes('rukminim') && match[1].includes('/image/')) {
         images.push(match[1].replace(/\/image\/\d+\/\d+\//, '/image/800/800/'));
      }
    });

    // Fallback if no specific img tags found but there are images in the raw HTML JSON blobs
    if (images.length === 0) {
      const regex = /"url":"(https:\/\/rukminim[^\"]*?\/image\/[^\"]*?)"/g;
      let match;
      while ((match = regex.exec(detailHtml)) !== null) {
        images.push(match[1].replace(/{@width}/g, '800').replace(/{@height}/g, '800').replace(/\/\d+\/\d+\//, '/800/800/'));
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

/**
 * Searches Flipkart for a query and returns a list of candidate products.
 * @param {string} query 
 * @returns {Promise<{success: boolean, data: any[]}>}
 */
async function searchFlipkart(query) {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    const { data: html } = await axios.get(searchUrl, { headers: HEADERS });
    const $ = cheerio.load(html);
    const results = [];

    // Common Flipkart selectors for product info
    const productContainers = [
      'div._1AtVbE', // Search result row
      'div._4ddWXP', // Grid item
      'div._1sdMMS'  // Alt grid
    ];

    for (const selector of productContainers) {
      $(selector).each((_, el) => {
        const title = $(el).find('a.s1Q9rs, a.IRpwTa, div._4rR01T, a._1fQZEK div._4rR01T').first().text().trim();
        const price = $(el).find('div._30jeq3, div._30jeq3._1_WHN1').first().text().trim();
        const rating = $(el).find('div._3LWZlK').first().text().trim();
        
        if (title && price) {
          results.push({
            title,
            price,
            rating: rating || '4.0',
            discountPrice: $(el).find('div._3I9_wc').first().text().trim(),
            discountPct: $(el).find('div._3Ay6Sb').first().text().trim(),
            reviewCount: $(el).find('span._2_R_oD, span._2dB_C7').first().text().trim()
          });
        }
      });
      if (results.length > 0) break;
    }

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { fetchLiveProductDetails, searchFlipkart };

