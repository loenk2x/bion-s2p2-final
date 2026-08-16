// shared/ lives one level above mobile/, outside the folder Metro watches by
// default. Two settings bring it in without copying a single file:
//
//   watchFolders           tells Metro to also watch the repository root, so
//                          edits under shared/ trigger a rebuild
//   resolver.nodeModulesPaths   keeps module resolution anchored to mobile's
//                          own node_modules even though watchFolders now
//                          includes the repo root
//
// The "@shared/xxx" specifier itself needs a custom resolveRequest, not
// resolver.extraNodeModules. extraNodeModules only rewrites the *package*
// portion of a specifier, and Metro parses "@shared/activities" as a scoped
// package named "@shared/activities" with an empty subpath (the same rule
// npm uses for "@scope/name") - not as package "@shared" with subpath
// "activities". Mapping extraNodeModules["@shared"] therefore never gets
// consulted and every "@shared/*" import fails to resolve. This was proven
// by running `npx expo export --platform android`, which failed with
// "Unable to resolve module @shared/activities" until resolveRequest below
// was added; see the "Metro dan shared/" section of the repository README.

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");
const sharedRoot = path.resolve(workspaceRoot, "shared");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

const { resolveRequest: defaultResolveRequest } = config.resolver;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@shared" || moduleName.startsWith("@shared/")) {
    const rest = moduleName.slice("@shared".length); // "" or "/activities"
    const target = path.join(sharedRoot, "." + rest);
    return (defaultResolveRequest || context.resolveRequest)(context, target, platform);
  }
  return (defaultResolveRequest || context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
