module.exports = {
  // Use the 'plugins' object structure which is standard for PostCSS 8+
  plugins: {
    // 1. Tailwind CSS plugin
    // This tells PostCSS to look for the tailwind.config.js file and apply the rules.
    tailwindcss: {},
    
    // 2. Autoprefixer plugin
    // This automatically adds vendor prefixes to CSS rules for browser compatibility.
    autoprefixer: {},
  },
};
