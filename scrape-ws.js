import scrape from 'website-scraper';
import PuppeteerPlugin from 'website-scraper-puppeteer';


//const websiteUrl = 'https://www.coolblue.nl'; 
const websiteUrl = 'https://effect.network'; 
 
scrape({ 
    urls: [websiteUrl], 
    urlFilter: function (url) { 
        return url.indexOf(websiteUrl) === 0; 
    }, 
    recursive: true, 
    maxDepth: 50, 
    prettifyUrls: true, 
    filenameGenerator: 'bySiteStructure', 
    directory: './website-cache',
    plugins: [new PuppeteerPlugin({
        scrollToBottom: { timeout: 10000, viewportN: 10 },
        blockNavigation: true,
	     })
	     ]
}).then((data) => { 
    console.log("Website succesfully downloaded"); 
}).catch((err) => { 
    console.log("An error occurred", err); 
}); 
