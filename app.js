const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
console.log(path.join(__dirname, "/dist"));
app.use(express.static(path.join(__dirname, "/dist")));

const modifyHTMLContent = (data,{img,title,url,description}) => {
  // Modify the HTML content to include the desired header
    data = data.replace(
    /<meta property="og:image" content=".*?"/i,
    `<meta property="og:image" content="${img}"`
  );
  data = data.replace(
    /<meta property="twitter:image" content=".*?"/i,
    `<meta property="twitter:image" content="${img}"`
  );
  
  data = data.replace(
    /<meta property="og:title" content=".*?"/i,
    `<meta property="og:title" content="${title}"`
  );
  data = data.replace(
    /<meta property="og:url" content=".*?"/i,
    `<meta property="og:url" content="${url}"`
  );
  data = data.replace(
    /<meta property="og:description" content=".*?"/i,
    `<meta property="og:description" content="${description}"`
  );
  
  data = data.replace(
    /<meta property="twitter:title" content=".*?"/i,
    `<meta property="twitter:title" content="${title}"`
  );
  data = data.replace(
    /<meta property="twitter:url" content=".*?"/i,
    `<meta property="twitter:url" content="${url}"`
  );
  data = data.replace(
    /<meta property="twitter:description" content=".*?"/i,
    `<meta property="twitter:description" content="${description}"`
  );
  
  data = data.replace(
    /<title>.*?<\/title>/i,
    `<title>${title}</title>`
  );
  data = data.replace(
    /<link rel="canonical" href=".*?"/i,
    `<link rel="canonical" href="${url}"`
  );
  data = data.replace(
    /<meta name="description" content=".*?"/i,
    `<meta name="description" content="${description}" />`
  );
  return data;
};
app.get("/product/:id",async(req,res)=>{
    console.log(req.params?.id)
    console.log("Requested path:", req.path);
    const filePath = path.join(__dirname, "/dist", "index.html");
    console.log(filePath, "filePath");
    fs.readFile(filePath, "utf8", async (err, data) => {
        let updatedData;
      if (err) {
        // Handle file not found or read error
        console.error(err);
        res.status(404).send("File not found");
      } else {
        if (req.path.startsWith("/product/")) {
         
          const resData = await fetch(
            `https://dummyjson.com/products/${req.params?.id}`
          );
          const res = await resData.json();
              console.log({data})
              updatedData= modifyHTMLContent(data,{img:res?.thumbnail,description:res.description,title:res?.title,url:`/product/${res?.id}`}) 
  
        }
        console.log(data,"data")
  
        // Serve the modified HTML file content
        res.setHeader("Content-Type", "text/html");
        res.send(updatedData);
      }
    })
    // res.send("teting")
})
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
