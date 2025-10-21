module.exports = {
  plugins: [
    // CRITICAL FIX: Use 'require' to explicitly load the Tailwind PostCSS plugin.
    // This tells PostCSS exactly where to find the Tailwind plugin logic,
    // bypassing environment confusion over string loading.
    require('tailwindcss'),
    
    // Autoprefixer remains loaded explicitly.
    require('autoprefixer'),
  ],
};
