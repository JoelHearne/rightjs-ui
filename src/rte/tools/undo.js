/**
 * The undo tool
 *
 * The actual magic happens in the Rte.Undoer class
 * here we just show the status and blip it when used
 *
 * Copyright (C) 2010 Nikolay Nemshilov
 */
Rte.Tools.Undo = new Class(Rte.Tool, {
  shortcut: 'Z',

  exec: function() {
    this.rte.undoer.undo();
    this.highlight();
  },

  enabled: function() {
    return this.rte.undoer.hasUndo();
  }
});