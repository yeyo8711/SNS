const fs = require("fs");
module.exports = generateMetadata = (domain) => {
  const JSON = `{
  "description": "SNS", 
  "external_url": "https://localhost:3000/images/${domain}.svg", 
  "image": "https://localhost:3000/images/${domain}.svg", 
  "name": "${domain}.inu" 
}`;
  fs.writeFile(`./metadata/${domain}.json`, JSON, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
