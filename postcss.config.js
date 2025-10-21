module.exports = {
  // Switch to the array format for more explicit plugin loading
  plugins: [
    // 1. Tailwind CSS (This should automatically resolve to the correct PostCSS plugin)
    'tailwindcss', 
    
    // 2. Autoprefixer
    'autoprefixer',
  ],
};
