/* @ds-bundle: {"format":4,"namespace":"AKG","components":[{"name":"Button"},{"name":"Toggle"},{"name":"Checkbox"},{"name":"RadioGroup"},{"name":"SegmentedControl"},{"name":"PopUpButton"},{"name":"Stepper"},{"name":"TextField"},{"name":"SearchField"},{"name":"ComboBox"},{"name":"Slider"},{"name":"DatePicker"},{"name":"ColorWell"},{"name":"List"},{"name":"GroupBox"},{"name":"DisclosureGroup"},{"name":"ProgressIndicator"},{"name":"EmptyState"},{"name":"Notification"},{"name":"Tooltip"},{"name":"TabBar"},{"name":"Toolbar"},{"name":"Sidebar"},{"name":"PageControl"},{"name":"Window"},{"name":"Sheet"},{"name":"Alert"},{"name":"ActionSheet"},{"name":"Menu"},{"name":"Popover"},{"name":"Callout"},{"name":"SourcePill"},{"name":"ContentSection"},{"name":"Flowchart"},{"name":"TappableValue"},{"name":"Table"},{"name":"Figure"},{"name":"Banner"},{"name":"BottomBar"},{"name":"Highlight"},{"name":"ShareButton"},{"name":"NumberField"},{"name":"SourceLine"},{"name":"StepList"},{"name":"ValueRow"},{"name":"Tag"},{"name":"ScaleBar"},{"name":"ComparisonGrid"},{"name":"TimePoints"},{"name":"TimerCapsule"}]} */
/* Shared helpers — used by every AKG component. */
(function (AKG) {
  // Join class names, skipping falsy values.
  AKG.cx = function () {
    var out = [];
    for (var i = 0; i < arguments.length; i++) if (arguments[i]) out.push(arguments[i]);
    return out.join(" ");
  };
  // "ios" or "macos", read from the nearest data-theme (ios-light, macos-dark, ...).
  AKG.platform = function (el) {
    var node = el && el.closest ? el.closest("[data-theme]") : document.documentElement;
    var theme = (node && node.getAttribute("data-theme")) || "ios-light";
    return theme.indexOf("macos") === 0 ? "macos" : "ios";
  };
})(window.AKG = window.AKG || {});

/* Button */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["variant", "size", "destructive", "icon", "className", "children", "pressed", "defaultPressed", "onPressedChange"];
  function Button(props) {
    var variant = props.variant || "bordered";
    var size = props.size || "medium";
    var isToggle = variant === "toggle";
    var st = window.React.useState(!!props.defaultPressed);
    var controlled = props.pressed !== undefined;
    var pressed = controlled ? !!props.pressed : st[0];
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-button",
      "akg-button--" + variant,
      "akg-button--" + size,
      props.destructive && "akg-button--destructive",
      isToggle && pressed && "akg-button--pressed",
      !props.children && props.icon && "akg-button--icon-only",
      props.className
    );
    if (!rest.type) rest.type = "button";
    if (isToggle) {
      rest["aria-pressed"] = pressed;
      rest.onClick = function (e) {
        if (props.onClick) props.onClick(e);
        if (e.defaultPrevented) return;
        if (!controlled) st[1](!pressed);
        if (props.onPressedChange) props.onPressedChange(!pressed);
      };
    }
    return h("button", rest,
      props.icon ? h("span", { className: "akg-sym", "aria-hidden": "true" }, props.icon) : null,
      props.children != null ? h("span", { className: "akg-button__label" }, props.children) : null
    );
  }
  AKG.Button = Button;
})(window.AKG = window.AKG || {});

/* Toggle */
(function (AKG) {
  var h = window.React.createElement;
  var INPUT_PROPS = ["id", "name", "value", "required", "autoFocus", "aria-label", "aria-labelledby", "aria-describedby", "onFocus", "onBlur"];
  function Toggle(props) {
    var controlled = props.checked !== undefined;
    var st = window.React.useState(!!props.defaultChecked);
    var on = controlled ? !!props.checked : st[0];
    var size = props.size || "medium";
    var rest = {}, input = {};
    for (var k in props) {
      if (["checked", "defaultChecked", "onChange", "disabled", "size", "className", "children"].indexOf(k) >= 0) continue;
      if (INPUT_PROPS.indexOf(k) >= 0) input[k] = props[k]; else rest[k] = props[k];
    }
    rest.className = AKG.cx(
      "akg-toggle",
      "akg-toggle--" + size,
      on && "akg-toggle--on",
      props.disabled && "akg-toggle--disabled",
      props.className
    );
    input.type = "checkbox";
    input.role = "switch";
    input.className = "akg-toggle__input";
    input.checked = on;
    input.disabled = props.disabled;
    input["aria-checked"] = on;
    input.onChange = function (e) {
      if (!controlled) st[1](e.target.checked);
      if (props.onChange) props.onChange(e.target.checked, e);
    };
    return h("label", rest,
      props.children != null ? h("span", { className: "akg-toggle__label" }, props.children) : null,
      h("span", { className: "akg-toggle__track" },
        h("input", input),
        h("span", { className: "akg-toggle__knob", "aria-hidden": "true" })
      )
    );
  }
  AKG.Toggle = Toggle;
})(window.AKG = window.AKG || {});

/* Checkbox */
(function (AKG) {
  var h = window.React.createElement;
  var INPUT_PROPS = ["id", "name", "value", "required", "autoFocus", "aria-label", "aria-labelledby", "aria-describedby", "onFocus", "onBlur"];
  function Checkbox(props) {
    var React = window.React;
    var controlled = props.checked !== undefined;
    var st = React.useState(!!props.defaultChecked);
    var on = controlled ? !!props.checked : st[0];
    var mixed = !!props.mixed;
    var size = props.size || "medium";
    var ref = React.useRef(null);
    React.useEffect(function () { if (ref.current) ref.current.indeterminate = mixed; }, [mixed]);
    var rest = {}, input = {};
    for (var k in props) {
      if (["checked", "defaultChecked", "mixed", "onChange", "disabled", "size", "className", "children"].indexOf(k) >= 0) continue;
      if (INPUT_PROPS.indexOf(k) >= 0) input[k] = props[k]; else rest[k] = props[k];
    }
    rest.className = AKG.cx(
      "akg-checkbox",
      "akg-checkbox--" + size,
      on && !mixed && "akg-checkbox--on",
      mixed && "akg-checkbox--mixed",
      props.disabled && "akg-checkbox--disabled",
      props.className
    );
    input.type = "checkbox";
    input.className = "akg-checkbox__input";
    input.ref = ref;
    input.checked = on;
    input.disabled = props.disabled;
    input["aria-checked"] = mixed ? "mixed" : on;
    input.onChange = function (e) {
      if (!controlled) st[1](e.target.checked);
      if (props.onChange) props.onChange(e.target.checked, e);
    };
    var glyph = mixed
      ? h("path", { d: "M5.75 8h4.5" })
      : h("path", { d: "M4.6 8.4l2.4 2.5 4.4-5.8" });
    return h("label", rest,
      h("input", input),
      h("span", { className: "akg-checkbox__box", "aria-hidden": "true" },
        h("svg", { className: "akg-checkbox__glyph", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, glyph)
      ),
      props.children != null ? h("span", { className: "akg-checkbox__label" }, props.children) : null
    );
  }
  AKG.Checkbox = Checkbox;
})(window.AKG = window.AKG || {});

/* RadioGroup */
(function (AKG) {
  var h = window.React.createElement;
  var INPUT_PROPS = ["id", "name", "value", "required", "autoFocus", "aria-label", "aria-labelledby", "aria-describedby", "onFocus", "onBlur"];
  var uid = 0;
  function norm(o) { return typeof o === "object" && o !== null ? o : { value: o, label: String(o) }; }
  var check = h("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: "M2.8 8.6l3.4 3.6L13.2 3.8" }));

  function Radio(props) {
    var controlled = props.checked !== undefined;
    var st = window.React.useState(!!props.defaultChecked);
    var on = controlled ? !!props.checked : st[0];
    var size = props.size || "medium";
    var rest = {}, input = {};
    for (var k in props) {
      if (["checked", "defaultChecked", "onChange", "disabled", "size", "className", "children"].indexOf(k) >= 0) continue;
      if (INPUT_PROPS.indexOf(k) >= 0) input[k] = props[k]; else rest[k] = props[k];
    }
    rest.className = AKG.cx(
      "akg-radio",
      "akg-radio--" + size,
      on && "akg-radio--on",
      props.disabled && "akg-radio--disabled",
      props.className
    );
    input.type = "radio";
    input.className = "akg-radio__input";
    input.checked = on;
    input.disabled = props.disabled;
    input.onChange = function (e) {
      if (!controlled) st[1](e.target.checked);
      if (props.onChange) props.onChange(e.target.checked, e);
    };
    return h("label", rest,
      h("input", input),
      h("span", { className: "akg-radio__circle", "aria-hidden": "true" }),
      props.children != null ? h("span", { className: "akg-radio__label" }, props.children) : null,
      h("span", { className: "akg-radio__check akg-sym", "aria-hidden": "true" }, check)
    );
  }

  function RadioGroup(props) {
    var React = window.React;
    var options = (props.options || []).map(norm);
    var controlled = props.value !== undefined;
    var st = React.useState(props.defaultValue);
    var value = controlled ? props.value : st[0];
    var auto = React.useState(function () { return "akg-radio-" + (++uid); })[0];
    var name = props.name || auto;
    var orientation = props.orientation || "vertical";
    var rest = {};
    for (var k in props) if (["options", "value", "defaultValue", "onChange", "orientation", "size", "disabled", "name", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-radio-group",
      "akg-radio-group--" + orientation,
      props.disabled && "akg-radio-group--disabled",
      props.className
    );
    rest.role = "radiogroup";
    rest["aria-disabled"] = props.disabled || undefined;
    return h("div", rest, options.map(function (opt) {
      return h(Radio, {
        key: String(opt.value),
        name: name,
        value: String(opt.value),
        size: props.size,
        checked: opt.value === value,
        disabled: props.disabled || opt.disabled,
        onChange: function (on, e) {
          if (!on) return;
          if (!controlled) st[1](opt.value);
          if (props.onChange) props.onChange(opt.value, e);
        }
      }, opt.label);
    }));
  }
  AKG.Radio = Radio;
  AKG.RadioGroup = RadioGroup;
})(window.AKG = window.AKG || {});

/* SegmentedControl */
(function (AKG) {
  var h = window.React.createElement;
  function norm(o) { return typeof o === "object" && o !== null ? o : { value: o, label: String(o) }; }
  function SegmentedControl(props) {
    var options = (props.options || []).map(norm);
    var controlled = props.value !== undefined;
    var st = window.React.useState(props.defaultValue !== undefined ? props.defaultValue : (options[0] && options[0].value));
    var value = controlled ? props.value : st[0];
    var size = props.size || "medium";
    var refs = window.React.useRef([]);
    var index = -1;
    for (var i = 0; i < options.length; i++) if (options[i].value === value) index = i;

    function select(opt) {
      if (props.disabled || opt.disabled) return;
      if (!controlled) st[1](opt.value);
      if (props.onChange && opt.value !== value) props.onChange(opt.value);
    }
    function onKeyDown(e) {
      var dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!dir || props.disabled) return;
      e.preventDefault();
      var j = index < 0 ? 0 : index;
      for (var n = 0; n < options.length; n++) {
        j = (j + dir + options.length) % options.length;
        if (!options[j].disabled) break;
      }
      select(options[j]);
      if (refs.current[j]) refs.current[j].focus();
    }

    var rest = {};
    for (var k in props) if (["options", "value", "defaultValue", "onChange", "size", "disabled", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-segmented",
      "akg-segmented--" + size,
      props.disabled && "akg-segmented--disabled",
      props.className
    );
    rest.role = "radiogroup";
    rest["aria-disabled"] = props.disabled || undefined;
    rest.onKeyDown = onKeyDown;
    rest.style = Object.assign({ "--akg-seg-n": options.length, "--akg-seg-i": index }, props.style);

    return h("div", rest,
      index >= 0 ? h("span", { className: "akg-segmented__thumb", "aria-hidden": "true" }) : null,
      options.map(function (opt, i) {
        var on = i === index;
        return h("button", {
          key: String(opt.value),
          ref: function (el) { refs.current[i] = el; },
          type: "button",
          role: "radio",
          "aria-checked": on,
          "aria-label": opt["aria-label"],
          tabIndex: on || (index < 0 && i === 0) ? 0 : -1,
          disabled: props.disabled || opt.disabled,
          className: AKG.cx("akg-segmented__item", on && "akg-segmented__item--selected"),
          onClick: function () { select(opt); }
        },
          opt.icon ? h("span", { className: "akg-sym", "aria-hidden": "true" }, opt.icon) : null,
          opt.label != null && opt.label !== "" ? h("span", { className: "akg-segmented__label", "data-text": opt.label }, opt.label) : null
        );
      })
    );
  }
  AKG.SegmentedControl = SegmentedControl;
})(window.AKG = window.AKG || {});

/* PopUpButton */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  // chevron.up.chevron.down (pop-up) and chevron.down (pull-down), standing in for SF Symbols.
  var upDown = h("svg", { viewBox: "0 0 10 16", fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: "M2 6l3-3 3 3M2 10l3 3 3-3" }));
  var down = h("svg", { viewBox: "0 0 12 8", fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: "M1.5 1.5L6 6l4.5-4.5" }));
  var OWN = ["variant", "size", "options", "items", "title", "value", "defaultValue", "onChange", "open", "defaultOpen", "onOpenChange",
    "placeholder", "disabled", "align", "id", "name", "aria-label", "aria-labelledby", "className", "children"];

  // "Wi-Fi" or { value, label, disabled } → { value, label, disabled }
  function norm(o) { return typeof o === "object" && o !== null ? { value: o.value, label: o.label != null ? o.label : String(o.value), disabled: o.disabled } : { value: o, label: String(o) }; }

  function PopUpButton(props) {
    var variant = props.variant || "pop-up";
    var popUp = variant !== "pull-down";
    var size = props.size || "medium";
    var options = (props.options || []).map(norm);

    var vControlled = props.value !== undefined;
    var vs = React.useState(props.defaultValue !== undefined ? props.defaultValue : (options[0] ? options[0].value : undefined));
    var value = vControlled ? props.value : vs[0];
    var oControlled = props.open !== undefined;
    var os = React.useState(!!props.defaultOpen);
    var open = oControlled ? !!props.open : os[0];

    var rootRef = React.useRef(null);
    var btnRef = React.useRef(null);
    var kbd = React.useRef(false);

    function setOpen(next, refocus) {
      if (!oControlled) os[1](next);
      if (props.onOpenChange) props.onOpenChange(next);
      if (!next && refocus && btnRef.current) btnRef.current.focus();
    }

    // Close on a click outside; move focus into the menu when it was opened from the keyboard.
    React.useEffect(function () {
      if (!open) return;
      function onDown(e) { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); }
      document.addEventListener("mousedown", onDown);
      if (kbd.current && rootRef.current) {
        var sel = rootRef.current.querySelector(".akg-menu-item[aria-checked=true]:not(:disabled)") || rootRef.current.querySelector(".akg-menu-item:not(:disabled)");
        if (sel) sel.focus();
      }
      kbd.current = false;
      return function () { document.removeEventListener("mousedown", onDown); };
    }, [open]);

    var current = null;
    for (var i = 0; i < options.length; i++) if (options[i].value === value) current = options[i];
    var label = popUp ? (current ? current.label : (props.placeholder || "")) : (props.title != null ? props.title : props.children);

    var entries = popUp ? options.map(function (o) {
      return { label: o.label, disabled: o.disabled, checked: current === o, onSelect: function () {
        if (!vControlled) vs[1](o.value);
        if (props.onChange) props.onChange(o.value);
        setOpen(false, true);
      } };
    }) : (props.items || []).map(function (it) {
      if (it.type === "separator" || it.type === "section" || it.type === "header") return it;
      var p = {};
      for (var k in it) p[k] = it[k];
      p.onSelect = function (e) { if (it.onSelect) it.onSelect(e); setOpen(false, true); };
      return p;
    });

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.ref = rootRef;
    rest.className = AKG.cx(
      "akg-pop-up-button",
      "akg-pop-up-button--" + variant,
      "akg-pop-up-button--" + size,
      open && "akg-pop-up-button--open",
      props.disabled && "akg-pop-up-button--disabled",
      props.align === "end" && "akg-pop-up-button--align-end",
      props.className
    );

    return h("div", rest,
      h("button", {
        ref: btnRef, type: "button", id: props.id, name: props.name,
        className: "akg-pop-up-button__button",
        disabled: props.disabled,
        "aria-haspopup": "menu", "aria-expanded": open ? "true" : "false",
        "aria-label": props["aria-label"], "aria-labelledby": props["aria-labelledby"],
        onClick: function (e) { kbd.current = e.detail === 0; setOpen(!open); },
        onKeyDown: function (e) {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) { e.preventDefault(); kbd.current = true; setOpen(true); }
        }
      },
        h("span", { className: AKG.cx("akg-pop-up-button__label", popUp && !current && "akg-pop-up-button__label--placeholder") }, label),
        h("span", { className: "akg-pop-up-button__chevron", "aria-hidden": "true" }, popUp ? upDown : down)
      ),
      open && AKG.Menu ? h("div", {
        className: "akg-pop-up-button__menu",
        onKeyDown: function (e) { if (e.key === "Escape" || e.key === "Tab") { if (e.key === "Escape") e.preventDefault(); setOpen(false, e.key === "Escape"); } }
      }, h(AKG.Menu, { items: entries, "aria-label": props["aria-label"] || (typeof label === "string" ? label : undefined) })) : null
    );
  }
  AKG.PopUpButton = PopUpButton;
})(window.AKG = window.AKG || {});

