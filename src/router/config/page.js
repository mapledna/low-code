/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable no-nested-ternary */
(function (global, factory) {
  const FACTORY_NAME = 'pageMap'

  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(FACTORY_NAME, [], factory)
      : (global[FACTORY_NAME] = factory())
}(this, () => ({
  INDEX: 'index.html',
  FLOW: 'flow.html',
  WORKFLOW: 'workflow.html',
  DESIGNER: 'designer.html',
  PREVIEW: 'preview.html'
})))
