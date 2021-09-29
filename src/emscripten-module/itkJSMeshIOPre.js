var Module = typeof Module !== 'undefined' ? Module : {};

Module.preRun = function () {
  ENV.ITK_GLOBAL_DEFAULT_THREADER = 'Platform'
}