/* Stepper */
(function (AKG) {
  var h = window.React.createElement;
  function glyph(kind) {
    // iOS plus/minus and macOS chevron up/down; CSS shows the one for the current platform.
    var ios = kind === "inc" ? "M4 10h12M10 4v12" : "M4 10h12";
    var mac = kind === "inc" ? "M1.5 5.5L5.5 1.5L9.5 5.5" : "M1.5 1.5L5.5 5.5L9.5 1.5";
    return [
      h("span", { key: "i", className: "akg-sym akg-stepper__glyph-ios", "aria-hidden": "true" },
        h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" }, h("path", { d: ios }))),
      h("span", { key: "m", className: "akg-sym akg-stepper__glyph-mac", "aria-hidden": "true" },
        h("svg", { viewBox: "0 0 11 7", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: mac })))
    ];
  }
  function Stepper(props) {
    var min = props.min != null ? props.min : -Infinity;
    var max = props.max != null ? props.max : Infinity;
    var step = props.step || 1;
    var controlled = props.value !== undefined;
    var st = window.React.useState(props.defaultValue != null ? props.defaultValue : (isFinite(min) ? min : 0));
    var value = controlled ? props.value : st[0];
    var size = props.size || "medium";

    function set(next) {
      next = Math.min(max, Math.max(min, Math.round(next * 1e6) / 1e6));
      if (next === value) return;
      if (!controlled) st[1](next);
      if (props.onChange) props.onChange(next);
    }
    var rest = {};
    for (var k in props) if (["value", "defaultValue", "onChange", "min", "max", "step", "size", "disabled", "showValue", "formatValue", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-stepper",
      "akg-stepper--" + size,
      props.disabled && "akg-stepper--disabled",
      props.className
    );
    rest.role = "group";
    var text = props.formatValue ? props.formatValue(value) : String(value);
    var name = props["aria-label"] ? " " + props["aria-label"] : "";
    return h("div", rest,
      props.showValue ? h("output", { className: "akg-stepper__value", "aria-live": "polite" }, text) : null,
      h("span", { className: "akg-stepper__control" },
        h("button", {
          type: "button", className: "akg-stepper__btn akg-stepper__btn--dec",
          "aria-label": "Decrease" + name, disabled: props.disabled || value <= min,
          onClick: function () { set(value - step); }
        }, glyph("dec")),
        h("span", { className: "akg-stepper__sep", "aria-hidden": "true" }),
        h("button", {
          type: "button", className: "akg-stepper__btn akg-stepper__btn--inc",
          "aria-label": "Increase" + name, disabled: props.disabled || value >= max,
          onClick: function () { set(value + step); }
        }, glyph("inc"))
      )
    );
  }
  AKG.Stepper = Stepper;
})(window.AKG = window.AKG || {});

/* TextField */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  var OWN = ["className", "style", "size", "clearButton", "value", "defaultValue", "onChange", "label", "unit", "error"];

  // Empty the input through the native setter so React fires onChange as if the person typed.
  function clearInput(el) {
    if (!el) return;
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  }

  var xmarkCircle = h("svg", { viewBox: "0 0 20 20", fill: "currentColor" },
    h("path", { d: "M10 0a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-3.1 5.8a.8.8 0 0 0-1.1 1.1L8.9 10l-3.1 3.1a.8.8 0 1 0 1.1 1.1L10 11.1l3.1 3.1a.8.8 0 0 0 1.1-1.1L11.1 10l3.1-3.1a.8.8 0 0 0-1.1-1.1L10 8.9 6.9 5.8Z" })
  );

  function TextField(props) {
    var controlled = props.value != null;
    var st = React.useState(props.defaultValue != null ? String(props.defaultValue) : "");
    var value = controlled ? String(props.value) : st[0];
    var ref = React.useRef(null);
    var size = props.size || "medium";
    var clearButton = props.clearButton !== false;

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.ref = ref;
    rest.className = "akg-text-field__input";
    rest.value = value;
    if (!rest.type) rest.type = "text";
    rest.onChange = function (e) {
      if (!controlled) st[1](e.target.value);
      if (props.onChange) props.onChange(e);
    };

    var ids = React.useId ? React.useId() : "akg-tf";
    if (props.label && !rest.id) rest.id = ids + "-in";
    if (props.error) { rest["aria-invalid"] = "true"; rest["aria-describedby"] = rest["aria-describedby"] || ids + "-err"; }
    var row = h("div", {
        className: AKG.cx(
          "akg-text-field",
          "akg-text-field--" + size,
          value !== "" && "akg-text-field--has-value",
          props.disabled && "akg-text-field--disabled",
          props.label && "akg-text-field--labeled",
          props.error && "akg-text-field--invalid",
          props.className
        ),
        style: props.style
      },
      // A visible label: iOS forms put it on the leading side of the row (a placeholder is only a hint).
      props.label ? h("label", { className: "akg-text-field__label", htmlFor: rest.id }, props.label) : null,
      h("input", rest),
      props.unit ? h("span", { className: "akg-text-field__unit" }, props.unit) : null,
      clearButton && !props.disabled && !props.readOnly ? h("button", {
        type: "button",
        className: "akg-text-field__clear",
        "aria-label": "Clear text",
        tabIndex: -1,
        onMouseDown: function (e) { e.preventDefault(); },
        onClick: function () { clearInput(ref.current); }
      }, h("span", { className: "akg-sym", "aria-hidden": "true" }, xmarkCircle)) : null
    );
    if (!props.error) return row;
    return h(React.Fragment, null, row, h("p", { className: "akg-text-field__error", id: ids + "-err", role: "alert" }, props.error));
  }
  AKG.TextField = TextField;
})(window.AKG = window.AKG || {});

/* SearchField */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  var OWN = ["className", "style", "size", "variant", "value", "defaultValue", "onChange", "onSearch", "onKeyDown", "placeholder"];

  // Empty the input through the native setter so React fires onChange as if the person typed.
  function clearInput(el) {
    if (!el) return;
    var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    setter.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.focus();
  }

  var magnifier = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" },
    h("circle", { cx: 8.5, cy: 8.5, r: 6 }), h("path", { d: "M13 13l5 5" })
  );
  var xmarkCircle = h("svg", { viewBox: "0 0 20 20", fill: "currentColor" },
    h("path", { d: "M10 0a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-3.1 5.8a.8.8 0 0 0-1.1 1.1L8.9 10l-3.1 3.1a.8.8 0 1 0 1.1 1.1L10 11.1l3.1 3.1a.8.8 0 0 0 1.1-1.1L11.1 10l3.1-3.1a.8.8 0 0 0-1.1-1.1L10 8.9 6.9 5.8Z" })
  );

  function SearchField(props) {
    var controlled = props.value != null;
    var st = React.useState(props.defaultValue != null ? String(props.defaultValue) : "");
    var value = controlled ? String(props.value) : st[0];
    var ref = React.useRef(null);
    var variant = props.variant || "filled";
    var size = props.size || "medium";

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.ref = ref;
    rest.type = "search";
    rest.className = "akg-search-field__input";
    rest.value = value;
    rest.placeholder = props.placeholder != null ? props.placeholder : "Search";
    if (!rest["aria-label"] && !rest["aria-labelledby"]) rest["aria-label"] = rest.placeholder;
    rest.onChange = function (e) {
      if (!controlled) st[1](e.target.value);
      if (props.onChange) props.onChange(e);
    };
    rest.onKeyDown = function (e) {
      if (props.onKeyDown) props.onKeyDown(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" && props.onSearch) props.onSearch(e.target.value);
      if (e.key === "Escape" && e.target.value) { e.preventDefault(); clearInput(e.target); }
    };

    return h("div", {
        role: "search",
        className: AKG.cx(
          "akg-search-field",
          "akg-search-field--" + variant,
          "akg-search-field--" + size,
          value !== "" && "akg-search-field--has-value",
          props.disabled && "akg-search-field--disabled",
          props.className
        ),
        style: props.style
      },
      h("span", { className: "akg-sym akg-search-field__icon", "aria-hidden": "true" }, magnifier),
      h("input", rest),
      !props.disabled && !props.readOnly ? h("button", {
        type: "button",
        className: "akg-search-field__clear",
        "aria-label": "Clear search",
        tabIndex: -1,
        onMouseDown: function (e) { e.preventDefault(); },
        onClick: function () { clearInput(ref.current); }
      }, h("span", { className: "akg-sym", "aria-hidden": "true" }, xmarkCircle)) : null
    );
  }
  AKG.SearchField = SearchField;
})(window.AKG = window.AKG || {});

/* ComboBox */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  var uid = 0;
  // chevron.down, standing in for the SF Symbol.
  var down = h("svg", { viewBox: "0 0 12 8", fill: "none", stroke: "currentColor", strokeWidth: 1.1, strokeLinecap: "round", strokeLinejoin: "round" },
    h("path", { d: "M1.5 1.5L6 6l4.5-4.5" }));
  var OWN = ["options", "value", "defaultValue", "onChange", "onSelect", "open", "defaultOpen", "onOpenChange", "filter", "size",
    "placeholder", "disabled", "id", "name", "aria-label", "aria-labelledby", "inputProps", "className", "children"];

  function defaultFilter(option, text) { return option.toLowerCase().indexOf(text.toLowerCase()) >= 0; }

  function ComboBox(props) {
    var idRef = React.useRef(null);
    if (idRef.current == null) idRef.current = "akg-combo-box-" + (++uid);
    var listId = idRef.current + "-list";
    var size = props.size || "medium";
    var options = (props.options || []).map(String);

    var vControlled = props.value !== undefined;
    var vs = React.useState(props.defaultValue != null ? String(props.defaultValue) : "");
    var value = vControlled ? String(props.value == null ? "" : props.value) : vs[0];
    var oControlled = props.open !== undefined;
    var os = React.useState(!!props.defaultOpen);
    var open = oControlled ? !!props.open : os[0];
    // Filter by typed text; the dropdown button shows every option.
    var qs = React.useState(!!props.defaultOpen), typed = qs[0], setTyped = qs[1];
    var as = React.useState(-1), active = as[0], setActive = as[1];

    var rootRef = React.useRef(null);
    var inputRef = React.useRef(null);

    function setOpen(next) {
      if (next === open) return;
      if (!oControlled) os[1](next);
      if (props.onOpenChange) props.onOpenChange(next);
      if (!next) setActive(-1);
    }
    function setValue(v) {
      if (!vControlled) vs[1](v);
      if (props.onChange) props.onChange(v);
    }
    function choose(v) {
      setValue(v); setTyped(false); setOpen(false);
      if (props.onSelect) props.onSelect(v);
      if (inputRef.current) inputRef.current.focus();
    }

    React.useEffect(function () {
      if (!open) return;
      function onDown(e) { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); }
      document.addEventListener("mousedown", onDown);
      return function () { document.removeEventListener("mousedown", onDown); };
    }, [open]);

    var match = props.filter || defaultFilter;
    var shown = typed && value ? options.filter(function (o) { return match(o, value); }) : options;
    var expanded = open && shown.length > 0 && !props.disabled;

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.ref = rootRef;
    rest.className = AKG.cx(
      "akg-combo-box",
      "akg-combo-box--" + size,
      expanded && "akg-combo-box--open",
      props.disabled && "akg-combo-box--disabled",
      props.className
    );

    var input = {};
    var ip = props.inputProps || {};
    for (var key in ip) input[key] = ip[key];
    input.ref = inputRef;
    input.type = "text";
    input.id = props.id;
    input.name = props.name;
    input.className = "akg-combo-box__input";
    input.value = value;
    input.placeholder = props.placeholder;
    input.disabled = props.disabled;
    input.role = "combobox";
    input.autoComplete = "off";
    input["aria-label"] = props["aria-label"];
    input["aria-labelledby"] = props["aria-labelledby"];
    input["aria-autocomplete"] = "list";
    input["aria-expanded"] = expanded ? "true" : "false";
    input["aria-controls"] = listId;
    if (expanded && active >= 0 && active < shown.length) input["aria-activedescendant"] = listId + "-" + active;
    input.onChange = function (e) { setValue(e.target.value); setTyped(true); setActive(-1); setOpen(true); };
    input.onKeyDown = function (e) {
      if (ip.onKeyDown) ip.onKeyDown(e);
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!expanded) { setOpen(true); setActive(e.key === "ArrowDown" ? 0 : shown.length - 1); return; }
        var d = e.key === "ArrowDown" ? 1 : -1;
        setActive(active < 0 ? (d > 0 ? 0 : shown.length - 1) : (active + d + shown.length) % shown.length);
      } else if (e.key === "Enter" && expanded && active >= 0 && active < shown.length) {
        e.preventDefault(); choose(shown[active]);
      } else if (e.key === "Escape" && open) {
        e.preventDefault(); setOpen(false);
      } else if (e.key === "Tab") {
        setOpen(false);
      }
    };

    return h("div", rest,
      h("div", { className: "akg-combo-box__field" },
        h("input", input),
        h("button", {
          type: "button", className: "akg-combo-box__button", tabIndex: -1, disabled: props.disabled,
          "aria-label": "Show suggestions", "aria-expanded": expanded ? "true" : "false", "aria-controls": listId,
          onMouseDown: function (e) { e.preventDefault(); },
          onClick: function () { setTyped(false); setOpen(!open); if (inputRef.current) inputRef.current.focus(); }
        }, h("span", { className: "akg-combo-box__chevron", "aria-hidden": "true" }, down))
      ),
      expanded ? h("div", { className: "akg-combo-box__list", id: listId, role: "listbox", "aria-label": props["aria-label"] },
        shown.map(function (o, i) {
          return h("div", {
            key: o, id: listId + "-" + i, role: "option",
            "aria-selected": o === value ? "true" : "false",
            className: AKG.cx("akg-combo-box__option", i === active && "akg-combo-box__option--active", o === value && "akg-combo-box__option--selected"),
            onMouseDown: function (e) { e.preventDefault(); },
            onMouseEnter: function () { setActive(i); },
            onClick: function () { choose(o); }
          }, o);
        })
      ) : null
    );
  }
  AKG.ComboBox = ComboBox;
})(window.AKG = window.AKG || {});

/* Slider */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  var OWN = ["className", "style", "value", "defaultValue", "onChange", "min", "max", "step", "ticks", "minimumIcon", "maximumIcon"];

  function Slider(props) {
    var min = props.min != null ? Number(props.min) : 0;
    var max = props.max != null ? Number(props.max) : 100;
    var ticks = props.ticks && props.ticks >= 2 ? Math.round(props.ticks) : 0;
    var step = props.step != null ? props.step : (ticks ? (max - min) / (ticks - 1) : "any");
    var controlled = props.value != null;
    var st = React.useState(props.defaultValue != null ? Number(props.defaultValue) : min + (max - min) / 2);
    var value = controlled ? Number(props.value) : st[0];
    var frac = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.type = "range";
    rest.className = "akg-slider__input";
    rest.min = min; rest.max = max; rest.step = step; rest.value = value;
    rest.onChange = function (e) {
      var v = Number(e.target.value);
      if (!controlled) st[1](v);
      if (props.onChange) props.onChange(v, e);
    };

    var tickEls = [];
    for (var i = 0; i < ticks; i++) {
      tickEls.push(h("span", { key: i, className: "akg-slider__tick", style: { "--akg-slider-tick": i / (ticks - 1) } }));
    }
    var style = { "--akg-slider-frac": frac };
    if (props.style) for (var s in props.style) style[s] = props.style[s];

    return h("div", {
        className: AKG.cx("akg-slider", ticks && "akg-slider--ticked", props.disabled && "akg-slider--disabled", props.className),
        style: style
      },
      props.minimumIcon ? h("span", { className: "akg-sym akg-slider__glyph", "aria-hidden": "true" }, props.minimumIcon) : null,
      h("div", { className: "akg-slider__control" },
        h("div", { className: "akg-slider__track" }),
        h("div", { className: "akg-slider__fill" }),
        ticks ? h("div", { className: "akg-slider__ticks", "aria-hidden": "true" }, tickEls) : null,
        h("input", rest),
        h("div", { className: "akg-slider__knob", "aria-hidden": "true" })
      ),
      props.maximumIcon ? h("span", { className: "akg-sym akg-slider__glyph", "aria-hidden": "true" }, props.maximumIcon) : null
    );
  }
  AKG.Slider = Slider;
})(window.AKG = window.AKG || {});

