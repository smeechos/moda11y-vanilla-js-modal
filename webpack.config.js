/**
 * Webpack Config.
 *
 * @package @smeechos/moda11y-vanilla-js-modal
 */

const path                     = require( 'path' );
const MiniCssExtractPlugin     = require( 'mini-css-extract-plugin' );
const TerserPlugin             = require( "terser-webpack-plugin" );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

// When the --watch argument is passed we increase build performance by opting out of optimizations like minification and source maps.
const optimize = process.argv.indexOf( '--watch' ) === -1;

const config = {
  mode: 'production',
  entry: {
    'moda11y-css': './scss/main.scss',
  },
  optimization: {
    minimize: optimize,
    minimizer: [ new TerserPlugin() ],
  },
  plugins: [
    new MiniCssExtractPlugin(
        {
          filename: '../styles/[name].min.css'
        }
    ),
    new RemoveEmptyScriptsPlugin(),
  ],
  output: { // phpcs:ignore
    filename: '[name].min.js', // phpcs:ignore
    path: path.resolve( __dirname, 'dist/scripts' ), // phpcs:ignore
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: ! optimize
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: ! optimize
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: ! optimize
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        exclude: [
          path.resolve( __dirname, 'images' )
        ],
        generator: {
          filename: '../fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        type: 'asset/resource',
        exclude: [
          path.resolve( __dirname, 'fonts' )
        ],
        generator: {
          filename: '../images/[name][ext]'
        }
      }
    ],
  },
};

if ( ! optimize ) {
  config.devtool = 'source-map'
}

module.exports = config;
