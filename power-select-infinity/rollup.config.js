import { Addon } from '@embroider/addon-dev/rollup';
import ts from 'rollup-plugin-ts';

const addon = new Addon({
    srcDir: 'src',
    destDir: 'dist'
});

export default {
    // This provides defaults that work well alongside `publicEntrypoints` below.
    // You can augment this if you need to.
    output: { ...addon.output(), hoistTransitiveImports: false },

    plugins: [
        // These are the modules that users should be able to import from your
        // addon. Anything not listed here may get optimized away.
        addon.publicEntrypoints(['components/**/*.ts', 'services/**/*.ts', 'index.ts']),

        // These are the modules that should get reexported into the traditional
        // "app" tree. Things in here should also be in publicEntrypoints above, but
        // not everything in publicEntrypoints necessarily needs to go here.
        addon.appReexports(['components/**/*.{js,ts}', 'services/**/*.{js,ts}']),

        ts({
            // can be changed to swc or other transpilers later
            // but we need the ember plugins converted first
            // (template compilation and co-location)
            transpiler: 'babel',
            browserslist: false,
            tsconfig: {
                fileName: 'tsconfig.json',
                hook: (config) => ({
                    ...config,
                    declaration: true
                })
            }
        }),

        // Follow the V2 Addon rules about dependencies. Your code can import from
        // `dependencies` and `peerDependencies` as well as standard Ember-provided
        // package names.
        addon.dependencies(),

        // Ensure that standalone .hbs files are properly integrated as Javascript.
        addon.hbs(),

        // addons are allowed to contain imports of .css files, which we want rollup
        // to leave alone and keep in the published output.
        addon.keepAssets(['**/*.css', '**/*.scss']),

        // Remove leftover build artifacts when starting a new build.
        addon.clean()
    ]
};