/* DatePicker */
(function (AKG) {
  var h = window.React.createElement;
  var R = window.React;
  var OWN = ["value", "defaultValue", "onChange", "mode", "variant", "min", "max", "locale", "label", "disabled", "className", "children"];

  // ---- date math ----
  function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function sameDay(a, b) { return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function clamp(d, min, max) {
    if (min && d < min) return new Date(min.getTime());
    if (max && d > max) return new Date(max.getTime());
    return d;
  }
  function dayDisabled(y, m, day, min, max) {
    var d = new Date(y, m, day);
    return (min && d < dayStart(min)) || (max && d > dayStart(max));
  }
  function fmt(locale, opts) { return new Intl.DateTimeFormat(locale || "en-US", opts); }

  // ---- inline SVGs (stand-ins for SF Symbols) ----
  function chevron(dir) {
    var d = dir === "left" ? "M7.5 1.5 2 7l5.5 5.5" : "M2 1.5 7.5 7 2 12.5";
    return h("svg", { viewBox: "0 0 9.5 14", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, h("path", { d: d }));
  }

  // ---- outside click / Escape for floating panels ----
  function useDismiss(ref, open, close) {
    R.useEffect(function () {
      if (!open) return undefined;
      function down(e) { if (ref.current && !ref.current.contains(e.target)) close(); }
      function key(e) { if (e.key === "Escape") close(); }
      document.addEventListener("mousedown", down);
      document.addEventListener("touchstart", down);
      document.addEventListener("keydown", key);
      return function () {
        document.removeEventListener("mousedown", down);
        document.removeEventListener("touchstart", down);
        document.removeEventListener("keydown", key);
      };
    }, [open]);
  }

  // ---- month grid ----
  function DatePickerCalendar(p) {
    var sel = p.value, min = p.min, max = p.max;
    var view = R.useState({ y: sel.getFullYear(), m: sel.getMonth() });
    var y = view[0].y, m = view[0].m;
    var gridRef = R.useRef(null);
    var wantFocus = R.useRef(false);
    var today = new Date();

    // keep the shown month in step with the selected date
    var selKey = sel.getFullYear() * 12 + sel.getMonth();
    R.useEffect(function () {
      if (selKey !== y * 12 + m) view[1]({ y: sel.getFullYear(), m: sel.getMonth() });
    }, [selKey]);
    R.useEffect(function () {
      if (!wantFocus.current || !gridRef.current) return;
      wantFocus.current = false;
      var b = gridRef.current.querySelector('[aria-selected="true"]');
      if (b) b.focus();
    });

    function go(delta) {
      var n = y * 12 + m + delta;
      view[1]({ y: Math.floor(n / 12), m: ((n % 12) + 12) % 12 });
    }
    var prevOff = !!min && new Date(y, m, 0) < dayStart(min);
    var nextOff = !!max && new Date(y, m + 1, 1) > dayStart(max);

    function pick(day) {
      var d = new Date(y, m, day, sel.getHours(), sel.getMinutes());
      p.onSelect(clamp(d, min, max));
    }
    function onKey(e) {
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (!step) return;
      e.preventDefault();
      var d = new Date(sel.getFullYear(), sel.getMonth(), sel.getDate() + step, sel.getHours(), sel.getMinutes());
      if ((min && d < dayStart(min)) || (max && dayStart(d) > max)) return;
      wantFocus.current = true;
      p.onSelect(clamp(d, min, max));
    }

    var offset = new Date(y, m, 1).getDay();
    var dim = daysInMonth(y, m);
    var rows = Math.ceil((offset + dim) / 7);
    var dayName = fmt(p.locale, { weekday: "short" });
    var dayLong = fmt(p.locale, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    var heads = [];
    for (var w = 0; w < 7; w++) {
      var ref = new Date(2026, 0, 4 + w); // 4 Jan 2026 is a Sunday
      heads.push(h("span", { key: w, className: "akg-date-picker__weekday", role: "columnheader", "aria-label": fmt(p.locale, { weekday: "long" }).format(ref) }, dayName.format(ref).toUpperCase()));
    }
    var weeks = [];
    for (var r = 0; r < rows; r++) {
      var cells = [];
      for (var c = 0; c < 7; c++) {
        var day = r * 7 + c - offset + 1;
        if (day < 1 || day > dim) { cells.push(h("span", { key: c, className: "akg-date-picker__cell", role: "gridcell" })); continue; }
        var date = new Date(y, m, day);
        var isSel = sameDay(date, sel), isToday = sameDay(date, today);
        var off = p.disabled || dayDisabled(y, m, day, min, max);
        cells.push(h("span", { key: c, className: "akg-date-picker__cell", role: "gridcell" },
          h("button", {
            type: "button",
            className: AKG.cx("akg-date-picker__day", isSel && "akg-date-picker__day--selected", isToday && "akg-date-picker__day--today"),
            tabIndex: isSel ? 0 : -1,
            disabled: off,
            "aria-selected": isSel ? "true" : "false",
            "aria-current": isToday ? "date" : undefined,
            "aria-label": dayLong.format(date),
            onClick: (function (dd) { return function () { pick(dd); }; })(day)
          }, day)
        ));
      }
      weeks.push(h("div", { key: r, className: "akg-date-picker__week", role: "row" }, cells));
    }

    return h("div", { className: "akg-date-picker__calendar" },
      h("div", { className: "akg-date-picker__header" },
        h("span", { className: "akg-date-picker__title", "aria-live": "polite" },
          fmt(p.locale, { month: "long", year: "numeric" }).format(new Date(y, m, 1)),
          h("span", { className: "akg-sym akg-date-picker__title-chevron", "aria-hidden": "true" }, chevron("right"))
        ),
        h("span", { className: "akg-date-picker__nav" },
          h("button", { type: "button", className: "akg-date-picker__nav-btn", "aria-label": "Previous month", disabled: p.disabled || prevOff, onClick: function () { go(-1); } }, h("span", { className: "akg-sym" }, chevron("left"))),
          h("button", { type: "button", className: "akg-date-picker__nav-btn", "aria-label": "Next month", disabled: p.disabled || nextOff, onClick: function () { go(1); } }, h("span", { className: "akg-sym" }, chevron("right")))
        )
      ),
      h("div", { className: "akg-date-picker__month", role: "grid", ref: gridRef, onKeyDown: onKey },
        h("div", { className: "akg-date-picker__week akg-date-picker__week--head", role: "row" }, heads),
        weeks
      )
    );
  }

  // ---- time row: "Time" label, h:mm capsule that opens two short lists, AM/PM segmented ----
  function DatePickerTime(p) {
    var v = p.value;
    var open = R.useState(!!p.defaultListOpen);
    var hours = v.getHours(), mins = v.getMinutes(), pm = hours >= 12, h12 = hours % 12 || 12;
    var hourList = R.useRef(null), minList = R.useRef(null);
    function set(hh, mm) {
      var d = new Date(v.getFullYear(), v.getMonth(), v.getDate(), hh, mm);
      p.onChange(clamp(d, p.min, p.max));
    }
    R.useEffect(function () {
      if (!open[0]) return;
      [[hourList, h12 - 1], [minList, mins]].forEach(function (pair) {
        var el = pair[0].current; if (!el || !el.children[pair[1]]) return;
        var item = el.children[pair[1]];
        el.scrollTop = item.offsetTop - (el.clientHeight - item.offsetHeight) / 2;
      });
    }, [open[0]]);

    var hourItems = [], minItems = [];
    for (var i = 1; i <= 12; i++) {
      hourItems.push(h("button", {
        key: i, type: "button", role: "option", "aria-selected": i === h12 ? "true" : "false",
        className: AKG.cx("akg-date-picker__option", i === h12 && "akg-date-picker__option--selected"),
        onClick: (function (n) { return function () { set((n % 12) + (pm ? 12 : 0), mins); }; })(i)
      }, i));
    }
    for (var j = 0; j < 60; j++) {
      minItems.push(h("button", {
        key: j, type: "button", role: "option", "aria-selected": j === mins ? "true" : "false",
        className: AKG.cx("akg-date-picker__option", j === mins && "akg-date-picker__option--selected"),
        onClick: (function (n) { return function () { set(hours, n); }; })(j)
      }, (j < 10 ? "0" : "") + j));
    }
    function seg(isPm, text) {
      var on = isPm === pm;
      return h("button", {
        type: "button", role: "radio", "aria-checked": on ? "true" : "false", disabled: p.disabled,
        className: AKG.cx("akg-date-picker__ampm-btn", on && "akg-date-picker__ampm-btn--on"),
        onClick: function () { if (!on) set(isPm ? hours + 12 : hours - 12, mins); }
      }, text);
    }
    return h("div", { className: "akg-date-picker__time" },
      h("div", { className: "akg-date-picker__time-row" },
        h("span", { className: "akg-date-picker__time-label" }, p.label || "Time"),
        h("span", { className: "akg-date-picker__time-controls" },
          h("button", {
            type: "button", className: AKG.cx("akg-date-picker__clock", open[0] && "akg-date-picker__clock--open"),
            "aria-expanded": open[0] ? "true" : "false", "aria-label": "Time, " + h12 + ":" + (mins < 10 ? "0" : "") + mins, disabled: p.disabled,
            onClick: function () { open[1](!open[0]); }
          },
            h("span", { className: "akg-date-picker__clock-h" }, h12),
            h("span", { className: "akg-date-picker__clock-colon" }, ":"),
            h("span", { className: "akg-date-picker__clock-m" }, (mins < 10 ? "0" : "") + mins)
          ),
          h("span", { className: "akg-date-picker__ampm", role: "radiogroup", "aria-label": "AM or PM" }, seg(false, "AM"), seg(true, "PM"))
        )
      ),
      open[0] ? h("div", { className: "akg-date-picker__lists" },
        h("div", { className: "akg-date-picker__list", role: "listbox", "aria-label": "Hour", ref: hourList }, hourItems),
        h("span", { className: "akg-date-picker__list-colon", "aria-hidden": "true" }, ":"),
        h("div", { className: "akg-date-picker__list", role: "listbox", "aria-label": "Minute", ref: minList }, minItems)
      ) : null
    );
  }

  function DatePicker(props) {
    var mode = props.mode || "date";
    var variant = props.variant || "compact";
    var controlled = props.value !== undefined;
    var st = R.useState(function () {
      var d = props.defaultValue ? new Date(props.defaultValue.getTime()) : new Date();
      d.setSeconds(0, 0);
      return d;
    });
    var value = controlled ? props.value : st[0];
    var openSt = R.useState(null); // compact: null | "date" | "time"
    var alignSt = R.useState("end"); // pop-up edge: under the trailing edge unless there is no room
    var rootRef = R.useRef(null);
    useDismiss(rootRef, !!openSt[0], function () { openSt[1](null); });

    function commit(d) {
      if (!controlled) st[1](d);
      if (props.onChange) props.onChange(d);
    }
    var hasDate = mode !== "time", hasTime = mode !== "date";
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-date-picker", "akg-date-picker--" + variant, props.disabled && "akg-date-picker--disabled", props.className);
    rest.ref = rootRef;
    var shared = { value: value, min: props.min, max: props.max, locale: props.locale, disabled: props.disabled };

    function calendar() { return h(DatePickerCalendar, Object.assign({ onSelect: commit }, shared)); }
    function time(listOpen) { return h(DatePickerTime, Object.assign({ onChange: commit, label: props.label, defaultListOpen: listOpen }, shared)); }

    if (variant === "graphical") {
      rest.role = rest.role || "group";
      return h("div", rest, hasDate ? calendar() : null, hasTime ? time(false) : null);
    }

    function pill(part, text) {
      var on = openSt[0] === part;
      return h("button", {
        type: "button", disabled: props.disabled,
        className: AKG.cx("akg-date-picker__pill", on && "akg-date-picker__pill--open"),
        "aria-haspopup": "dialog", "aria-expanded": on ? "true" : "false",
        onClick: function () {
          if (!on && rootRef.current) {
            var r = rootRef.current.getBoundingClientRect();
            alignSt[1](r.right < 330 ? "start" : "end");
          }
          openSt[1](on ? null : part);
        }
      }, text);
    }
    var o = openSt[0];
    return h("div", rest,
      hasDate ? pill("date", fmt(props.locale, { month: "long", day: "numeric", year: "numeric" }).format(value)) : null,
      hasTime ? pill("time", fmt(props.locale, { hour: "numeric", minute: "2-digit" }).format(value)) : null,
      o ? h("div", { className: AKG.cx("akg-date-picker__popover", "akg-date-picker__popover--" + alignSt[0], o === "time" && "akg-date-picker__popover--time"), role: "dialog", "aria-label": o === "date" ? "Choose a date" : "Choose a time" },
        o === "date" ? calendar() : null,
        o === "date" && hasTime ? time(false) : null,
        o === "time" ? time(true) : null
      ) : null
    );
  }
  AKG.DatePicker = DatePicker;
})(window.AKG = window.AKG || {});

/* ColorWell */
(function (AKG) {
  var h = window.React.createElement;
  var R = window.React;
  var OWN = ["value", "defaultValue", "onChange", "colors", "size", "disabled", "className", "children", "aria-label"];

  // The 12 system colors (iOS 27 light values) followed by a row of grays from white to black.
  var SYSTEM = [
    { name: "Red", hex: "#FF383C" }, { name: "Orange", hex: "#FF8D28" }, { name: "Yellow", hex: "#FFCC00" },
    { name: "Green", hex: "#34C759" }, { name: "Mint", hex: "#00C8B3" }, { name: "Teal", hex: "#00C3D0" },
    { name: "Cyan", hex: "#00C0E8" }, { name: "Blue", hex: "#0088FF" }, { name: "Indigo", hex: "#6155F5" },
    { name: "Purple", hex: "#CB30E0" }, { name: "Pink", hex: "#FF2D55" }, { name: "Brown", hex: "#AC7F5E" },
    { name: "White", hex: "#FFFFFF" }, { name: "Light Gray", hex: "#D1D1D6" }, { name: "Silver", hex: "#AEAEB2" },
    { name: "Gray", hex: "#8E8E93" }, { name: "Dark Gray", hex: "#48484A" }, { name: "Black", hex: "#000000" }
  ];
  ColorWell.colors = SYSTEM;

  function norm(hex) { return String(hex || "").toUpperCase(); }

  function ColorWell(props) {
    var controlled = props.value !== undefined;
    var st = R.useState(props.defaultValue || "#0088FF");
    var value = controlled ? props.value : st[0];
    var open = R.useState(false);
    var align = R.useState("end"); // panel under the trailing edge unless there is no room
    var rootRef = R.useRef(null), panelRef = R.useRef(null), btnRef = R.useRef(null);
    var colors = props.colors || SYSTEM;
    var size = props.size || "regular";
    var match = null;
    for (var i = 0; i < colors.length; i++) if (norm(colors[i].hex) === norm(value)) match = colors[i];

    function close(refocus) { open[1](false); if (refocus && btnRef.current) btnRef.current.focus(); }
    R.useEffect(function () {
      if (!open[0]) return undefined;
      var first = panelRef.current && (panelRef.current.querySelector('[aria-checked="true"]') || panelRef.current.querySelector("button"));
      if (first) first.focus();
      function down(e) { if (rootRef.current && !rootRef.current.contains(e.target)) close(false); }
      function key(e) { if (e.key === "Escape") close(true); }
      document.addEventListener("mousedown", down);
      document.addEventListener("touchstart", down);
      document.addEventListener("keydown", key);
      return function () {
        document.removeEventListener("mousedown", down);
        document.removeEventListener("touchstart", down);
        document.removeEventListener("keydown", key);
      };
    }, [open[0]]);

    function choose(hex) {
      if (!controlled) st[1](hex);
      if (props.onChange) props.onChange(hex);
      close(true);
    }
    // Arrow keys move between swatches (6 per row).
    function onGridKey(e) {
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -6, ArrowDown: 6 }[e.key];
      if (!step) return;
      e.preventDefault();
      var btns = panelRef.current.querySelectorAll(".akg-color-well__dot");
      var idx = Array.prototype.indexOf.call(btns, document.activeElement);
      var next = btns[Math.max(0, Math.min(btns.length - 1, idx + step))];
      if (next) next.focus();
    }

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-color-well", "akg-color-well--" + size, open[0] && "akg-color-well--open", props.disabled && "akg-color-well--disabled", props.className);
    rest.ref = rootRef;
    var label = props["aria-label"] || "Color";

    return h("span", rest,
      h("button", {
        type: "button", ref: btnRef, className: "akg-color-well__button", disabled: props.disabled,
        "aria-haspopup": "dialog", "aria-expanded": open[0] ? "true" : "false",
        "aria-label": label + ", " + (match ? match.name : value),
        onClick: function () {
          if (!open[0] && rootRef.current) align[1](rootRef.current.getBoundingClientRect().right < 300 ? "start" : "end");
          open[1](!open[0]);
        }
      },
        h("span", { className: "akg-color-well__ring", "aria-hidden": "true" }),
        h("span", { className: "akg-color-well__swatch", style: { background: value }, "aria-hidden": "true" })
      ),
      open[0] ? h("div", { className: AKG.cx("akg-color-well__panel", "akg-color-well__panel--" + align[0]), role: "dialog", "aria-label": label, ref: panelRef },
        h("div", { className: "akg-color-well__grid", role: "radiogroup", "aria-label": label, onKeyDown: onGridKey },
          colors.map(function (c) {
            var on = norm(c.hex) === norm(value);
            return h("button", {
              key: c.hex + c.name, type: "button", role: "radio", "aria-checked": on ? "true" : "false", "aria-label": c.name, title: c.name,
              tabIndex: on || (!match && c === colors[0]) ? 0 : -1,
              className: AKG.cx("akg-color-well__dot", on && "akg-color-well__dot--selected"),
              style: { background: c.hex },
              onClick: function () { choose(c.hex); }
            });
          })
        )
      ) : null
    );
  }
  AKG.ColorWell = ColorWell;
})(window.AKG = window.AKG || {});

/* List + ListRow */
(function (AKG) {
  var h = window.React.createElement;
  function omit(props, keys) {
    var rest = {};
    for (var k in props) if (keys.indexOf(k) < 0) rest[k] = props[k];
    return rest;
  }
  var chevron = h("svg", { viewBox: "0 0 9 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M1.6 1.6 7.4 8l-5.8 6.4" }));
  var check = h("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M2 8.6 6.2 13 14 3" }));

  // A white symbol on a tinted rounded square, like the icons in Settings. tint: any color, e.g. "var(--system-red)".
  function IconTile(props) {
    var rest = omit(props, ["tint", "className", "style", "children"]);
    rest.className = AKG.cx("akg-icon-tile", props.className);
    rest.style = Object.assign({ "--akg-icon-tile-tint": props.tint || "var(--accent)" }, props.style);
    rest["aria-hidden"] = rest["aria-hidden"] || "true";
    return h("span", rest, h("span", { className: "akg-sym" }, props.children));
  }

  function List(props) {
    var headerStyle = props.headerStyle || "default";
    var rest = omit(props, ["header", "headerStyle", "headerAction", "footer", "className", "children"]);
    rest.className = AKG.cx("akg-list", props.className);
    var header = props.header != null || props.headerAction != null
      ? h("div", { className: AKG.cx("akg-list__header", "akg-list__header--" + headerStyle) },
          h("div", { className: "akg-list__header-title" }, props.header),
          props.headerAction != null ? h("div", { className: "akg-list__header-action" }, props.headerAction) : null)
      : null;
    return h("section", rest,
      header,
      h("ul", { className: "akg-list__group", role: "list" }, props.children),
      props.footer != null ? h("div", { className: "akg-list__footer" }, props.footer) : null
    );
  }

  function ListRow(props) {
    var interactive = !!(props.onClick || props.href);
    var rest = omit(props, ["title", "subtitle", "icon", "iconTint", "detail", "chevron", "checked", "accessory", "toggle", "action", "destructive", "disabled", "onClick", "href", "className", "children"]);
    rest.className = AKG.cx(
      "akg-list-row",
      props.subtitle != null && "akg-list-row--tall",
      interactive && "akg-list-row--interactive",
      props.action && "akg-list-row--action",
      props.destructive && "akg-list-row--destructive",
      props.disabled && "akg-list-row--disabled",
      props.className
    );

    var trailing = [];
    if (props.detail != null) trailing.push(h("span", { key: "d", className: "akg-list-row__detail" }, props.detail));
    if (props.toggle) {
      var t = props.toggle;
      trailing.push(AKG.Toggle
        ? h(AKG.Toggle, Object.assign({ key: "t", "aria-label": typeof props.title === "string" ? props.title : undefined }, t))
        : h("input", Object.assign({ key: "t", type: "checkbox", role: "switch", className: "akg-list-row__switch", "aria-label": typeof props.title === "string" ? props.title : undefined }, t)));
    }
    if (props.accessory != null) trailing.push(h("span", { key: "a", className: "akg-list-row__accessory" }, props.accessory));
    if (props.checked) trailing.push(h("span", { key: "c", className: "akg-sym akg-list-row__check", "aria-hidden": "true" }, check));
    if (props.chevron) trailing.push(h("span", { key: "v", className: "akg-sym akg-list-row__chevron", "aria-hidden": "true" }, chevron));

    var text = h("span", { className: "akg-list-row__text" },
      h("span", { className: "akg-list-row__title" }, props.title != null ? props.title : props.children),
      props.subtitle != null ? h("span", { className: "akg-list-row__subtitle" }, props.subtitle) : null
    );
    var inner = [
      props.icon != null
        ? (props.iconTint ? h(IconTile, { key: "i", tint: props.iconTint, className: "akg-list-row__tile" }, props.icon)
          : h("span", { key: "i", className: "akg-sym akg-list-row__icon", "aria-hidden": "true" }, props.icon))
        : null,
      h("span", { key: "b", className: "akg-list-row__body" },
        text,
        trailing.length ? h("span", { className: "akg-list-row__trailing" }, trailing) : null)
    ];

    var contentProps = { className: "akg-list-row__content" };
    var tag = "div";
    if (interactive) {
      contentProps.onClick = props.disabled ? undefined : props.onClick;
      if (props.href && !props.disabled) { tag = "a"; contentProps.href = props.href; }
      else { tag = "button"; contentProps.type = "button"; contentProps.disabled = props.disabled; }
      if (props.checked != null) contentProps["aria-pressed"] = !!props.checked;
    }
    return h("li", rest, h(tag, contentProps, inner));
  }

  AKG.List = List;
  AKG.ListRow = ListRow;
  AKG.IconTile = IconTile;
})(window.AKG = window.AKG || {});

