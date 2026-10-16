const js = require("@eslint/js");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
    {
        files: ["**/*.js"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            sourceType: "commonjs",
        },
    },
]);
