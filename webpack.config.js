const path = require('path');

/**
 * --------------------------------------------------------------------------
 * W E B P A C K   C O N F I G U R A T I O N
 * --------------------------------------------------------------------------
 * Purpose: Transmutation of JSX to ES5/ES6
 * Output: dist/bundle.js
 * --------------------------------------------------------------------------
 */

module.exports = {
  // [Input] The Ignition Sequence
  entry: './src/index.js',
  
  // [Output] The Transmuted Artifact
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  
  // [Mode] Development for clarity, Production for efficiency
  mode: 'development',
  
  // [Modules] Rules for processing different materials
  module: {
    rules: [
      {
        // Target .js and .jsx files
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            // Presets for React and Modern JS
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  
  // [Resolution] Allow importing without specifying extensions
  resolve: {
    extensions: ['.js', '.jsx']
  }
};