/* GroupBox */
(function (AKG) {
  var React = window.React;
  var h = React.createElement;
  var n = 0;
  function GroupBox(props) {
    var idRef = React.useRef(null);
    if (idRef.current == null) idRef.current = "akg-group-box-" + (++n);
    var rest = {};
    for (var k in props) if (["title", "footer", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-group-box", props.className);
    var titleId = props.id ? props.id + "-title" : idRef.current;
    var hasTitle = props.title != null;
    return h("section", rest,
      hasTitle ? h("h2", { className: "akg-group-box__title", id: titleId }, props.title) : null,
      h("div", { className: "akg-group-box__box", role: "group", "aria-labelledby": hasTitle ? titleId : undefined }, props.children),
      props.footer != null ? h("p", { className: "akg-group-box__footer" }, props.footer) : null
    );
  }
  AKG.GroupBox = GroupBox;
})(window.AKG = window.AKG || {});

/* DisclosureGroup */
(function (AKG) {
  var h = window.React.createElement;
  var uid = 0;
  function chevron(d) {
    return h("svg", { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: d }));
  }
  var RIGHT = "M6 3l5 5-5 5";   // chevron.right, rotated 90° when open
  var DOWN = "M3 6l5 5 5-5";    // chevron.down / chevron.up (flipped) for the disclosure button

  // The macOS round-rect disclosure button: chevron down when collapsed, up when expanded.
  function DisclosureButton(props) {
    var rest = {};
    for (var k in props) if (["open", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-disclosure__button", props.open && "akg-disclosure__button--open", props.className);
    if (!rest.type) rest.type = "button";
    if (rest["aria-expanded"] === undefined) rest["aria-expanded"] = !!props.open;
    return h("button", rest, h("span", { className: "akg-sym", "aria-hidden": "true" }, chevron(DOWN)));
  }

  function DisclosureGroup(props) {
    var React = window.React;
    var controlled = props.open !== undefined;
    var st = React.useState(!!props.defaultOpen);
    var open = controlled ? !!props.open : st[0];
    var id = React.useState(function () { return "akg-disclosure-" + (++uid); })[0];
    var variant = props.variant || "chevron";
    var rest = {};
    for (var k in props) if (["open", "defaultOpen", "onToggle", "label", "variant", "disabled", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-disclosure",
      "akg-disclosure--" + variant,
      open && "akg-disclosure--open",
      props.disabled && "akg-disclosure--disabled",
      props.className
    );
    function toggle() {
      if (props.disabled) return;
      if (!controlled) st[1](!open);
      if (props.onToggle) props.onToggle(!open);
    }
    var icon = variant === "button"
      ? h("span", { className: "akg-disclosure__button" + (open ? " akg-disclosure__button--open" : ""), "aria-hidden": "true" },
          h("span", { className: "akg-sym" }, chevron(DOWN)))
      : h("span", { className: "akg-disclosure__chevron akg-sym", "aria-hidden": "true" }, chevron(RIGHT));
    return h("div", rest,
      h("button", {
        type: "button", className: "akg-disclosure__header", id: id + "-h",
        "aria-expanded": open, "aria-controls": id + "-c", disabled: props.disabled, onClick: toggle
      },
        icon,
        h("span", { className: "akg-disclosure__label" }, props.label)
      ),
      h("div", { className: "akg-disclosure__content", id: id + "-c", role: "region", "aria-labelledby": id + "-h", hidden: !open }, props.children)
    );
  }
  AKG.DisclosureButton = DisclosureButton;
  AKG.DisclosureGroup = DisclosureGroup;
})(window.AKG = window.AKG || {});

/* ProgressIndicator */
(function (AKG) {
  var h = window.React.createElement;
  // Spoke geometry from the kits: [box, spoke width, spoke length].
  var GEO = {
    ios:   { small: [14, 2, 4], regular: [20, 2.67, 6.67], large: [35, 5, 13] },
    macos: { small: [16, 2, 5], regular: [32, 4, 10], large: [32, 4, 10] }
  };
  // Opacity of the spoke at 0°, 45°, ... 315° (clockwise from 12 o'clock).
  var OPACITY = [1, 0.15, 0.27, 0.39, 0.51, 0.63, 0.75, 0.87];

  function spokes(platform, size) {
    var g = GEO[platform][size] || GEO[platform].regular, s = g[0], w = g[1], len = g[2], c = s / 2;
    var rects = OPACITY.map(function (op, i) {
      return h("rect", { key: i, x: c - w / 2, y: 0, width: w, height: len, rx: w / 2, fill: "currentColor", opacity: op, transform: "rotate(" + i * 45 + " " + c + " " + c + ")" });
    });
    return h("svg", { className: "akg-progress__spokes akg-progress__spokes--" + platform, viewBox: "0 0 " + s + " " + s, "aria-hidden": "true" }, rects);
  }

  function ProgressIndicator(props) {
    var variant = props.variant || "bar";
    var size = props.size || "regular";
    var max = props.max != null ? props.max : 1;
    var determinate = variant === "bar" && props.value != null;
    var pct = determinate ? Math.max(0, Math.min(100, (props.value / max) * 100)) : 0;
    var rest = {};
    for (var k in props) if (["variant", "size", "value", "max", "label", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-progress",
      "akg-progress--" + variant,
      "akg-progress--" + size,
      variant === "bar" && !determinate && "akg-progress--indeterminate",
      props.className
    );
    rest.role = "progressbar";
    if (determinate) {
      rest["aria-valuemin"] = 0;
      rest["aria-valuemax"] = max;
      rest["aria-valuenow"] = props.value;
    }
    if (!rest["aria-label"] && typeof props.label === "string") rest["aria-label"] = props.label;

    if (variant === "spinner") {
      return h("div", rest,
        h("span", { className: "akg-progress__spinner" }, spokes("ios", size), spokes("macos", size)),
        props.label != null ? h("span", { className: "akg-progress__label", "aria-hidden": typeof props.label === "string" ? "true" : undefined }, props.label) : null
      );
    }
    return h("div", rest,
      h("div", { className: "akg-progress__track" },
        h("div", { className: "akg-progress__fill", style: determinate ? { width: pct + "%" } : undefined }))
    );
  }
  AKG.ProgressIndicator = ProgressIndicator;
})(window.AKG = window.AKG || {});

/* EmptyState */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["symbol", "symbolStyle", "tint", "title", "description", "actions", "className", "style", "children"];

  function EmptyState(props) {
    var circle = props.symbolStyle === "circle";
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-empty-state",
      !props.symbol && "akg-empty-state--no-symbol",
      props.className
    );
    var style = {};
    if (props.style) for (var s in props.style) style[s] = props.style[s];
    if (props.tint) style["--akg-empty-state-tint"] = props.tint;
    rest.style = style;
    if (!rest.role) rest.role = "status";
    return h("div", rest,
      props.symbol ? h("div", {
        className: AKG.cx("akg-empty-state__symbol", circle ? "akg-empty-state__symbol--circle" : "akg-empty-state__symbol--large", props.tint && "akg-empty-state__symbol--tinted"),
        "aria-hidden": "true"
      }, h("span", { className: "akg-sym" }, props.symbol)) : null,
      h("div", { className: "akg-empty-state__text" },
        props.title ? h("div", { className: "akg-empty-state__title" }, props.title) : null,
        props.description ? h("div", { className: "akg-empty-state__description" }, props.description) : null
      ),
      props.children,
      props.actions ? h("div", { className: "akg-empty-state__actions" }, props.actions) : null
    );
  }
  AKG.EmptyState = EmptyState;
})(window.AKG = window.AKG || {});

/* Notification */
(function (AKG) {
  var React = window.React;
  var h = React.createElement;
  var xmark = h("svg", { viewBox: "0 0 12 12", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }, h("path", { d: "M3 3l6 6M9 3l-6 6" }));

  function Notification(props) {
    var rest = {};
    for (var k in props) if (["icon", "title", "body", "timestamp", "image", "actions", "onClose", "closeLabel", "stacked", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx(
      "akg-notification",
      props.stacked && "akg-notification--stacked",
      props.image && "akg-notification--with-image",
      props.className
    );
    if (!rest.role) rest.role = "status";
    var actions = props.actions;
    var actionNodes = null;
    if (Array.isArray(actions) && actions.length) {
      actionNodes = actions.map(function (a, i) {
        return h(AKG.Button, { key: i, size: "small", variant: "bordered", destructive: a.destructive, onClick: a.onClick, disabled: a.disabled }, a.label);
      });
    } else if (actions && !Array.isArray(actions)) {
      actionNodes = actions;
    }
    return h("div", rest,
      props.stacked ? h("div", { className: "akg-notification__plate", "aria-hidden": "true" }) : null,
      h("div", { className: "akg-notification__banner" },
        props.onClose ? h("button", { type: "button", className: "akg-notification__close", "aria-label": props.closeLabel || "Close", onClick: props.onClose },
          h("span", { className: "akg-sym", "aria-hidden": "true" }, xmark)) : null,
        h("div", { className: "akg-notification__main" },
          props.icon != null ? h("div", { className: "akg-notification__icon-col" }, h("span", { className: "akg-notification__icon" }, props.icon)) : null,
          h("div", { className: "akg-notification__text" },
            props.title != null ? h("p", { className: "akg-notification__title" }, props.title) : null,
            props.body != null ? h("p", { className: "akg-notification__body" }, props.body) : null,
            props.children
          ),
          (props.timestamp != null || props.image) ? h("div", { className: "akg-notification__trailing" },
            props.timestamp != null ? h("time", { className: "akg-notification__time" }, props.timestamp) : null,
            props.image ? h("span", { className: "akg-notification__image" }, props.image) : null
          ) : null
        ),
        actionNodes ? h("div", { className: "akg-notification__actions" }, actionNodes) : null
      )
    );
  }
  AKG.Notification = Notification;
})(window.AKG = window.AKG || {});

/* Tooltip */
(function (AKG) {
  var h = window.React.createElement;
  var React = window.React;
  var uid = 0;
  var OWN = ["content", "placement", "delay", "open", "defaultOpen", "onOpenChange", "disabled", "className", "children"];

  // Wraps its child; shows `content` after `delay` ms of hover, or right away on keyboard focus.
  function Tooltip(props) {
    var idRef = React.useRef(null);
    if (idRef.current == null) idRef.current = "akg-tooltip-" + (++uid);
    var placement = props.placement || "bottom";
    var delay = props.delay != null ? props.delay : 600;
    var controlled = props.open !== undefined;
    var st = React.useState(!!props.defaultOpen);
    var shown = (controlled ? !!props.open : st[0]) && !props.disabled && props.content != null && props.content !== "";
    var timer = React.useRef(null);

    function set(next) {
      clearTimeout(timer.current);
      if (!controlled) st[1](next);
      if (props.onOpenChange) props.onOpenChange(next);
    }
    function later() { clearTimeout(timer.current); timer.current = setTimeout(function () { set(true); }, delay); }
    React.useEffect(function () { return function () { clearTimeout(timer.current); }; }, []);

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-tooltip", "akg-tooltip--" + placement, props.className);
    rest.onMouseEnter = function (e) { if (props.onMouseEnter) props.onMouseEnter(e); later(); };
    rest.onMouseLeave = function (e) { if (props.onMouseLeave) props.onMouseLeave(e); set(false); };
    rest.onMouseDown = function (e) { if (props.onMouseDown) props.onMouseDown(e); set(false); };
    rest.onFocus = function (e) { if (props.onFocus) props.onFocus(e); if (e.target.matches && e.target.matches(":focus-visible")) set(true); };
    rest.onBlur = function (e) { if (props.onBlur) props.onBlur(e); set(false); };
    rest.onKeyDown = function (e) { if (props.onKeyDown) props.onKeyDown(e); if (e.key === "Escape" && shown) set(false); };

    // Point the child at the tooltip text so screen readers announce it.
    var child = props.children;
    if (React.isValidElement(child) && props.content != null) {
      var described = child.props["aria-describedby"];
      child = React.cloneElement(child, { "aria-describedby": AKG.cx(described, idRef.current) });
    }

    return h("span", rest,
      child,
      h("span", { id: idRef.current, role: "tooltip", className: AKG.cx("akg-tooltip__bubble", shown && "akg-tooltip__bubble--shown") }, props.content)
    );
  }
  AKG.Tooltip = Tooltip;
})(window.AKG = window.AKG || {});

/* TabBar */
(function (AKG) {
  var h = window.React.createElement;
  var useState = window.React.useState;
  var searchGlyph = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" },
    h("circle", { cx: 8.5, cy: 8.5, r: 5.5 }), h("path", { d: "M12.6 12.6 17 17" }));

  function TabBar(props) {
    var items = props.items || [];
    var controlled = props.value !== undefined;
    var initial = props.defaultValue !== undefined ? props.defaultValue : (items[0] && items[0].value);
    var st = useState(initial);
    var value = controlled ? props.value : st[0];
    function select(v) {
      if (!controlled) st[1](v);
      if (props.onChange) props.onChange(v);
    }
    var rest = {};
    for (var k in props) if (["items", "value", "defaultValue", "onChange", "search", "searchLabel", "searchSelected", "onSearch", "accessory", "floating", "className", "aria-label"].indexOf(k) < 0) rest[k] = props[k];
    var n = Math.min(Math.max(items.length, 1), 5);
    rest.className = AKG.cx(
      "akg-tab-bar",
      props.search && "akg-tab-bar--search",
      "akg-tab-bar--n" + n,
      props.floating && "akg-tab-bar--floating",
      props.accessory != null && "akg-tab-bar--with-accessory",
      props.className
    );
    var tabs = items.map(function (it) {
      var on = it.value === value;
      return h("button", {
        key: it.value, type: "button", role: "tab", "aria-selected": on ? "true" : "false",
        disabled: it.disabled, title: it.label,
        className: AKG.cx("akg-tab-bar__tab", on && "akg-tab-bar__tab--selected", !it.icon && "akg-tab-bar__tab--text"),
        onClick: function () { select(it.value); }
      },
        it.icon ? h("span", { className: "akg-sym akg-tab-bar__symbol", "aria-hidden": "true" }, it.icon) : null,
        h("span", { className: "akg-tab-bar__label" }, it.label)
      );
    });
    return h("div", rest,
      // Accessory: a persistent bar above the tabs (a running timer, now playing). Spans the full width.
      props.accessory != null ? h("div", { className: "akg-tab-bar__accessory" }, props.accessory) : null,
      h("div", { className: "akg-tab-bar__tabs", role: "tablist", "aria-label": props["aria-label"] || "Tabs" }, tabs),
      props.search ? h("button", {
        type: "button", "aria-label": props.searchLabel || "Search", title: props.searchLabel || "Search",
        "aria-pressed": props.searchSelected ? "true" : "false",
        className: AKG.cx("akg-tab-bar__search", props.searchSelected && "akg-tab-bar__search--selected"),
        onClick: props.onSearch
      }, h("span", { className: "akg-sym", "aria-hidden": "true" }, searchGlyph)) : null
    );
  }
  AKG.TabBar = TabBar;
})(window.AKG = window.AKG || {});

/* Toolbar */
(function (AKG) {
  var React = window.React;
  var h = React.createElement;
  var GroupCtx = React.createContext(false);

  function omit(props, keys) {
    var rest = {};
    for (var k in props) if (keys.indexOf(k) < 0) rest[k] = props[k];
    return rest;
  }

  function Toolbar(props) {
    var rest = omit(props, ["title", "subtitle", "largeTitle", "showTitle", "leading", "trailing", "windowControls", "className", "children"]);
    var large = !!props.largeTitle;
    rest.className = AKG.cx("akg-toolbar", large && "akg-toolbar--large", props.showTitle === false && "akg-toolbar--title-hidden", props.className);
    var titleBlock = function (cls) {
      if (props.title == null && props.subtitle == null) return null;
      return h("div", { className: cls },
        props.title != null ? h("h1", { className: "akg-toolbar__title" }, props.title) : null,
        props.subtitle != null ? h("p", { className: "akg-toolbar__subtitle" }, props.subtitle) : null
      );
    };
    return h("header", rest,
      h("div", { className: "akg-toolbar__bar" },
        props.windowControls === false ? null : h("div", { className: "akg-toolbar__window-controls", "aria-hidden": "true" },
          h("span", { className: "akg-toolbar__light akg-toolbar__light--close" }),
          h("span", { className: "akg-toolbar__light akg-toolbar__light--minimize" }),
          h("span", { className: "akg-toolbar__light akg-toolbar__light--zoom" })
        ),
        h("div", { className: "akg-toolbar__leading" }, props.leading),
        titleBlock(AKG.cx("akg-toolbar__heading", large && "akg-toolbar__heading--inline-large")),
        h("div", { className: "akg-toolbar__trailing" }, props.trailing)
      ),
      large ? titleBlock("akg-toolbar__large") : null,
      props.children
    );
  }

  // True once `ref`'s element (a page's own large title) has scrolled up under the bar.
  // Pair with <Toolbar showTitle={…}> so the title shows once: large in the page, then small in the bar.
  AKG.useScrolledPast = function (ref, offset) {
    var st = React.useState(false);
    React.useEffect(function () {
      var el = ref.current; if (!el || !window.IntersectionObserver) return;
      var io = new IntersectionObserver(function (e) { st[1](!e[0].isIntersecting && e[0].boundingClientRect.top < (offset || 60)); },
        { rootMargin: "-" + (offset || 60) + "px 0px 0px 0px" });
      io.observe(el);
      return function () { io.disconnect(); };
    }, [ref.current]);
    return st[0];
  };

  function ToolbarGroup(props) {
    var rest = omit(props, ["className", "children"]);
    rest.className = AKG.cx("akg-toolbar-group", props.className);
    rest.role = rest.role || "group";
    return h(GroupCtx.Provider, { value: true }, h("div", rest, props.children));
  }

  function ToolbarButton(props) {
    var inGroup = React.useContext(GroupCtx);
    var rest = omit(props, ["icon", "prominent", "className", "children"]);
    rest.className = AKG.cx(
      "akg-toolbar-button",
      inGroup ? "akg-toolbar-button--grouped" : "akg-toolbar-button--standalone",
      props.prominent && "akg-toolbar-button--prominent",
      props.children == null && props.icon && "akg-toolbar-button--icon-only",
      props.className
    );
    if (!rest.type) rest.type = "button";
    return h("button", rest,
      props.icon ? h("span", { className: "akg-sym", "aria-hidden": "true" }, props.icon) : null,
      props.children != null ? h("span", { className: "akg-toolbar-button__label" }, props.children) : null
    );
  }

  AKG.Toolbar = Toolbar;
  AKG.ToolbarGroup = ToolbarGroup;
  AKG.ToolbarButton = ToolbarButton;
})(window.AKG = window.AKG || {});

/* Sidebar */
(function (AKG) {
  var React = window.React;
  var h = React.createElement;
  var Ctx = React.createContext(null);
  var chevron = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M5.5 8 10 12.5 14.5 8" }));

  function omit(props, keys) {
    var rest = {};
    for (var k in props) if (keys.indexOf(k) < 0) rest[k] = props[k];
    return rest;
  }

  function Sidebar(props) {
    var controlled = props.value !== undefined;
    var st = React.useState(props.defaultValue);
    var value = controlled ? props.value : st[0];
    function select(v) {
      if (!controlled) st[1](v);
      if (props.onChange) props.onChange(v);
    }
    var rest = omit(props, ["value", "defaultValue", "onChange", "className", "children"]);
    rest.className = AKG.cx("akg-sidebar", props.className);
    if (!rest["aria-label"]) rest["aria-label"] = "Sidebar";
    return h(Ctx.Provider, { value: { value: value, select: select } }, h("nav", rest, props.children));
  }

  function SidebarSection(props) {
    var st = React.useState(props.defaultOpen !== false);
    var open = props.collapsible ? st[0] : true;
    var rest = omit(props, ["title", "detail", "collapsible", "defaultOpen", "className", "children"]);
    rest.className = AKG.cx("akg-sidebar__section", !open && "akg-sidebar__section--closed", props.className);
    var head = props.title == null ? null : h("div", { className: "akg-sidebar__header" },
      h("h2", { className: "akg-sidebar__header-title" }, props.title),
      props.detail != null ? h("span", { className: "akg-sidebar__header-detail" }, props.detail) : null,
      props.collapsible ? h("button", {
        type: "button", className: "akg-sidebar__disclosure", "aria-expanded": open ? "true" : "false",
        "aria-label": (open ? "Collapse " : "Expand ") + (typeof props.title === "string" ? props.title : "section"),
        onClick: function () { st[1](!open); }
      }, h("span", { className: "akg-sym", "aria-hidden": "true" }, chevron)) : null
    );
    return h("div", rest, head, open ? h("ul", { className: "akg-sidebar__list", role: "list" }, props.children) : null);
  }

  function SidebarItem(props) {
    var ctx = React.useContext(Ctx);
    var selected = props.selected !== undefined ? props.selected : !!(ctx && props.value !== undefined && ctx.value === props.value);
    var level = props.level || 0;
    var rest = omit(props, ["value", "icon", "label", "detail", "level", "selected", "disabled", "onClick", "className", "children", "style"]);
    var style = {};
    if (props.style) for (var s in props.style) style[s] = props.style[s];
    style["--akg-sidebar-level"] = level;
    rest.className = AKG.cx("akg-sidebar__item", selected && "akg-sidebar__item--selected", props.className);
    rest.type = "button";
    rest.style = style;
    rest.disabled = props.disabled;
    if (selected) rest["aria-current"] = "page";
    rest.onClick = function (e) {
      if (ctx && props.value !== undefined) ctx.select(props.value);
      if (props.onClick) props.onClick(e);
    };
    return h("li", { className: "akg-sidebar__row" },
      h("button", rest,
        props.icon ? h("span", { className: "akg-sym akg-sidebar__symbol", "aria-hidden": "true" }, props.icon) : null,
        h("span", { className: "akg-sidebar__title" }, props.label != null ? props.label : props.children),
        props.detail != null ? h("span", { className: "akg-sidebar__detail" }, props.detail) : null
      )
    );
  }

  AKG.Sidebar = Sidebar;
  AKG.SidebarSection = SidebarSection;
  AKG.SidebarItem = SidebarItem;
})(window.AKG = window.AKG || {});

/* PageControl */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["count", "value", "defaultValue", "onChange", "background", "label", "className"];

  // Size of each dot: "full", "medium" (6pt), "small" (4pt) or null (hidden).
  // Up to 7 pages show every dot. With 8 or more, a window of full dots follows the current
  // page and the two dots beyond each end shrink to 6pt and 4pt, as in the kit.
  function sizes(count, cur) {
    var out = [], i;
    if (count <= 7) { for (i = 0; i < count; i++) out.push("full"); return out; }
    var a, b;
    if (cur <= 3) { a = 0; b = 5; }
    else if (cur >= count - 4) { a = count - 6; b = count - 1; }
    else { a = cur - 2; b = cur + 2; }
    for (i = 0; i < count; i++) {
      var d = i < a ? a - i : i > b ? i - b : 0;
      out.push(d === 0 ? "full" : d === 1 ? "medium" : d === 2 ? "small" : null);
    }
    return out;
  }

  function PageControl(props) {
    var R = window.React;
    var count = Math.max(0, props.count || 0);
    var controlled = props.value !== undefined;
    var st = R.useState(props.defaultValue || 0);
    var cur = Math.min(Math.max(controlled ? props.value : st[0], 0), Math.max(count - 1, 0));
    var go = function (i) {
      if (i < 0 || i >= count || i === cur) return;
      if (!controlled) st[1](i);
      if (props.onChange) props.onChange(i);
    };
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-page-control", props.background && "akg-page-control--background", props.className);
    rest.role = rest.role || "group";
    if (!rest["aria-label"]) rest["aria-label"] = props.label || "Page " + (cur + 1) + " of " + count;
    rest.onKeyDown = function (e) {
      if (props.onKeyDown) props.onKeyDown(e);
      var map = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: count - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      var next = Math.min(Math.max(map[e.key], 0), count - 1);
      go(next);
      var root = e.currentTarget;
      setTimeout(function () { var b = root.querySelector('[data-index="' + next + '"]'); if (b) b.focus(); }, 0);
    };
    var sz = sizes(count, cur);
    return h("div", rest,
      h("div", { className: "akg-page-control__stack" }, sz.map(function (s, i) {
        if (!s) return null;
        return h("button", {
          key: i, type: "button", "data-index": i, tabIndex: i === cur ? 0 : -1,
          className: AKG.cx("akg-page-control__dot", "akg-page-control__dot--" + s, i === cur && "akg-page-control__dot--current"),
          "aria-label": "Page " + (i + 1) + " of " + count,
          "aria-current": i === cur ? "page" : undefined,
          onClick: function () { go(i); }
        });
      }))
    );
  }
  AKG.PageControl = PageControl;
})(window.AKG = window.AKG || {});

/* Window */
(function (AKG) {
  var React = window.React;
  var h = React.createElement;

  function light(kind, label, handler) {
    var cls = "akg-window__light akg-window__light--" + kind;
    if (!handler) return h("span", { className: cls });
    return h("button", { type: "button", className: cls, "aria-label": label, onClick: handler });
  }

  function Window(props) {
    var rest = {};
    for (var k in props) if (["title", "subtitle", "toolbar", "sidebar", "sidebarWidth", "inactive", "windowControls", "onClose", "onMinimize", "onZoom", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    var hasSidebar = props.sidebar != null && props.sidebar !== false;
    var hasToolbar = props.toolbar != null && props.toolbar !== false;
    var interactive = !!(props.onClose || props.onMinimize || props.onZoom);
    rest.className = AKG.cx(
      "akg-window",
      hasSidebar && "akg-window--sidebar",
      hasToolbar && "akg-window--toolbar",
      props.inactive && "akg-window--inactive",
      props.className
    );
    if (props.sidebarWidth != null) {
      rest.style = Object.assign({}, rest.style, { "--akg-window-sidebar-width": typeof props.sidebarWidth === "number" ? props.sidebarWidth + "px" : props.sidebarWidth });
    }
    var controls = props.windowControls === false ? null : h("div", { className: "akg-window__controls", "aria-hidden": interactive ? undefined : "true" },
      light("close", "Close", props.onClose),
      light("minimize", "Minimize", props.onMinimize),
      light("zoom", "Zoom", props.onZoom)
    );
    var heading = (props.title == null && props.subtitle == null) ? h("div", { className: "akg-window__heading akg-window__heading--empty" }) :
      h("div", { className: "akg-window__heading" },
        props.title != null ? h("h1", { className: "akg-window__title" }, props.title) : null,
        props.subtitle != null ? h("p", { className: "akg-window__subtitle" }, props.subtitle) : null
      );
    return h("div", rest,
      hasSidebar ? h("div", { className: "akg-window__sidebar-pane" },
        h("div", { className: "akg-window__titlebar akg-window__titlebar--sidebar" }, controls),
        h("div", { className: "akg-window__sidebar" }, props.sidebar)
      ) : null,
      h("div", { className: "akg-window__main" },
        h("div", { className: "akg-window__titlebar" },
          hasSidebar ? null : controls,
          heading,
          hasToolbar ? h("div", { className: "akg-window__toolbar" }, props.toolbar) : null
        ),
        h("div", { className: "akg-window__content" }, props.children)
      )
    );
  }
  AKG.Window = Window;
})(window.AKG = window.AKG || {});

/* Sheet */
(function (AKG) {
  var R = window.React, h = R.createElement;
  var xmark = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.45, strokeLinecap: "round" }, h("path", { d: "M5 5l10 10M15 5L5 15" }));
  var check = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4 10.5l4 4 8-9" }));
  var OWN = ["open", "defaultOpen", "onClose", "onDone", "title", "heading", "subheading", "detent", "detents", "fixed", "doneLabel", "cancelLabel", "dim", "className", "children"];
  var LEAVE_MS = 220;

  // Locks page scrolling while a full-screen overlay is open (counted, so nested overlays restore correctly).
  var locks = 0, saved = "";
  AKG.lockScroll = function () {
    if (locks++ === 0) { saved = document.documentElement.style.overflow; document.documentElement.style.overflow = "hidden"; }
    return function () { if (--locks === 0) document.documentElement.style.overflow = saved; };
  };
  // Calls fn on Escape anywhere in the document while active.
  AKG.useEscape = function (active, fn) {
    var ref = R.useRef(fn); ref.current = fn;
    R.useEffect(function () {
      if (!active) return;
      var on = function (e) { if (e.key === "Escape") ref.current(e); };
      document.addEventListener("keydown", on);
      return function () { document.removeEventListener("keydown", on); };
    }, [active]);
  };

  function Sheet(props) {
    var controlled = props.open !== undefined;
    var st = R.useState(props.defaultOpen !== undefined ? !!props.defaultOpen : true);
    var open = controlled ? props.open : st[0];
    var detents = props.detents && props.detents.length ? props.detents : [props.detent || "medium"];
    var dt = R.useState(detents[0]), detent = detents.indexOf(dt[0]) >= 0 ? dt[0] : detents[0];
    var lv = R.useState(false), leaving = lv[0];
    var panelRef = R.useRef(null), drag = R.useRef(null);

    R.useEffect(function () { if (open) { dt[1](detents[0]); lv[1](false); } }, [open]);
    R.useEffect(function () { if (open && props.fixed) return AKG.lockScroll(); }, [open, !!props.fixed]);

    var finish = function () { lv[1](false); if (!controlled) st[1](false); if (props.onClose) props.onClose(); };
    var close = function () {
      if (leaving) return;
      var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (still || AKG.platform(panelRef.current) === "macos") return finish();
      lv[1](true); setTimeout(finish, LEAVE_MS);
    };
    AKG.useEscape(open, close);
    if (!open) return null;

    var done = function () { if (props.onDone) props.onDone(); };
    var cycle = function () { if (detents.length > 1) dt[1](detents[(detents.indexOf(detent) + 1) % detents.length]); };

    // Drag the bar: down past a threshold shrinks to the smaller detent or dismisses; up grows to large.
    var onDown = function (e) {
      if (e.button || e.target.closest("button:not(.akg-sheet__grabber)")) return;
      drag.current = { y: e.clientY, dy: 0 };
      e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId);
    };
    var onMove = function (e) {
      var d = drag.current; if (!d) return;
      d.dy = e.clientY - d.y;
      var p = panelRef.current; if (!p) return;
      p.style.transition = "none";
      p.style.transform = "translateY(" + Math.max(d.dy, -24) + "px)";
    };
    var onUp = function () {
      var d = drag.current; drag.current = null;
      var p = panelRef.current; if (p) { p.style.transition = ""; p.style.transform = ""; }
      if (!d) return;
      if (Math.abs(d.dy) < 6) return;
      var i = detents.indexOf(detent);
      if (d.dy > 60) { if (i > 0) dt[1](detents[i - 1]); else close(); }
      else if (d.dy < -40 && i < detents.length - 1) dt[1](detents[i + 1]);
    };

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.ref = panelRef;
    rest.className = AKG.cx("akg-sheet__panel", "akg-sheet__panel--" + detent, props.className);
    rest.role = rest.role || "dialog";
    rest["aria-modal"] = "true";
    var named = props.heading != null ? props.heading : props.title;
    if (named && !rest["aria-label"]) rest["aria-label"] = typeof named === "string" ? named : undefined;
    var doneLabel = props.doneLabel || "Done", cancelLabel = props.cancelLabel || "Cancel";

    return h("div", { className: AKG.cx("akg-sheet", props.fixed && "akg-sheet--fixed", props.dim === false && "akg-sheet--no-dim", leaving && "akg-sheet--leaving") },
      h("div", { className: "akg-sheet__scrim", onClick: close, "aria-hidden": "true" }),
      h("div", rest,
        // iOS: grabber + toolbar with a close and a done button. Drag the bar to resize or dismiss.
        h("div", { className: "akg-sheet__bar", onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp },
          detents.length > 1
            ? h("button", { type: "button", className: "akg-sheet__grabber", "aria-label": detent === "large" ? "Shrink" : "Expand", onClick: cycle })
            : h("span", { className: "akg-sheet__grabber", "aria-hidden": "true" }),
          h("button", { type: "button", className: "akg-sheet__circle akg-sheet__circle--close", "aria-label": cancelLabel, onClick: close }, h("span", { className: "akg-sym" }, xmark)),
          h("div", { className: "akg-sheet__title" }, props.title),
          props.onDone ? h("button", { type: "button", className: "akg-sheet__circle akg-sheet__circle--done", "aria-label": doneLabel, onClick: done }, h("span", { className: "akg-sym" }, check)) : h("span", { className: "akg-sheet__spacer" })
        ),
        h("div", { className: "akg-sheet__content" },
          // A long name goes here, where it can wrap; the bar keeps a short title ("Details", "Sources").
          props.heading != null ? h("div", { className: "akg-sheet__heading" },
            h("h2", { className: "akg-sheet__heading-title" }, props.heading),
            props.subheading != null ? h("p", { className: "akg-sheet__heading-sub" }, props.subheading) : null) : null,
          props.children),
        // macOS: footer buttons
        h("div", { className: "akg-sheet__footer" },
          h(AKG.Button, { variant: "bordered", onClick: close }, cancelLabel),
          props.onDone ? h(AKG.Button, { variant: "prominent", onClick: done }, doneLabel) : null
        )
      )
    );
  }
  AKG.Sheet = Sheet;
})(window.AKG = window.AKG || {});

