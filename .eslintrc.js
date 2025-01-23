// https://docs.expo.dev/guides/using-eslint/
import eslintConfigPrettier from "eslint-config-prettier";
module.exports = {
  extends: ["expo", "prettier", "eslint-config-prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
