$(function () {
    // ----
    // INIT
    // ----
    // Vars
    var shader;

    // Editor
    var editor = ace.edit('editor');

    editor.setTheme('ace/theme/solarized_light');
    editor.getSession().setMode('ace/mode/javascript');
    editor.setFontSize(14);
    editor.setShowPrintMargin(false);
    editor.setShowFoldWidgets(false);

    // Canvas
    var canvas = new SapoRenderer(document.getElementById('canvas'));

    // Controls
    var gui = new dat.GUI({ autoPlace: false, width: 300, scrollable: true });
    var controls = [];

    var customContainer = document.getElementById('controls');
    customContainer.appendChild(gui.domElement);

    // ---------
    // FUNCTIONS
    // ---------
    var refreshCtrl = _.debounce(function (v) {
        canvas.render(shader);
    }, 200);

    function bindToGUI(shader) {
        // Remove dat.gui controls
        controls.forEach(function (control) {
            gui.remove(control);
        });

        // Reset
        controls = [];

        // Bind new controls
        shader.params.forEach(function (param) {
            switch (param.type) {
                case 'bool':
                    controls.push(gui.add(shader.values, param.key));
                    break;

                case 'color':
                    controls.push(gui.addColor(shader.values, param.key));
                    break;

                case 'float':
                    controls.push(gui.add(shader.values, param.key, param.min, param.max));
                    break;

                case 'int':
                    controls.push(gui.add(shader.values, param.key, param.min, param.max).step(1));
                    break;

                case 'point':
                    break;
            }
        });

        // Events
        controls.forEach(function (control) {
            control.onChange(refreshCtrl);
        });
    }

    function compile() {
        // If there are Errors/Warnings abort compilation
        if (!!editor.getSession().getAnnotations().length) {
            return;
        }

        shader = new SapoShader(editor.getValue());

        bindToGUI(shader);
        canvas.render(shader);
    }

    // ------
    // EVENTS
    // ------
    $('#presets').change(function (e) {
        if (confirm('Loading the preset will erase your current session. Continue?')) {
            editor.setValue($('[data-preset-id="'+ this.value +'"]').html());
            editor.clearSelection();
        }

        if (this.value !== '') {
            this.value = '';
        }
    });

    editor.getSession().on('changeAnnotation', _.debounce(compile, 250));
});