/* Alert */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["open", "title", "message", "actions", "fields", "layout", "icon", "overlay", "fixed", "className", "children"];

  var n = 0;
  function Alert(props) {
    var R = window.React;
    var id = R.useId ? R.useId() : R.useState(function () { return "akg-alert-" + (++n); })[0];
    var all = props.actions || [{ label: "OK", role: "preferred" }];
    var cancel = all.filter(function (a) { return a.role === "cancel"; })[0];
    // Escape cancels (the HIG's alternate way to back out), when there is a Cancel action.
    AKG.useEscape(props.open !== false && !!cancel, function () { if (cancel && cancel.onClick) cancel.onClick(); });
    R.useEffect(function () { if (props.open !== false && props.fixed && props.overlay) return AKG.lockScroll(); }, [props.open !== false, !!props.fixed, !!props.overlay]);
    if (props.open === false) return null;
    var fields = props.fields || [];
    var layout = props.layout || "auto";
    if (layout === "auto") layout = all.length <= 2 ? "side-by-side" : "stacked";
    // Apple's order: side by side, Cancel is leading; stacked, the preferred action is first and Cancel last.
    var others = all.filter(function (a) { return a.role !== "cancel"; });
    if (layout === "stacked") others = others.filter(function (a) { return a.role === "preferred"; }).concat(others.filter(function (a) { return a.role !== "preferred"; }));
    var actions = cancel ? (layout === "side-by-side" ? [cancel].concat(others) : others.concat([cancel])) : others;
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-alert", "akg-alert--" + layout, props.className);
    rest.role = rest.role || "alertdialog";
    rest["aria-modal"] = "true";
    rest["aria-labelledby"] = rest["aria-labelledby"] || id + "-t";
    if (props.message) rest["aria-describedby"] = rest["aria-describedby"] || id + "-m";

    var card = h("div", rest,
      props.icon ? h("div", { className: "akg-alert__icon", "aria-hidden": "true" }, props.icon) : null,
      h("div", { className: "akg-alert__text" },
        h("div", { className: "akg-alert__title", id: id + "-t" }, props.title),
        props.message ? h("div", { className: "akg-alert__message", id: id + "-m" }, props.message) : null,
        props.children
      ),
      fields.length ? h("div", { className: "akg-alert__fields" }, fields.map(function (f, i) {
        var fp = {};
        for (var key in f) fp[key] = f[key];
        fp.key = i;
        fp.className = "akg-alert__field";
        fp.type = f.type || "text";
        if (!fp["aria-label"]) fp["aria-label"] = f.placeholder;
        return h("input", fp);
      })) : null,
      h("div", { className: "akg-alert__actions" }, actions.map(function (a, i) {
        return h("button", {
          key: i, type: "button", disabled: a.disabled,
          className: AKG.cx("akg-alert__action", "akg-alert__action--" + (a.role || "default")),
          onClick: a.onClick
        }, a.label);
      }))
    );
    if (!props.overlay) return card;
    return h("div", { className: AKG.cx("akg-alert-overlay", props.fixed && "akg-alert-overlay--fixed") }, card);
  }
  AKG.Alert = Alert;
})(window.AKG = window.AKG || {});

