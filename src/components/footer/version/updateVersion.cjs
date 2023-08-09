const axios = require("axios");
const fs = require("fs");

const url = process.env.GITHUB_API_URL;

axios
  .get(url)
  .then((response) => {
    const data = response.data;
    const latestRelease = data[0];
    const tag = latestRelease.tag_name;
    const version = { version: tag };

    fs.writeFileSync("./version/version.json", JSON.stringify(version));

    console.log(`A versão foi atualizada para: ${tag}`);
  })
  .catch((error) => {
    console.error(
      "Ocorreu um erro ao obter as informações da última release:",
      error
    );
  });