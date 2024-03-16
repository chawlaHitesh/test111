const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
console.log(path.join(__dirname, "/dist"));
app.use(express.static(path.join(__dirname, "/dist")));

const modifyHTMLContent = (htmlContent) => {
  // Modify the HTML content to include the desired header
  htmlContent = htmlContent.replace(
    /<head>/,
    `<head>
        <title>Your Page Title</title>
        <meta name="description" content="Description of your page for search engines">
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="https://yourwebsite.com">
        <meta property="og:title" content="Your Page Title">
        <meta property="og:description" content="Description of your page for Facebook">
        <meta property="og:image" content="https://yourwebsite.com/your-image.jpg">
        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="https://yourwebsite.com">
        <meta property="twitter:title" content="Your Page Title">
        <meta property="twitter:description" content="Description of your page for Twitter">
        <meta property="twitter:image" content="https://yourwebsite.com/your-image.jpg">
        </head>`
  );
  return htmlContent;
};
app.get("*", (req, res) => {
  console.log("Requested path:", req.path);
  const filePath = path.join(__dirname, "/dist", "index.html");
  console.log(filePath, "filePath");
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      // Handle file not found or read error
      console.error(err);
      res.status(404).send("File not found");
    } else {
      if (req.path.startsWith("/product/")) {
        const productId = req.path.split("/")[2];
        console.log(productId);
        const resData = await fetch(
          `https://dummyjson.com/products/${productId}`
        );
        const res = await resData.json();
            console.log({data})
            data = data.replace(
                /<meta property="og:image" content=".*?"/i,
                `<meta property="og:image" content="${res?.thumbnail}"`
              );
              data = data.replace(
                /<meta property="twitter:image" content=".*?"/i,
                `<meta property="twitter:image" content="${res?.thumbnail}"`
              );
              
              data = data.replace(
                /<meta property="og:title" content=".*?"/i,
                `<meta property="og:title" content="${res?.title}"`
              );
              data = data.replace(
                /<meta property="og:url" content=".*?"/i,
                `<meta property="og:url" content="/product/${res?.id}"`
              );
              data = data.replace(
                /<meta property="og:description" content=".*?"/i,
                `<meta property="og:description" content="${res.description}"`
              );
              
              data = data.replace(
                /<meta property="twitter:title" content=".*?"/i,
                `<meta property="twitter:title" content="${res?.title}"`
              );
              data = data.replace(
                /<meta property="twitter:url" content=".*?"/i,
                `<meta property="twitter:url" content="/product/${res?.id}"`
              );
              data = data.replace(
                /<meta property="twitter:description" content=".*?"/i,
                `<meta property="twitter:description" content="${res.description}"`
              );
              
              data = data.replace(
                /<title>.*?<\/title>/i,
                `<title>${res?.title}</title>`
              );
              data = data.replace(
                /<link rel="canonical" href=".*?"/i,
                `<link rel="canonical" href="/product/${res?.id}"`
              );
              data = data.replace(
                /<meta name="description" content=".*?"/i,
                `<meta name="description" content="${res?.description}" />`
              );
              
          
          
          

      }
      console.log(data,"data")

      // Serve the modified HTML file content
      res.setHeader("Content-Type", "text/html");
      res.send(data);
    }
  });
});
app.listen(5000, () => {
  console.log(`Example app listening on port ${5000}`);
});