/* ActionSheet */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["open", "defaultOpen", "onClose", "title", "message", "actions", "overlay", "fixed", "align", "className", "children"];

  var n = 0;
  function ActionSheet(props) {
    var R = window.React;
    var id = R.useId ? R.useId() : R.useState(function () { return "akg-action-sheet-" + (++n); })[0];
    var controlled = props.open !== undefined;
    var st = R.useState(props.defaultOpen !== undefined ? !!props.defaultOpen : true);
    var open = controlled ? props.open : st[0];
    var close = function () { if (!controlled) st[1](false); if (props.onClose) props.onClose(); };
    AKG.useEscape(open, close);
    R.useEffect(function () { if (open && props.fixed && props.overlay) return AKG.lockScroll(); }, [open, !!props.fixed, !!props.overlay]);
    if (!open) return null;

    // Destructive choices first and Cancel always last (Apple's action sheet order), whatever order the actions come in.
    var acts = props.actions || [];
    var list = acts.filter(function (a) { return a.role === "destructive"; })
      .concat(acts.filter(function (a) { return a.role !== "destructive" && a.role !== "cancel"; }))
      .concat(acts.filter(function (a) { return a.role === "cancel"; }));

    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-action-sheet", props.className);
    rest.role = rest.role || "dialog";
    rest["aria-modal"] = props.overlay ? "true" : undefined;
    if (props.title) rest["aria-labelledby"] = rest["aria-labelledby"] || id + "-t";
    else if (!rest["aria-label"]) rest["aria-label"] = "Actions";
    if (props.message) rest["aria-describedby"] = rest["aria-describedby"] || id + "-m";

    var sheet = h("div", rest,
      props.title || props.message ? h("div", { className: "akg-action-sheet__header" },
        props.title ? h("div", { className: "akg-action-sheet__title", id: id + "-t" }, props.title) : null,
        props.message ? h("div", { className: "akg-action-sheet__message", id: id + "-m" }, props.message) : null
      ) : null,
      props.children,
      h("div", { className: "akg-action-sheet__actions" }, list.map(function (a, i) {
        return h("button", {
          key: i, type: "button", disabled: a.disabled,
          className: AKG.cx("akg-action-sheet__action", "akg-action-sheet__action--" + (a.role || "default")),
          onClick: function (e) { if (a.onClick) a.onClick(e); close(); }
        },
          a.icon ? h("span", { className: "akg-action-sheet__icon akg-sym", "aria-hidden": "true" }, a.icon) : null,
          h("span", { className: "akg-action-sheet__label" }, a.label)
        );
      }))
    );
    if (!props.overlay) return sheet;
    return h("div", { className: AKG.cx("akg-action-sheet-overlay", props.fixed && "akg-action-sheet-overlay--fixed", "akg-action-sheet-overlay--" + (props.align || "center")) },
      h("div", { className: "akg-action-sheet-overlay__scrim", onClick: close, "aria-hidden": "true" }),
      sheet);
  }
  AKG.ActionSheet = ActionSheet;
})(window.AKG = window.AKG || {});

/* Menu */
(function (AKG) {
  var h = window.React.createElement;
  var chevron = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M7.5 4l6 6-6 6" }));
  var check = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2.6, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4 10.5l4 4 8-9" }));
  var ITEM_OWN = ["label", "subtitle", "icon", "shortcut", "destructive", "disabled", "checked", "submenu", "highlighted", "onSelect", "type", "className", "children"];

  // One row: a button with role menuitem (or menuitemcheckbox when `checked` is set).
  function MenuItem(props) {
    var rest = {};
    for (var k in props) if (ITEM_OWN.indexOf(k) < 0) rest[k] = props[k];
    var checkable = props.checked !== undefined;
    rest.type = "button";
    rest.role = checkable ? "menuitemcheckbox" : "menuitem";
    if (checkable) rest["aria-checked"] = props.checked ? "true" : "false";
    if (props.submenu) rest["aria-haspopup"] = "menu";
    rest.disabled = props.disabled;
    rest.tabIndex = -1;
    rest.className = AKG.cx(
      "akg-menu-item",
      props.destructive && "akg-menu-item--destructive",
      props.highlighted && "akg-menu-item--highlighted",
      props.subtitle && "akg-menu-item--subtitle",
      props.className
    );
    rest.onClick = function (e) { if (props.onSelect) props.onSelect(e); if (props.onClick) props.onClick(e); };
    return h("button", rest,
      h("span", { className: "akg-menu-item__check", "aria-hidden": "true" }, props.checked ? h("span", { className: "akg-sym" }, check) : null),
      h("span", { className: "akg-menu-item__icon akg-sym", "aria-hidden": "true" }, props.icon || null),
      h("span", { className: "akg-menu-item__text" },
        h("span", { className: "akg-menu-item__label" }, props.label != null ? props.label : props.children),
        props.subtitle ? h("span", { className: "akg-menu-item__subtitle" }, props.subtitle) : null
      ),
      props.shortcut && !props.submenu ? h("span", { className: "akg-menu-item__shortcut" }, props.shortcut) : null,
      props.submenu ? h("span", { className: "akg-menu-item__chevron akg-sym", "aria-hidden": "true" }, chevron) : null
    );
  }

  function MenuSeparator() { return h("div", { className: "akg-menu-separator", role: "separator" }); }
  function MenuSection(props) { return h("div", { className: "akg-menu-section", role: "presentation" }, props.label != null ? props.label : props.children); }

  var OWN = ["items", "onSelect", "onClose", "className", "children"];
  function Menu(props) {
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    var items = props.items || [];
    var hasCheck = items.some(function (it) { return it.checked !== undefined; });
    window.React.Children.forEach(props.children, function (c) { if (c && c.props && c.props.checked !== undefined) hasCheck = true; });
    rest.role = "menu";
    rest.className = AKG.cx("akg-menu", hasCheck && "akg-menu--checkable", props.className);
    rest.onKeyDown = function (e) {
      if (props.onKeyDown) props.onKeyDown(e);
      if (e.key === "Escape" && props.onClose) { e.preventDefault(); props.onClose(); return; }
      var keys = { ArrowDown: 1, ArrowUp: -1, Home: "first", End: "last" };
      if (!(e.key in keys)) return;
      var list = Array.prototype.slice.call(e.currentTarget.querySelectorAll(".akg-menu-item:not(:disabled)"));
      if (!list.length) return;
      e.preventDefault();
      var i = list.indexOf(document.activeElement), d = keys[e.key];
      var next = d === "first" ? 0 : d === "last" ? list.length - 1 : (i + d + list.length) % list.length;
      if (i < 0 && d === -1) next = list.length - 1;
      list[next].focus();
    };
    if (rest.tabIndex === undefined) rest.tabIndex = 0;
    rest.onFocus = function (e) {
      if (props.onFocus) props.onFocus(e);
      if (e.target === e.currentTarget) { var first = e.currentTarget.querySelector(".akg-menu-item:not(:disabled)"); if (first) first.focus(); }
    };
    return h("div", rest,
      items.map(function (it, i) {
        if (it.type === "separator") return h(MenuSeparator, { key: i });
        if (it.type === "section" || it.type === "header") return h(MenuSection, { key: i, label: it.label });
        var p = {};
        for (var key in it) p[key] = it[key];
        p.key = i;
        p.onSelect = function (e) { if (it.onSelect) it.onSelect(e); if (props.onSelect) props.onSelect(it, i); };
        return h(MenuItem, p);
      }),
      props.children
    );
  }
  AKG.Menu = Menu;
  AKG.MenuItem = MenuItem;
  AKG.MenuSeparator = MenuSeparator;
  AKG.MenuSection = MenuSection;
})(window.AKG = window.AKG || {});

/* Popover */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["open", "placement", "align", "onClose", "anchorRef", "className", "children"];

  // placement = where the popover sits relative to its anchor; the arrow is on the opposite edge.
  // bottom → arrow on top (macOS "North"), top → arrow on the bottom ("South").
  function Popover(props) {
    var R = window.React, ref = R.useRef(null), active = props.open !== false && !!props.onClose;
    var onClose = R.useRef(props.onClose); onClose.current = props.onClose;
    AKG.useEscape(active, function () { onClose.current(); });
    // A tap or click outside the popover (and outside its anchor, which toggles it) closes it.
    R.useEffect(function () {
      if (!active) return;
      var on = function (e) {
        if (ref.current && ref.current.contains(e.target)) return;
        var a = props.anchorRef && props.anchorRef.current;
        if (a && a.contains(e.target)) return;
        onClose.current();
      };
      document.addEventListener("pointerdown", on);
      return function () { document.removeEventListener("pointerdown", on); };
    }, [active]);
    if (props.open === false) return null;
    var placement = props.placement || "bottom";
    var align = props.align || "center";
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-popover", "akg-popover--" + placement, "akg-popover--align-" + align, props.className);
    rest.role = rest.role || "dialog";
    rest.ref = ref;
    return h("div", rest,
      placement !== "none" ? h("span", { className: "akg-popover__arrow", "aria-hidden": "true" }) : null,
      h("div", { className: "akg-popover__body" }, props.children)
    );
  }
  AKG.Popover = Popover;
})(window.AKG = window.AKG || {});

/* Callout */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["variant", "title", "icon", "className", "children"];
  var ICONS = {
    caution: "M10 3 2 17h16zM10 8v4M10 14.5v.01",
    critical: "M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM10 6v5M10 13.8v.01",
    info: "M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM10 9v5M10 6.2v.01"
  };
  // A highlighted note inside content. caution = orange, critical = red, info = accent. Always pairs color with an icon.
  function Callout(props) {
    var variant = props.variant || "info";
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-callout", "akg-callout--" + variant, props.className);
    if (!rest.role) rest.role = variant === "info" ? "note" : "alert";
    var icon = props.icon !== undefined ? props.icon : h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: ICONS[variant] || ICONS.info }));
    return h("div", rest,
      icon ? h("span", { className: "akg-callout__icon akg-sym", "aria-hidden": "true" }, icon) : null,
      h("div", { className: "akg-callout__text" },
        props.title ? h("div", { className: "akg-callout__title" }, props.title) : null,
        props.children ? h("div", { className: "akg-callout__body" }, props.children) : null
      )
    );
  }
  AKG.Callout = Callout;
})(window.AKG = window.AKG || {});

/* SourcePill */
(function (AKG) {
  var h = window.React.createElement;
  var OWN = ["label", "more", "marker", "className", "children"];
  function svg(d, w) { return h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: d })); }
  // Markers shown instead of a source name. verified: checked against a reference that isn't named. practice: common clinical practice.
  // Like SF Symbols at small sizes: the status mark is enclosed and filled (checkmark.circle.fill in system green);
  // the attribution mark is an outline (stethoscope) in the pill's secondary color. Both use the system's 2pt rounded stroke.
  var MARKERS = {
    verified: { glyph: h("svg", { viewBox: "0 0 20 20" }, h("circle", { cx: 10, cy: 10, r: 8.5, fill: "currentColor" }), h("path", { className: "akg-source-pill__check", d: "M6.2 10.4 8.8 13l5-6", fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })), label: "Verified" },
    practice: { glyph: svg("M4 2.5v5.5a4.5 4.5 0 0 0 9 0V2.5M8.5 12.5v1.5a4 4 0 0 0 8 0v-2.5M16.5 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4", 2), label: "Common clinical practice" },
  };
  // A small grey tag naming where a line's information comes from. Tapping it should open a Sheet with the full citation.
  function SourcePill(props) {
    var rest = {};
    for (var k in props) if (OWN.indexOf(k) < 0) rest[k] = props[k];
    rest.type = "button";
    var m = props.marker && MARKERS[props.marker];
    if (m) {
      rest.className = AKG.cx("akg-source-pill", "akg-source-pill--marker", "akg-source-pill--" + props.marker, props.className);
      if (!rest["aria-label"]) rest["aria-label"] = m.label;
      return h("button", rest, h("span", { className: "akg-sym", "aria-hidden": "true" }, m.glyph));
    }
    rest.className = AKG.cx("akg-source-pill", props.className);
    var label = props.label != null ? props.label : props.children;
    if (!rest["aria-label"]) rest["aria-label"] = "Source: " + (typeof label === "string" ? label : "") + (props.more ? ", and " + props.more + " more" : "");
    return h("button", rest, label, props.more ? h("span", { className: "akg-source-pill__more" }, "+" + props.more) : null);
  }
  AKG.SourcePill = SourcePill;

  // One compact line per section naming its sources: "Sources  Guideline '24 · Study '19". The whole line is one button
  // (at least 44pt tall) that opens a Sheet with the full citations. Items are source names or markers.
  function SourceLine(props) {
    var items = props.items || [];
    var rest = {};
    for (var k in props) if (["items", "label", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.type = "button";
    rest.className = AKG.cx("akg-source-line", props.className);
    var spoken = [];
    var parts = [];
    items.forEach(function (it, i) {
      var o = typeof it === "string" ? { label: it } : it;
      if (i) parts.push(h("span", { key: "s" + i, className: "akg-source-line__sep", "aria-hidden": "true" }, "·"));
      var m = o.marker && MARKERS[o.marker];
      if (m) {
        parts.push(h("span", { key: i, className: AKG.cx("akg-source-line__marker", "akg-source-line__marker--" + o.marker) },
          h("span", { className: "akg-sym", "aria-hidden": "true" }, m.glyph),
          o.label != null ? h("span", { className: "akg-source-line__marker-label" }, o.label) : null));
        spoken.push(typeof o.label === "string" ? o.label : m.label);
      } else {
        parts.push(h("span", { key: i, className: "akg-source-line__name" }, o.label));
        if (typeof o.label === "string") spoken.push(o.label);
      }
    });
    var label = props.label != null ? props.label : (items.length === 1 ? "Source" : "Sources");
    if (!rest["aria-label"]) rest["aria-label"] = (typeof label === "string" ? label : "Sources") + ": " + spoken.join(", ");
    return h("button", rest,
      h("span", { className: "akg-source-line__label" }, label),
      h("span", { className: "akg-source-line__items" }, parts));
  }
  AKG.SourceLine = SourceLine;
})(window.AKG = window.AKG || {});

