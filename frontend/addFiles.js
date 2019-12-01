const fs = require("fs");

fs.copyFile("netlify.toml", "build/netlify.toml", err => {
  if (err) throw err;
  console.log("Successfully added netlify.toml to build folder");
});
