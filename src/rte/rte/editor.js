/**
 * The actual Editor unit for the Rte
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Editor = new Class(Element, {

  /**
   * Basic constructor
   *
   * @param Rte rte
   * @return void
   */
  initialize: function(rte) {
    this.$super(rte.first('div.rui-rte-editor')._);

    this.rte = rte;

    this.on({
      focus:   this._focus,
      blur:    this._blur,
      mouseup: this._mouseup,
      keydown: this._keydown,
      keyup:   this._keyup
    });
  },

  /**
   * Updates the editor's content
   *
   * @param String text
   * @return Rte.Editor this
   */
  update: function(text) {
    for (var key in Rte.Convert) {
      text = text.replace(
        new RegExp('<(\/)?'+ key +'>', 'ig'),
        '<$1'+ Rte.Convert[key] + '>'
      );
    }

    this._.innerHTML = text;

    return this;
  },

  /**
   * puts focus on the editing area
   *
   * @return Rte.Editor this
   */
  focus: function() {
    this._.focus();
    return this;
  },

  /**
   * removes focus out of the editing area
   *
   * @return Rte.Editor this
   */
  blur: function() {
    this._.blur();
    return this;
  },

  /**
   * executes a command on this editing area
   *
   * @param String command name
   * @param mixed command value
   * @return Rte.Editor this
   */
  exec: function(command, value) {
    try {
      // it throws errors in some cases in the non-design mode
      document.execCommand(command, false, value);
    } catch(e) {
      // emulating insert html under IE
      if (command.toLowerCase() === 'inserthtml') {
        try {
          this.rte.selection.get().pasteHTML = value;
        } catch(e) {}
      }
    }

    return this;
  },

  /**
   * Removes the element from the editor, placing all its content
   * in its place
   *
   * @param raw dom element
   * @return void
   */
  removeElement: function(element) {
    if (element !== null) {
      this.rte.selection.wrap(element);

      if (Browser.Opera) {
        // Opera screwes with the deletion process, so we delete the things manually
        var parent = element.parentNode;
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);

      } else if (element.innerHTML) {

        if (Browser.WebKit) {
          // webkit has a but with the selection replacement
          // basically it will replace the content of the element
          // not the element itself, so, first we need to
          // delete the element and then insert its content
          this.exec('delete');
        }

        this.exec('insertHTML', element.innerHTML);
      } else {
        this.exec('delete');
      }
    }
  },

// protected

  _focus: function() {
    this.rte.selection.restore();
    this.rte.status.update();
    this.rte.focused = true;
  },

  _blur: function() {
    this.rte.focused = false;
    this.rte.status.update();
  },

  _mouseup: function() {
    this.rte.selection.save();
    this.rte.status.update();
  },

  _keydown: function(event) {
    var raw = event._, key = raw.keyCode, tool;

    if (raw.metaKey || raw.ctrlKey) {
      if ((tool = this.rte.shortcuts[key])) {
        if (tool.block) { event.stop(); }
        tool.call();
      } else if (key === 90) { // 'Z' enforcing the undo/redo actions
        event.stop();
        this.rte.undoer[raw.shiftKey ? 'redo' : 'undo']();
      }
    }
  },

  _keyup: function(event) {
    var raw = event._;

    if (raw.keyCode in this._keys) {
      this.rte.selection.save();
      this.rte.status.update();
    } else {
      // watching the typing pauses to fire 'change' events
      if (this._timer) { window.clearTimeout(this._timer); }
      var rte = this.rte;
      this._timer = window.setTimeout(function() {
        rte.fire('change');
      }, 400);
    }
  },

  _timer: false,

  // navigation keys
  _keys: {
    37: true,
    38: true,
    39: true,
    40: true,
    13: true
  }

});