/* ContentSection + SectionBar */
(function (AKG) {
  var h = window.React.createElement;
  var chevron = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M7.5 4.5 13 10l-5.5 5.5" }));

  // "Show Dosing Detail" → "Hide Dosing Detail", so the button always says what it does.
  function lessFor(label) { return typeof label === "string" && /^Show /.test(label) ? label.replace(/^Show /, "Hide ") : "Show Less"; }

  // A titled block of reading content. collapsible + summary = shows one line until opened. more = an extra "More" expander for detail.
  // variant="card": the title sits above a rounded card that holds the body (and an optional footer, such as a SourceLine).
  function ContentSection(props) {
    var React = window.React;
    var st = React.useState(props.defaultExpanded !== undefined ? !!props.defaultExpanded : !props.collapsible);
    var controlled = props.expanded !== undefined;
    var open = controlled ? !!props.expanded : st[0];
    var more = React.useState(false);
    var card = props.variant === "card";
    function toggle() {
      if (!controlled) st[1](!open);
      if (props.onExpandedChange) props.onExpandedChange(!open);
    }
    var bodyId = props.id ? props.id + "-body" : undefined;
    var title = props.collapsible
      ? h(card ? "h2" : React.Fragment, card ? { className: "akg-content-section__heading" } : null,
          h("button", { type: "button", className: "akg-content-section__header akg-content-section__header--button", "aria-expanded": open, "aria-controls": bodyId, onClick: toggle },
            h("span", { className: "akg-content-section__title" }, props.title),
            h("span", { className: AKG.cx("akg-sym akg-content-section__chevron", open && "akg-content-section__chevron--open"), "aria-hidden": "true" }, chevron)))
      : h("div", { className: "akg-content-section__header" }, h("h2", { className: "akg-content-section__title" }, props.title), props.accessory || null);
    var moreBlock = props.more ? h("div", { className: "akg-content-section__more", hidden: !open },
        h("button", { type: "button", className: "akg-content-section__more-button", "aria-expanded": more[0], onClick: function () { more[1](!more[0]); } },
          more[0] ? (props.lessLabel || lessFor(props.moreLabel)) : (props.moreLabel || "Show More Detail"),
          h("span", { className: AKG.cx("akg-sym akg-content-section__chevron", more[0] && "akg-content-section__chevron--down-open"), "aria-hidden": "true" }, chevron)),
        h("div", { className: "akg-content-section__more-body", hidden: !more[0] }, props.more)) : null;
    var summary = !open && props.summary ? h("p", { className: "akg-content-section__summary" }, props.summary) : null;
    // Collapsed content stays mounted (hidden), so anything inside keeps its state, such as a flowchart's answers.
    var body = h("div", { id: bodyId, className: "akg-content-section__body", hidden: !open }, props.children);
    return h("section", { id: props.id, className: AKG.cx("akg-content-section", card && "akg-content-section--card", props.className), style: props.style },
      title,
      card
        ? h(React.Fragment, null,
            summary ? h("div", { className: "akg-content-section__card akg-content-section__card--summary" }, summary) : null,
            h("div", { className: AKG.cx("akg-content-section__card", props.inset === false && "akg-content-section__card--flush"), hidden: !open },
              body, moreBlock,
              props.footer != null ? h("div", { className: "akg-content-section__footer" }, props.footer) : null))
        : h(React.Fragment, null, summary, body, moreBlock)
    );
  }

  // Remembers which sections are open, per page (scope), on this device. Without a scope it only lasts while the page is shown.
  // const s = AKG.useSectionState("topic:anemia"); <ContentSection expanded={s.isOpen("causes", true)} onExpandedChange={(o) => s.setOpen("causes", o)} />
  AKG.useSectionState = function (scope) {
    var React = window.React;
    var key = scope ? "akg-sections:" + scope : null;
    var read = function () {
      if (!key) return {};
      try { return JSON.parse(window.localStorage.getItem(key) || "{}") || {}; } catch (e) { return {}; }
    };
    var st = React.useState(read), map = st[0], setMap = st[1];
    React.useEffect(function () { setMap(read()); }, [key]);
    var save = function (next) {
      setMap(next);
      if (key) try { window.localStorage.setItem(key, JSON.stringify(next)); } catch (e) { /* storage full or blocked: keep it in memory */ }
    };
    return {
      isOpen: function (id, fallback) { return map[id] !== undefined ? !!map[id] : fallback !== undefined ? !!fallback : true; },
      setOpen: function (id, open) { var next = Object.assign({}, map); next[id] = !!open; save(next); },
      setAll: function (ids, open) { var next = Object.assign({}, map); ids.forEach(function (id) { next[id] = !!open; }); save(next); },
      reset: function () { save({}); if (key) try { window.localStorage.removeItem(key); } catch (e) {} }
    };
  };

  // A horizontal row of capsules that jump to sections on the page.
  function SectionBar(props) {
    var React = window.React;
    var items = props.items || [];
    var ref = React.useRef(null);
    var edge = React.useState(""), setEdge = edge[1];
    // Fade the edge that has more capsules beyond it, so it's clear the row scrolls.
    var measure = function () {
      var el = ref.current; if (!el) return;
      var start = el.scrollLeft > 2, end = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
      setEdge((start ? " akg-section-bar--more-start" : "") + (end ? " akg-section-bar--more-end" : ""));
    };
    React.useEffect(function () { measure(); window.addEventListener("resize", measure); return function () { window.removeEventListener("resize", measure); }; }, []);
    // Keep the current capsule in view as the page scrolls.
    React.useEffect(function () {
      var el = ref.current; if (!el) return;
      var cur = el.querySelector(".akg-section-bar__item--current"); if (!cur) return;
      var left = cur.offsetLeft - el.offsetLeft, right = left + cur.offsetWidth;
      if (left < el.scrollLeft + 16 || right > el.scrollLeft + el.clientWidth - 16) { var x = Math.max(0, left - (el.clientWidth - cur.offsetWidth) / 2); if (el.scrollTo) el.scrollTo({ left: x, behavior: "smooth" }); else el.scrollLeft = x; }
    }, [props.value]);
    return h("nav", { ref: ref, onScroll: measure, className: AKG.cx("akg-section-bar", props.className) + edge[0], "aria-label": props["aria-label"] || "Sections" },
      items.map(function (it) {
        var id = typeof it === "string" ? it : it.id;
        var label = typeof it === "string" ? it : it.label;
        return h("button", {
          key: id, type: "button",
          className: AKG.cx("akg-section-bar__item", props.value === id && "akg-section-bar__item--current"),
          "aria-current": props.value === id ? "true" : undefined,
          onClick: function () {
            if (props.onSelect) props.onSelect(id);
            else { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }
          }
        }, label);
      })
    );
  }
  AKG.ContentSection = ContentSection;
  AKG.SectionBar = SectionBar;
})(window.AKG = window.AKG || {});

/* Flowchart */
(function (AKG) {
  var h = window.React.createElement;
  var KIND = { question: "Question", checklist: "Checklist", caution: "Caution", action: "Action", result: "Result" };
  function svg(d, w) { return h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: w || 2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: d })); }
  var CHECK = svg("m5 10.5 3.2 3L15 6.5", 2.4), WARN = svg("M10 3 2 17h16zM10 8v4M10 14.5v.01");

  function outs(s) {
    var o = [];
    (s.answers || []).forEach(function (a) { o.push([a.label, a.to]); });
    if (s.kind === "checklist") { o.push([s.yesLabel || "All present", s.yes]); o.push([s.noLabel || "Not all present", s.no]); }
    if (s.next) o.push([s.nextLabel || "Then", s.next]);
    return o.filter(function (x) { return x[1]; });
  }

  // An interactive algorithm: one step at a time, earlier answers stacked above, plus a focused flowchart map.
  function Flowchart(props) {
    var React = window.React;
    var steps = props.steps || {};
    var start = props.start;
    var stages = props.stages || [];
    var pathSt = React.useState(function () { return [{ id: start }]; });
    var path = pathSt[0], setPath = pathSt[1];
    var viewSt = React.useState(props.defaultView || "steps");
    var view = props.view || viewSt[0];
    function setView(v) { if (!props.view) viewSt[1](v); if (props.onViewChange) props.onViewChange(v); }
    function update(p) { setPath(p); if (props.onPathChange) props.onPathChange(p); }
    function go(to, answer) { update(path.slice(0, -1).concat([{ id: path[path.length - 1].id, answer: answer }, { id: to }])); }
    function back() { if (path.length > 1) update(path.slice(0, -2).concat([{ id: path[path.length - 2].id }])); }
    function jump(i) { update(path.slice(0, i).concat([{ id: path[i].id }])); }
    function restart() { update([{ id: start }]); }
    var cur = steps[path[path.length - 1].id];
    if (!cur) return null;

    var header = h("div", { className: "akg-flowchart__bar" },
      props.showMap === false ? h("span") : h(AKG.SegmentedControl, { options: [{ value: "steps", label: props.stepsLabel || "Steps" }, { value: "map", label: props.mapLabel || "Map" }], value: view, onChange: setView, size: "small" }),
      h(AKG.Button, { variant: "borderless", size: "small", onClick: restart }, props.restartLabel || "Start Over"));

    return h("div", { className: AKG.cx("akg-flowchart", props.className), style: props.style },
      header,
      view === "map" ? h(FlowMap, { steps: steps, start: start, path: path }) : h(StepView, { steps: steps, stages: stages, path: path, cur: cur, go: go, back: back, jump: jump, props: props })
    );
  }

  function StageBar(p) {
    var i = p.stages.indexOf(p.stage);
    if (i < 0) return null;
    return h("div", { className: "akg-flowchart__stage" },
      h("div", { className: "akg-flowchart__stage-track", "aria-hidden": "true" }, p.stages.map(function (s, j) { return h("span", { key: s, className: j < i ? "is-done" : j === i ? "is-now" : "" }); })),
      h("div", { className: "akg-flowchart__stage-label" }, "Stage " + (i + 1) + " of " + p.stages.length + " · " + p.stage));
  }

  function StepView(p) {
    var React = window.React;
    var s = p.cur, steps = p.steps, props = p.props;
    var tick = React.useState(function () { return (s.items || []).map(function () { return false; }); });
    var ticked = tick[0];
    React.useEffect(function () { tick[1]((s.items || []).map(function () { return false; })); }, [s.id]);
    var tone = s.kind === "caution" ? "caution" : s.kind === "result" ? "result" : "default";
    return h(React.Fragment, null,
      h(StageBar, { stages: p.stages, stage: s.stage }),
      p.path.length > 1 ? h("div", { className: "akg-flowchart__history" },
        p.path.slice(0, -1).map(function (x, i) {
          return h("button", { key: i, type: "button", className: "akg-flowchart__history-row", onClick: function () { p.jump(i); } },
            h("span", { className: "akg-sym akg-flowchart__check", "aria-hidden": "true" }, CHECK),
            h("span", { className: "akg-flowchart__history-q" }, (steps[x.id] || {}).title),
            h("span", { className: "akg-flowchart__history-a" }, x.answer));
        })) : null,
      h("div", { className: AKG.cx("akg-flowchart__step", "akg-flowchart__step--" + tone), "aria-live": "polite" },
        h("div", { className: "akg-flowchart__kind" }, s.kind === "caution" ? h("span", { className: "akg-sym", "aria-hidden": "true" }, WARN) : null, s.kindLabel || KIND[s.kind] || KIND.question),
        h("div", { className: "akg-flowchart__title" }, s.title),
        s.detail ? h("div", { className: "akg-flowchart__detail" }, s.detail) : null,
        s.content || null,
        s.answers ? h(AKG.List, { className: "akg-flowchart__answers" }, s.answers.map(function (a) {
          return h(AKG.ListRow, { key: a.label, title: a.label, subtitle: a.detail, chevron: true, onClick: function () { p.go(a.to, a.label); } });
        })) : null,
        s.kind === "checklist" ? h(React.Fragment, null,
          h(AKG.List, { className: "akg-flowchart__answers", footer: s.logic || "All must be present." }, (s.items || []).map(function (it, i) {
            return h(AKG.ListRow, { key: i, title: it, checked: ticked[i], onClick: function () { tick[1](ticked.map(function (v, j) { return j === i ? !v : v; })); } });
          })),
          h(AKG.Button, { variant: "prominent", size: "large", className: "akg-flowchart__wide", onClick: function () { var all = ticked.every(Boolean); p.go(all ? s.yes : s.no, all ? (s.yesLabel || "All present") : (s.noLabel || "Not all present")); } }, props.continueLabel || "Continue")) : null,
        s.list ? h("ul", { className: "akg-flowchart__list" }, s.list.map(function (x, i) { return h("li", { key: i }, x); })) : null,
        s.note ? h(AKG.Callout, { variant: "caution" }, s.note) : null,
        s.links ? h("div", { className: "akg-flowchart__links" }, s.links) : null,
        s.next ? h(AKG.Button, { variant: "prominent", size: "large", className: "akg-flowchart__wide", onClick: function () { p.go(s.next, s.nextLabel || "Done"); } }, props.continueLabel || "Continue") : null
      ),
      p.path.length > 1 && s.kind !== "result" ? h(AKG.Button, { variant: "borderless", onClick: p.back }, props.backLabel || "Previous Step") : null,
      s.kind === "result" && p.path.length > 1 ? h(AKG.List, { header: props.summaryLabel || "Your Path" }, p.path.slice(0, -1).map(function (x, i) {
        return h(AKG.ListRow, { key: i, title: (steps[x.id] || {}).title, subtitle: x.answer });
      })) : null
    );
  }

  // Focused map: top-down flowchart; only the branch you are on is open, others are tappable stubs.
  function FlowMap(p) {
    var React = window.React;
    var steps = p.steps;
    var visited = {}; p.path.forEach(function (x) { visited[x.id] = true; });
    var curId = p.path[p.path.length - 1].id;
    var openSt = React.useState(function () { var o = {}; p.path.forEach(function (x) { o[x.id] = true; }); return o; });
    var open = openSt[0];
    var drawn = {};
    var ref = React.useRef(null);
    React.useEffect(function () {
      var el = ref.current, c = el && el.querySelector(".akg-flowchart__node.is-current");
      if (el && c) { var r = c.getBoundingClientRect(), e = el.getBoundingClientRect(); el.scrollLeft += r.left + r.width / 2 - (e.left + e.width / 2); }
    }, []);
    function node(id, label) {
      var s = steps[id]; if (!s) return null;
      var head = label ? h("div", { className: "akg-flowchart__edge" }, label) : null;
      if (drawn[id]) return h("div", { className: "akg-flowchart__branch" }, head, h("div", { className: "akg-flowchart__node is-stub" }, "Continues at " + s.title));
      if (label && !open[id]) return h("div", { className: "akg-flowchart__branch" }, head,
        h("button", { type: "button", className: "akg-flowchart__node is-stub", onClick: function () { var o = {}; for (var k in open) o[k] = open[k]; o[id] = true; openSt[1](o); } }, s.title, h("span", { "aria-hidden": "true" }, " +")));
      drawn[id] = true;
      var kids = outs(s);
      return h("div", { className: "akg-flowchart__branch" }, head,
        h("div", { className: AKG.cx("akg-flowchart__node", id === curId ? "is-current" : visited[id] ? "is-visited" : "is-idle", s.kind === "caution" && "is-caution") },
          h("div", { className: "akg-flowchart__node-kind" }, s.kindLabel || KIND[s.kind] || KIND.question),
          h("div", { className: "akg-flowchart__node-title" }, s.title)),
        kids.length ? h("div", { className: "akg-flowchart__down", "aria-hidden": "true" }) : null,
        kids.length ? h("div", { className: "akg-flowchart__kids" }, kids.map(function (k) { return h("div", { key: k[0], className: "akg-flowchart__kid" }, node(k[1], k[0])); })) : null);
    }
    return h("div", { ref: ref, className: "akg-flowchart__map" }, h("div", { className: "akg-flowchart__map-inner" }, node(p.start)));
  }
  AKG.Flowchart = Flowchart;
})(window.AKG = window.AKG || {});

/* TappableValue — a value inside running text that opens more detail (a dose, a cutoff, a defined term). */
(function (AKG) {
  var h = window.React.createElement;
  // A span with the button role, not a <button>: a button can't wrap across lines like words do, so a long value would
  // jump to its own line and strand the punctuation after it.
  function TappableValue(props) {
    var rest = {};
    for (var k in props) if (k !== "className" && k !== "children" && k !== "disabled") rest[k] = props[k];
    rest.role = "button";
    rest.tabIndex = props.disabled ? -1 : 0;
    if (props.disabled) { rest["aria-disabled"] = "true"; rest.onClick = undefined; }
    rest.className = AKG.cx("akg-tappable-value", props.className);
    rest.onKeyDown = function (e) {
      if (props.onKeyDown) props.onKeyDown(e);
      if (!props.disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); e.currentTarget.click(); }
    };
    return h("span", rest, props.children);
  }
  AKG.TappableValue = TappableValue;
})(window.AKG = window.AKG || {});

/* Table — a data table for reading content: header row, first column that stays put while the rest scrolls sideways, edge fade when more columns are hidden. */
(function (AKG) {
  var R = window.React, h = R.createElement;
  function Table(props) {
    var ref = R.useRef(null), edge = R.useState("");
    var measure = function () {
      var el = ref.current; if (!el) return;
      var start = el.scrollLeft > 2, end = el.scrollLeft + el.clientWidth < el.scrollWidth - 2;
      edge[1]((start ? " akg-table--more-start" : "") + (end ? " akg-table--more-end" : ""));
    };
    R.useEffect(function () { measure(); window.addEventListener("resize", measure); return function () { window.removeEventListener("resize", measure); }; }, []);
    var sticky = props.stickyFirstColumn !== false;
    var rows = props.rows || [];
    return h("figure", { className: AKG.cx("akg-table", sticky && "akg-table--sticky", props.className) + edge[0], style: props.style },
      h("div", { className: "akg-table__scroll", ref: ref, onScroll: measure },
        h("table", { className: "akg-table__table" },
          props.caption ? h("caption", { className: "akg-table__caption" }, props.caption) : null,
          props.columns ? h("thead", null, h("tr", null, props.columns.map(function (c, i) { return h("th", { key: i, scope: "col" }, c); }))) : null,
          h("tbody", null, rows.map(function (r, i) {
            var cells = Array.isArray(r) ? r : r.cells;
            return h("tr", { key: r.key != null ? r.key : i }, cells.map(function (c, j) {
              return j === 0 && props.rowHeaders !== false ? h("th", { key: j, scope: "row" }, c) : h("td", { key: j }, c);
            }));
          }))
        )
      )
    );
  }
  AKG.Table = Table;
})(window.AKG = window.AKG || {});

