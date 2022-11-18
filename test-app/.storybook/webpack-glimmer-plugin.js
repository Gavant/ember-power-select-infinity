const { preprocessEmbeddedTemplates } = require('ember-template-imports/lib/preprocess-embedded-templates.js');
const { TEMPLATE_TAG_NAME, TEMPLATE_TAG_PLACEHOLDER } = require('ember-template-imports/lib/util.js');
const fs = require('fs').promises;
const path = require('path');
const { sources } = require('webpack');
const FCCT_EXTENSION = /\.g([jt]s)$/;

function resolutionFor(originalId) {
    return {
        id: originalId.replace(FCCT_EXTENSION, '.$1'),
        meta: {
            fccts: { originalId }
        }
    };
}

async function preprocessTemplates(id) {
    let ember = (await import('ember-source')).default;
    let contents = await fs.readFile(id, 'utf-8');

    // This is basically taken directly from `ember-template-imports`
    let result = preprocessEmbeddedTemplates(contents, {
        relativePath: path.relative('.', id),

        getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
        getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

        templateTag: TEMPLATE_TAG_NAME,
        templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

        includeSourceMaps: true,
        includeTemplateTokens: true
    });

    return result.output;
}
const plugin = class GlimmerFirstClassTemplatesPlugin {
    static name = 'glimmer-first-class-templates-plugin';
    // Define `apply` as its prototype method which is supplied with compiler as its argument
    apply(compiler) {
        console.log('In custom plugin');
        const pluginName = GlimmerFirstClassTemplatesPlugin.name;
        // Tapping to the "thisCompilation" hook in order to further tap
        // to the compilation process on an earlier stage.
        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            // Tapping to the assets processing pipeline on a specific stage.
            compilation.hooks.processAssets.tap(
                {
                    name: pluginName,

                    // Using one of the later asset processing stages to ensure
                    // that all assets were already added to the compilation by other plugins.
                    stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
                },
                async (assets) => {
                    for (let i in assets) {
                        console.log(i);
                        if (FCCT_EXTENSION.test(i)) {
                            const asset = compilation.getAsset(i); // <- standardized version of asset object
                            const contents = asset.source.source(); // <- standardized way of getting asset source
                            const rawSource = new sources.RawSource(contents);
                            const preprocess = await preprocessTemplates(i);
                            // standardized way of updating asset source
                            compilation.updateAsset(i, preprocess);
                        }
                    }
                }
            );
        });
    }
};

module.exports = plugin;
