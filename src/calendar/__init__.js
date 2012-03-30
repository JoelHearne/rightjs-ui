/**
 * The filenames to include
 *
 * Copyright (C) 2010-2012 Nikolay Nemshilov
 */

var R          = RightJS,
    $          = RightJS.$,
    $$         = RightJS.$$,
    $w         = RightJS.$w,
    $ext       = RightJS.$ext,
    $uid       = RightJS.$uid,
    isString   = RightJS.isString,
    isArray    = RightJS.isArray,
    isFunction = RightJS.isFunction,
    Class      = RightJS.Class,
    Element    = RightJS.Element,
    Input      = RightJS.Input,
    RegExp     = RightJS.RegExp,
    Browser    = RightJS.Browser;


include_shared_js(
  'button',
  'toggler',
  'assignable',
  'zerofy'
);

include_shared_css(
  'panel',
  'button',
  'anchor'
);

include_module_files(
  'calendar',

  // sub-units
  'calendar/swaps',
  'calendar/month',
  'calendar/grid',
  'calendar/timepicker',
  'calendar/buttons',

  // domain logic
  'calendar/formats',
  'calendar/events',

  // document hooks
  'document'
);
