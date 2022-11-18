const { preprocessEmbeddedTemplates } = require('ember-template-imports/lib/preprocess-embedded-templates.js');
const { TEMPLATE_TAG_NAME, TEMPLATE_TAG_PLACEHOLDER } = require('ember-template-imports/lib/util.js');
const path = require('path');

module.exports = async function (source) {
    let ember = (await import('ember-source')).default;
    let result = preprocessEmbeddedTemplates(source, {
        relativePath: path.relative('.', this.resourcePath),

        getTemplateLocalsRequirePath: ember.absolutePaths.templateCompiler,
        getTemplateLocalsExportPath: '_GlimmerSyntax.getTemplateLocals',

        templateTag: TEMPLATE_TAG_NAME,
        templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

        includeSourceMaps: true,
        includeTemplateTokens: true
    });
    console.log(result.output);
    return result.output;
};
