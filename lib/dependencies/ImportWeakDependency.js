/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const makeSerializable = require("../util/makeSerializable");
const ModuleDependency = require("./ModuleDependency");

/** @typedef {import("webpack-sources").ReplaceSource} ReplaceSource */
/** @typedef {import("../Dependency")} Dependency */
/** @typedef {import("../DependencyTemplate").DependencyTemplateContext} DependencyTemplateContext */

class ImportWeakDependency extends ModuleDependency {
	constructor(request, range) {
		super(request);

		this.range = range;
		this.weak = true;
	}

	get type() {
		return "import() weak";
	}
}

makeSerializable(
	ImportWeakDependency,
	"webpack/lib/dependencies/ImportWeakDependency"
);

ImportWeakDependency.Template = class ImportDependencyTemplate extends ModuleDependency.Template {
	/**
	 * @param {Dependency} dependency the dependency for which the template should be applied
	 * @param {ReplaceSource} source the current replace source which can be modified
	 * @param {DependencyTemplateContext} templateContext the context object
	 * @returns {void}
	 */
	apply(
		dependency,
		source,
		{ runtimeTemplate, module, moduleGraph, chunkGraph, runtimeRequirements }
	) {
		const dep = /** @type {ImportWeakDependency} */ (dependency);
		const content = runtimeTemplate.moduleNamespacePromise({
			chunkGraph,
			module: moduleGraph.getModule(dep),
			request: dep.request,
			strict: module.buildMeta.strictHarmonyModule,
			message: "import() weak",
			weak: true,
			runtimeRequirements
		});

		source.replace(dep.range[0], dep.range[1] - 1, content);
	}
};

module.exports = ImportWeakDependency;
