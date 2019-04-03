'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  _findPolyfillPaths: function() {
    if (!this._polyfillPath) {
      this._polyfillPath = require.resolve('focus-visible');
      this._polyfillDir = path.dirname(this._polyfillPath);
      this._polyfillBasename = path.basename(this._polyfillPath);
    }
  },

  treeForVendor(tree) {
    this._findPolyfillPaths();

    var focusVisibleTree = new Funnel(this._polyfillDir, {
      files: [this._polyfillBasename]
    });

    return mergeTrees([tree, focusVisibleTree], {
      annotation: 'ember-focus-visible: treeForPublic'
    });
  },

  included(parent) {
    this._super.included.apply(this, arguments);

    this._findPolyfillPaths();
    this.import('vendor/' + this._polyfillBasename);
  }
};
