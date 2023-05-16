'use strict';

module.exports = class UrlParamsHandler {
  queries = {};
  constructor(deps = []) {
    this.deps = deps;
    this.relativePaths = this.#splitDeps();
  }

  #splitDeps() {
    // A dependency with query parameters looks like the following
    // './module.js?v=2.2.2'
    const fixedDeps = [];
    for (const dep of this.deps) {
      // To only get the path we split the string at a question mark
      const relativeFilePath = dep.split('?')[0];
      // Now only the path is left
      // './module.js'
      fixedDeps.push(relativeFilePath);

      // find all queries and fill the queries array
      this.queries[relativeFilePath] = {};
      // fills the queries object with all queryParams from the current relativeFilePath
      // example { "./module.js": { v: "2.2.2" } }
      this.#getQueries(dep, relativeFilePath);
    }

    return fixedDeps;
  }

  #getQueries(dep, relativeFilePath) {
    // get index from the first question mark
    const firstQuestionMarkIndex = dep.indexOf('?');
    // get the queryParameter string starting from the questionmark
    const queryParamString = dep.slice(firstQuestionMarkIndex);
    if (!queryParamString) return;
    const queryParams = new URLSearchParams(queryParamString);

    for (const [key, value] of queryParams) {
      this.queries[relativeFilePath][key] = value;
    }

    return this.queries[relativeFilePath];
  }
};