/* Figure — an image with a caption and credit; tap to view it full screen and pinch to zoom. */
(function (AKG) {
  var R = window.React, h = R.createElement;
  var xmark = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.45, strokeLinecap: "round" }, h("path", { d: "M5 5l10 10M15 5L5 15" }));
  function Figure(props) {
    var z = R.useState(false), zoomed = z[0];
    var zoomable = props.zoomable !== false;
    var close = function () { z[1](false); };
    AKG.useEscape(zoomed, close);
    R.useEffect(function () { if (zoomed) return AKG.lockScroll(); }, [zoomed]);
    var img = h("img", { className: "akg-figure__image", src: props.src, alt: props.alt || "", width: props.width, height: props.height, loading: "lazy", decoding: "async" });
    return h("figure", { className: AKG.cx("akg-figure", props.paper && "akg-figure--paper", props.className), style: props.style },
      zoomable ? h("button", { type: "button", className: "akg-figure__open", "aria-label": "View full screen", onClick: function () { z[1](true); } }, img) : img,
      props.caption || props.credit ? h("figcaption", { className: "akg-figure__caption" },
        props.caption ? h("span", null, props.caption) : null,
        props.credit ? h("span", { className: "akg-figure__credit" }, props.credit) : null) : null,
      zoomed ? h("div", { className: "akg-figure__viewer", role: "dialog", "aria-modal": "true", "aria-label": props.alt || "Image" },
        h("button", { type: "button", className: "akg-figure__close", "aria-label": "Close", onClick: close }, h("span", { className: "akg-sym" }, xmark)),
        h("div", { className: "akg-figure__stage", onClick: function (e) { if (e.target === e.currentTarget) close(); } },
          h("img", { className: AKG.cx("akg-figure__full", props.paper && "akg-figure__full--paper"), src: props.src, alt: props.alt || "" }))) : null
    );
  }
  AKG.Figure = Figure;
})(window.AKG = window.AKG || {});

/* Banner — an in-app message about the app itself (an update, a lost connection), with an action and a dismiss. */
(function (AKG) {
  var h = window.React.createElement;
  function Banner(props) {
    var actions = props.actions || [];
    return h("div", { className: AKG.cx("akg-banner", props.placement && "akg-banner--" + props.placement, props.className), role: props.role || "status", style: props.style },
      h("div", { className: "akg-banner__text" },
        props.title ? h("div", { className: "akg-banner__title" }, props.title) : null,
        props.children ? h("div", { className: "akg-banner__message" }, props.children) : null),
      h("div", { className: "akg-banner__actions" },
        props.onClose ? h("button", { type: "button", className: "akg-banner__action", onClick: props.onClose }, props.closeLabel || "Later") : null,
        actions.map(function (a, i) {
          return h("button", { key: i, type: "button", className: AKG.cx("akg-banner__action", a.prominent !== false && i === actions.length - 1 && "akg-banner__action--prominent"), onClick: a.onClick }, a.label);
        }))
    );
  }
  AKG.Banner = Banner;
})(window.AKG = window.AKG || {});

/* BottomBar — the floating bar at the bottom of an iPhone screen, for search or a few actions, above the home indicator. */
(function (AKG) {
  var h = window.React.createElement;
  function BottomBar(props) {
    return h("div", { className: AKG.cx("akg-bottom-bar", props.className), style: props.style }, props.children);
  }
  AKG.BottomBar = BottomBar;
})(window.AKG = window.AKG || {});

/* Highlight — marks the parts of a text that match a search query. */
(function (AKG) {
  var h = window.React.createElement;
  function escape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function Highlight(props) {
    var text = String(props.text == null ? "" : props.text), q = String(props.query || "").trim();
    if (!q) return text;
    var words = q.split(/\s+/).filter(Boolean).map(escape);
    var parts = text.split(new RegExp("(" + words.join("|") + ")", "ig"));
    return h(window.React.Fragment, null, parts.map(function (p, i) {
      return i % 2 ? h("mark", { key: i, className: "akg-highlight" }, p) : p;
    }));
  }
  AKG.Highlight = Highlight;
})(window.AKG = window.AKG || {});

/* ShareButton — opens the system share sheet (or copies the link where there is none). */
(function (AKG) {
  var R = window.React, h = R.createElement;
  var share = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M10 3v10M6.5 6.5 10 3l3.5 3.5M5 10v6h10v-6" }));
  var check = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4.5 10.5 8 14l7.5-8" }));
  function ShareButton(props) {
    var c = R.useState(false), copied = c[0];
    var onClick = function () {
      var data = { title: props.title, text: props.text, url: props.url || location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); return; }
      if (navigator.clipboard) navigator.clipboard.writeText(data.url).then(function () { c[1](true); setTimeout(function () { c[1](false); }, 1500); });
    };
    return h(AKG.ToolbarButton, { icon: copied ? check : share, "aria-label": copied ? "Link Copied" : (props.label || "Share"), onClick: onClick, className: props.className });
  }
  AKG.ShareButton = ShareButton;
})(window.AKG = window.AKG || {});

/* NumberField — a labeled number entry for calculators: decimal keyboard, unit, range check. */
(function (AKG) {
  var R = window.React, h = R.createElement;
  function NumberField(props) {
    var t = R.useState(props.defaultValue != null ? String(props.defaultValue) : ""), text = props.value != null ? String(props.value) : t[0];
    var n = text.trim() === "" ? null : Number(text.replace(",", "."));
    var error = props.error;
    if (!error && n != null) {
      if (isNaN(n)) error = "Enter a number.";
      else if ((props.min != null && n < props.min) || (props.max != null && n > props.max))
        error = "Enter a value from " + (props.min != null ? props.min : "") + " to " + (props.max != null ? props.max : "") + (props.unit ? " " + props.unit : "") + ".";
    }
    return h(AKG.TextField, {
      label: props.label, unit: props.unit, error: error, placeholder: props.placeholder, value: text, disabled: props.disabled,
      inputMode: props.integer ? "numeric" : "decimal", enterKeyHint: props.enterKeyHint || "done", autoComplete: "off", className: props.className,
      onChange: function (e) {
        var v = e.target.value;
        if (props.value == null) t[1](v);
        if (props.onChange) { var x = v.trim() === "" ? null : Number(v.replace(",", ".")); props.onChange(x != null && isNaN(x) ? null : x, v); }
      }
    });
  }
  AKG.NumberField = NumberField;
})(window.AKG = window.AKG || {});

/* StepList + Step — numbered steps, each with an optional short condition line and any content. */
(function (AKG) {
  var R = window.React, h = R.createElement;
  var check = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4.5 10.5 8 14l7.5-8" }));
  function omit(props, keys) { var r = {}; for (var k in props) if (keys.indexOf(k) < 0) r[k] = props[k]; return r; }

  // tint: accent (default) or critical (system red, for urgent sequences). Numbers come from the order of the steps.
  function StepList(props) {
    var rest = omit(props, ["tint", "start", "className", "children"]);
    rest.className = AKG.cx("akg-step-list", "akg-step-list--" + (props.tint || "accent"), props.className);
    var n = props.start != null ? props.start : 1, i = 0;
    return h("ol", rest, R.Children.map(props.children, function (child) {
      if (!R.isValidElement(child)) return child;
      var num = n + i++;
      return child.props.number != null ? child : R.cloneElement(child, { number: num });
    }));
  }

  // done: the number becomes a checkmark on gray. current: the step being worked on gets a ring.
  function Step(props) {
    var rest = omit(props, ["number", "title", "condition", "done", "current", "className", "children"]);
    rest.className = AKG.cx("akg-step", props.done && "akg-step--done", props.current && "akg-step--current", props.className);
    if (props.current) rest["aria-current"] = "step";
    return h("li", rest,
      h("span", { className: "akg-step__marker", "aria-hidden": props.done ? undefined : "true" },
        props.done ? h("span", { className: "akg-sym", role: "img", "aria-label": "Done" }, check) : props.number),
      h("div", { className: "akg-step__body" },
        props.condition != null ? h("p", { className: "akg-step__condition" }, props.condition) : null,
        props.title != null ? h("div", { className: "akg-step__title" }, props.title) : null,
        props.children != null ? h("div", { className: "akg-step__content" }, props.children) : null));
  }
  AKG.StepList = StepList;
  AKG.Step = Step;
})(window.AKG = window.AKG || {});

/* Tag — a small capsule label. Status tags pair their color with an icon, never color alone. */
(function (AKG) {
  var h = window.React.createElement;
  var ICONS = {
    info: "M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM10 9v5M10 6.2v.01",
    warning: "M10 3 2 17h16zM10 8v4M10 14.5v.01",
    critical: "M10 2.5a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15zM10 6v5M10 13.8v.01"
  };
  function Tag(props) {
    var variant = props.variant || "neutral";
    var rest = {};
    for (var k in props) if (["variant", "size", "icon", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-tag", "akg-tag--" + variant, "akg-tag--" + (props.size || "small"), props.className);
    var icon = props.icon !== undefined ? props.icon
      : ICONS[variant] ? h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: ICONS[variant] })) : null;
    return h("span", rest,
      icon ? h("span", { className: "akg-sym akg-tag__icon", "aria-hidden": "true" }, icon) : null,
      h("span", { className: "akg-tag__label" }, props.children));
  }
  AKG.Tag = Tag;
})(window.AKG = window.AKG || {});

/* ValueRow — a bold name over a value (numbers line up), with optional tags. Tappable rows show a chevron and open detail. */
(function (AKG) {
  var h = window.React.createElement;
  var chevron = h("svg", { viewBox: "0 0 9 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M1.6 1.6 7.4 8l-5.8 6.4" }));
  function ValueRow(props) {
    var interactive = !!(props.onClick || props.href);
    var rest = {};
    for (var k in props) if (["title", "value", "tags", "surface", "className", "children"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-value-row", interactive ? "akg-value-row--interactive" : "akg-value-row--static",
      props.surface === "raised" && "akg-value-row--raised", props.className);
    var tag = "div";
    if (interactive) {
      if (props.href) tag = "a";
      else { tag = "button"; rest.type = rest.type || "button"; }
    }
    return h(tag, rest,
      h("span", { className: "akg-value-row__text" },
        h("span", { className: "akg-value-row__title" }, props.title),
        props.value != null ? h("span", { className: "akg-value-row__value" }, props.value) : null,
        props.children != null ? h("span", { className: "akg-value-row__extra" }, props.children) : null,
        props.tags != null ? h("span", { className: "akg-value-row__tags" }, props.tags) : null),
      interactive ? h("span", { className: "akg-sym akg-value-row__chevron", "aria-hidden": "true" }, chevron) : null);
  }
  AKG.ValueRow = ValueRow;
})(window.AKG = window.AKG || {});

/* ScaleBar — 2 to 5 ordered bands (mild → severe), each a label and a range, tinted neutral → orange → red. */
(function (AKG) {
  var h = window.React.createElement;
  // Default tones by number of bands. The labels and the order carry the meaning; the tint only reinforces it.
  var RAMP = {
    1: ["neutral"],
    2: ["neutral", "critical"],
    3: ["neutral", "caution", "critical"],
    4: ["neutral", "caution-low", "caution", "critical"],
    5: ["neutral", "caution-low", "caution", "critical-low", "critical"]
  };
  function ScaleBar(props) {
    var segs = (props.segments || []).slice(0, 5);
    var tones = RAMP[Math.max(segs.length, 1)];
    var rest = {};
    for (var k in props) if (["segments", "current", "caption", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-scale-bar", "akg-scale-bar--n" + segs.length, props.className);
    return h("div", rest,
      h("ol", { className: "akg-scale-bar__bands" }, segs.map(function (s, i) {
        var on = props.current === i;
        return h("li", { key: i, className: AKG.cx("akg-scale-bar__band", "akg-scale-bar__band--" + (s.tone || tones[i]), on && "akg-scale-bar__band--current"), "aria-current": on ? "true" : undefined },
          h("span", { className: "akg-scale-bar__label" }, s.label),
          s.range != null ? h("span", { className: "akg-scale-bar__range" }, s.range) : null);
      })),
      props.caption != null ? h("p", { className: "akg-scale-bar__caption" }, props.caption) : null);
  }
  AKG.ScaleBar = ScaleBar;
})(window.AKG = window.AKG || {});

/* ComparisonGrid — two or three labeled columns side by side, for statements that differ by source, option or group. */
(function (AKG) {
  var h = window.React.createElement;
  function ComparisonGrid(props) {
    var cols = (props.columns || []).slice(0, 3);
    var rest = {};
    for (var k in props) if (["title", "columns", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-comparison", "akg-comparison--n" + cols.length, props.className);
    return h("div", rest,
      props.title != null ? h("div", { className: "akg-comparison__title" }, props.title) : null,
      h("div", { className: "akg-comparison__grid", role: "list" }, cols.map(function (c, i) {
        return h("div", { key: i, className: "akg-comparison__cell", role: "listitem" },
          h("div", { className: "akg-comparison__label" }, c.label),
          h("div", { className: "akg-comparison__content" }, c.content));
      })));
  }
  AKG.ComparisonGrid = ComparisonGrid;
})(window.AKG = window.AKG || {});

/* TimePoints — a row of small time chips ("1 h", "2 h", "6 h"), such as when to recheck something. */
(function (AKG) {
  var h = window.React.createElement;
  function TimePoints(props) {
    var rest = {};
    for (var k in props) if (["items", "label", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-time-points", props.className);
    return h("div", rest,
      props.label != null ? h("div", { className: "akg-time-points__label" }, props.label) : null,
      h("ul", { className: "akg-time-points__list", "aria-label": typeof props.label === "string" ? props.label : undefined },
        (props.items || []).map(function (t, i) { return h("li", { key: i, className: "akg-time-points__chip" }, t); })));
  }
  AKG.TimePoints = TimePoints;
})(window.AKG = window.AKG || {});

/* TimerCapsule — elapsed time in a glass capsule with a red dot; variant="accessory" is the full-width bar for TabBar's accessory slot. */
(function (AKG) {
  var R = window.React, h = R.createElement;
  var up = h("svg", { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: "M4.5 12.5 10 7l5.5 5.5" }));

  // "06:32", or "1:02:05" past an hour.
  AKG.formatElapsed = function (sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var hh = Math.floor(sec / 3600), mm = Math.floor(sec / 60) % 60, ss = sec % 60;
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return hh ? hh + ":" + p(mm) + ":" + p(ss) : p(mm) + ":" + p(ss);
  };
  // "6 minutes 32 seconds", for VoiceOver.
  AKG.speakElapsed = function (sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    var hh = Math.floor(sec / 3600), mm = Math.floor(sec / 60) % 60, ss = sec % 60, out = [];
    if (hh) out.push(hh + (hh === 1 ? " hour" : " hours"));
    if (mm) out.push(mm + (mm === 1 ? " minute" : " minutes"));
    if (ss || !out.length) out.push(ss + (ss === 1 ? " second" : " seconds"));
    return out.join(" ");
  };
  // Seconds since `start` (a Date or a timestamp in ms), updated every second while running.
  AKG.useElapsed = function (start, running) {
    var t0 = start instanceof Date ? start.getTime() : start;
    var st = R.useState(Date.now()), now = st[0];
    R.useEffect(function () {
      if (t0 == null || running === false) return;
      st[1](Date.now());
      var id = setInterval(function () { st[1](Date.now()); }, 1000);
      return function () { clearInterval(id); };
    }, [t0, running]);
    return t0 == null ? 0 : Math.max(0, (now - t0) / 1000);
  };

  function TimerCapsule(props) {
    var live = AKG.useElapsed(props.elapsed != null ? null : props.start, props.running);
    var sec = props.elapsed != null ? props.elapsed : live;
    var accessory = props.variant === "accessory";
    var interactive = !!props.onClick;
    var rest = {};
    for (var k in props) if (["start", "elapsed", "running", "variant", "title", "subtitle", "label", "className"].indexOf(k) < 0) rest[k] = props[k];
    rest.className = AKG.cx("akg-timer", accessory ? "akg-timer--accessory" : "akg-timer--capsule", interactive && "akg-timer--interactive", props.running === false && "akg-timer--paused", props.className);
    var spoken = (props.label || "Elapsed time") + ", " + AKG.speakElapsed(sec) + (props.running === false ? ", paused" : "");
    if (accessory && typeof props.title === "string") spoken = props.title + (typeof props.subtitle === "string" ? ", " + props.subtitle : "") + ". " + spoken;
    if (!rest["aria-label"]) rest["aria-label"] = spoken;
    if (interactive) rest.type = "button"; else rest.role = "timer";
    var clock = h("span", { className: "akg-timer__time", "aria-hidden": "true" }, AKG.formatElapsed(sec));
    var dot = h("span", { className: "akg-timer__dot", "aria-hidden": "true" });
    if (!accessory) return h(interactive ? "button" : "div", rest, dot, clock);
    return h(interactive ? "button" : "div", rest, dot,
      h("span", { className: "akg-timer__text", "aria-hidden": "true" },
        props.title != null ? h("span", { className: "akg-timer__title" }, props.title) : null,
        props.subtitle != null ? h("span", { className: "akg-timer__subtitle" }, props.subtitle) : null),
      clock,
      interactive ? h("span", { className: "akg-sym akg-timer__chevron", "aria-hidden": "true" }, up) : null);
  }
  AKG.TimerCapsule = TimerCapsule;
})(window.AKG = window.AKG || {});
