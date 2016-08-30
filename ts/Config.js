///<reference path="lib/require.d.ts" />
require.config({
    baseUrl: './',
    paths: {
        'jquery': 'js/jquery',
        'Main': 'ts/Main',
        'jqueryui': 'js/jquery-ui.min',
        'advanced': 'js/advanced',
        'wysihtml5': 'js/wysihtml5-0.3.0.min'
    }
});

require(['Main'], function (Main) {
    var startApp = new Main("");
    startApp.main("");
});
//# sourceMappingURL=Config.js.map
