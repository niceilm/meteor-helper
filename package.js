Package.describe({
  name: 'flynn:meteor-helper',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'call method or publish by method',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/niceilm/meteor-helper',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "meteor-rxjs": "0.4.7"
});


Package.onUse(function (api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.use('check');
  api.mainModule('index.js', ['server', 'client']);
});

Package.onTest(function (api) {
  api.use('tinytest');
  api.use('flynn:meteor-helper');
});