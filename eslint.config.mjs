import nextVitals from "eslint-config-next/core-web-vitals";

const config = [{ ignores: ["frontend/**", "**/lovable-export/**", "**/lovable-dump/**"] }, ...nextVitals];

export default config;
