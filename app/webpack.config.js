import path from 'path';

const isProduction = (envVar) => envVar == 'production';

const __dirname = path.resolve();

// const babelOptions = {
//     presets: ['@babel/preset-env', '@babel/preset-react'],
// };

const buildConfig = (env, argv) => ({
  context: path.resolve(__dirname),
  devtool: 'inline-source-map',
  entry: {
    consumers: './src/consumers/index.ts',
    'mini-app': './src/mini-app/index.ts',
    producers: './src/producers/index.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'babel-loader',
          //   options: babelOptions,
          // },
          {
            loader: 'ts-loader',
            // options: {
            //   compilerOptions: {
            //     noEmit: false,
            //   },
            // },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  }
})

export default (env, argv) => {
  const config = buildConfig(env, argv);

  return config;
};
