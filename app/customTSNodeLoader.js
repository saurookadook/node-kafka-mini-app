import { register } from "node:module";
import { pathToFileURL } from "node:url";
register('ts-node/esm', pathToFileURL('./'));

// from https://github.com/TypeStrong/ts-node/discussions/1450#discussioncomment-1806115
// see also https://github.com/TypeStrong/ts-node/discussions/1450#discussion-3563207

// import { pathToFileURL } from 'node:url';
// import { resolve as resolveTs } from 'ts-node/esm';
// import * as tsConfigPaths from 'tsconfig-paths';

// const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
// // console.log(
// //   ''.padStart(80, '='),
// //   '\n',
// //   { absoluteBaseUrl, paths },
// //   '\n',
// //   ''.padStart(80, '='),
// // );
// const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

// export function resolve(specifier, ctx, defaultResolve) {
//   const match = matchPath(specifier);
//   return match
//     ? resolveTs(pathToFileURL(`${match}`).href, ctx, defaultResolve)
//     : resolveTs(specifier, ctx, defaultResolve);
// }

// export { load, transformSource } from 'ts-node/esm';
