import type * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** bordered = gray fill (default) · prominent = accent fill · borderless = text only · tinted = accent label on an accent-tinted fill · toggle = stays on or off (see `pressed`) · glass / glass-prominent = iOS Liquid Glass (macOS falls back to bordered / prominent). */
  variant?: 'bordered' | 'prominent' | 'borderless' | 'tinted' | 'toggle' | 'glass' | 'glass-prominent';
  /** iOS: 28 / 34 / 50pt tall (mini = small, xlarge = large). macOS: mini 16 · small 20 · medium 24 · large 28 · xlarge 36pt. */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Red label or fill for actions that delete or can't be undone. */
  destructive?: boolean;
  /** A symbol before the label: an inline SVG element or a single glyph. With no children the button becomes a square/circle icon button. */
  icon?: React.ReactNode;
  /** variant="toggle" only: on/off state when controlled. Rendered as `aria-pressed`. */
  pressed?: boolean;
  /** variant="toggle" only: initial state when uncontrolled. */
  defaultPressed?: boolean;
  /** variant="toggle" only: called with the new state after a click. */
  onPressedChange?: (pressed: boolean) => void;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface ToggleProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** On/off state when controlled. */
  checked?: boolean;
  /** Initial state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with the new state and the change event. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Dims the switch and blocks changes. */
  disabled?: boolean;
  /** macOS only: mini 36×16 · small 44×20 · medium 54×24 (default) · large 64×28 · xlarge 80×36. iOS always uses the 64×28 switch, whatever the size. */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Optional label shown before the switch; clicking it toggles too. Without it, pass `aria-label`. */
  children?: React.ReactNode;
  /** Forwarded to the inner checkbox. */
  id?: string;
  name?: string;
  value?: string;
  'aria-label'?: string;
}
export declare function Toggle(props: ToggleProps): React.ReactElement;

export interface CheckboxProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Mixed state (a dash): some, but not all, of the items it controls are on. Overrides the checkmark. */
  mixed?: boolean;
  /** Called with the new checked state and the change event. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** macOS: 14 / 16 / 18pt boxes (11pt label for small). iOS always draws a 22pt circle. */
  size?: 'small' | 'medium' | 'large';
  /** Dims the box and label and blocks changes. */
  disabled?: boolean;
  /** id, name, value, required and aria-* go to the inner input type=checkbox. */
  id?: string;
  name?: string;
  value?: string;
  /** The label, drawn to the right of the box. */
  children?: React.ReactNode;
}
export declare function Checkbox(props: CheckboxProps): React.ReactElement;

export interface RadioOption {
  /** Value reported to onChange. */
  value: string | number;
  /** Visible label. */
  label: React.ReactNode;
  /** Dims and blocks this one option. */
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The choices, as objects or plain strings (a string is both value and label). */
  options: Array<RadioOption | string>;
  /** Controlled selected value. */
  value?: string | number;
  /** Initial selected value when uncontrolled. Leave empty to start with nothing chosen. */
  defaultValue?: string | number;
  /** Called with the chosen option's value and the change event. */
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** vertical = stacked (default; list rows on iOS) · horizontal = in a line. */
  orientation?: 'vertical' | 'horizontal';
  /** macOS: 14 / 16 / 18pt circles (11pt label for small). Ignored on iOS. */
  size?: 'small' | 'medium' | 'large';
  /** Disables every option. */
  disabled?: boolean;
  /** Shared name for the inner radio inputs. Generated when omitted. */
  name?: string;
}
export declare function RadioGroup(props: RadioGroupProps): React.ReactElement;

export interface RadioProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state when uncontrolled. */
  defaultChecked?: boolean;
  /** Called with true when this radio becomes selected. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** macOS: 14 / 16 / 18pt circle. */
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  /** name and value go to the inner input type=radio; give every radio in a set the same name. */
  name?: string;
  value?: string;
  /** The label, to the right of the circle (left of the checkmark on iOS). */
  children?: React.ReactNode;
}
/** A single radio button. Prefer RadioGroup, which manages the name and selection. */
export declare function Radio(props: RadioProps): React.ReactElement;

export interface SegmentedControlOption {
  /** Value reported to `onChange`. */
  value: string | number;
  /** Visible text. Omit for icon-only segments (then give `aria-label`). */
  label?: React.ReactNode;
  /** Inline SVG shown before the label (SF Symbols are not bundled). */
  icon?: React.ReactNode;
  /** Blocks this one segment. */
  disabled?: boolean;
  'aria-label'?: string;
}
export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Segments, left to right. Plain strings/numbers are used as both value and label. */
  options: Array<SegmentedControlOption | string | number>;
  /** Selected value when controlled. */
  value?: string | number;
  /** Initial value when uncontrolled (defaults to the first option). */
  defaultValue?: string | number;
  /** Called with the newly selected value. */
  onChange?: (value: string | number) => void;
  /** iOS: mini/small/medium 32pt, large/xlarge 48pt (iOS has no mini or XL). macOS: mini 16 · small 20 · medium 24 · large 28 · xlarge 36pt. */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Dims the whole control and blocks changes. */
  disabled?: boolean;
}
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface PopUpButtonOption {
  value: string | number;
  /** Text shown in the button and the menu. Defaults to String(value). */
  label?: React.ReactNode;
  disabled?: boolean;
}
export interface PopUpButtonItem {
  /** Command text. */
  label?: React.ReactNode;
  /** Leading symbol: an inline SVG or glyph. */
  icon?: React.ReactNode;
  /** Keyboard shortcut text shown trailing, e.g. "⌘D". */
  shortcut?: string;
  destructive?: boolean;
  disabled?: boolean;
  /** separator = hairline · section (or header) = small title using `label`. Omit for a command. */
  type?: 'item' | 'separator' | 'section' | 'header';
  onSelect?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export interface PopUpButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'title' | 'defaultValue'> {
  /** pop-up = shows the chosen value and picks one of several options (default) · pull-down = fixed title and a list of commands. */
  variant?: 'pop-up' | 'pull-down';
  /** macOS only: 20 / 24 / 28pt tall. iOS always uses the list-accessory style. */
  size?: 'small' | 'medium' | 'large';
  /** pop-up: the choices, as strings/numbers or { value, label, disabled }. */
  options?: Array<string | number | PopUpButtonOption>;
  /** pull-down: the commands shown in the menu. */
  items?: PopUpButtonItem[];
  /** pull-down: the fixed button title. children work too. */
  title?: React.ReactNode;
  /** pop-up: the selected option value (controlled). */
  value?: string | number;
  /** pop-up: initial value when uncontrolled. Defaults to the first option. */
  defaultValue?: string | number;
  /** pop-up: called with the newly chosen value. */
  onChange?: (value: string | number) => void;
  /** Whether the menu is open (controlled). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** pop-up: text shown when no option matches `value`. */
  placeholder?: string;
  disabled?: boolean;
  /** Which edge of the button the menu lines up with. */
  align?: 'start' | 'end';
  /** id, name, aria-label and aria-labelledby go to the inner button. */
  id?: string;
  name?: string;
  children?: React.ReactNode;
}
/** A button with aria-haspopup="menu" that opens an attached AKG.Menu. */
export declare function PopUpButton(props: PopUpButtonProps): React.ReactElement;

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Current number when controlled. */
  value?: number;
  /** Initial number when uncontrolled (defaults to `min`, or 0). */
  defaultValue?: number;
  /** Called with the new number after a press. */
  onChange?: (value: number) => void;
  /** Lowest value; the decrement button disables at it. */
  min?: number;
  /** Highest value; the increment button disables at it. */
  max?: number;
  /** Amount added or removed per press (default 1). */
  step?: number;
  /** Disables both buttons. */
  disabled?: boolean;
  /** macOS only: mini 13×16 · small 17×20 · medium 20×24 (default) · large 23×28 · xlarge 30×36. iOS always uses the 92×32 stepper, whatever the size. */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Shows the value as text before the buttons. */
  showValue?: boolean;
  /** Formats the shown value (e.g. `v => v + " min"`). */
  formatValue?: (value: number) => React.ReactNode;
  /** Names the value; the buttons read as "Decrease <label>" / "Increase <label>". */
  'aria-label'?: string;
}
export declare function Stepper(props: StepperProps): React.ReactElement;

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** Controlled text. Pair with onChange. */
  value?: string;
  /** Starting text when uncontrolled. */
  defaultValue?: string;
  /** Fires on every edit, including the clear button (read event.target.value). */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Gray hint shown while the field is empty. Describe what to type, not a label. */
  placeholder?: string;
  /** macOS only: mini 16 · small 20 · medium 24 (default) · large 28 · xlarge 36pt tall (10pt text for mini, 11pt for small, 13pt otherwise). iOS is always a 52pt row, whatever the size. */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** iOS: show the clear (x) button while editing a non-empty field. Default true. macOS never shows it. */
  clearButton?: boolean;
  /** Applied to the wrapper. All other props (name, type, disabled, aria-label, autoComplete...) go to the input. */
  className?: string;
  /** Applied to the wrapper (use it to set a width on macOS). */
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): React.ReactElement;

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  /** Controlled query. Pair with onChange. */
  value?: string;
  /** Starting query when uncontrolled. */
  defaultValue?: string;
  /** Fires on every edit, including the clear button and Escape (read event.target.value). */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Fires with the current query when the person presses Return. */
  onSearch?: (query: string) => void;
  /** Hint text. Default "Search"; also used as the aria-label when none is given. */
  placeholder?: string;
  /** iOS only. filled = gray 44pt capsule for content and sidebars (default) · glass = 48pt Liquid Glass capsule for bottom toolbars and over content. macOS ignores it. */
  variant?: 'filled' | 'glass';
  /** macOS only: mini 16 · small 20 · medium 24 (default) · large 28 · xlarge 36pt tall. iOS ignores it (44pt filled / 48pt glass). */
  size?: 'mini' | 'small' | 'medium' | 'large' | 'xlarge';
  /** Applied to the wrapper (role="search"). All other props go to the input. */
  className?: string;
  /** Applied to the wrapper. */
  style?: React.CSSProperties;
}
export declare function SearchField(props: SearchFieldProps): React.ReactElement;

export interface ComboBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onSelect' | 'defaultValue'> {
  /** The suggestions. People can also type a value that isn't in the list. */
  options?: Array<string | number>;
  /** Field text (controlled). */
  value?: string;
  /** Initial field text when uncontrolled. */
  defaultValue?: string;
  /** Called with the new text on every keystroke and when a suggestion is chosen. */
  onChange?: (value: string) => void;
  /** Called when a suggestion is chosen from the list. */
  onSelect?: (value: string) => void;
  /** Whether the suggestion list is open (controlled). */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Decides which options match the typed text. Default: case-insensitive "contains". */
  filter?: (option: string, text: string) => boolean;
  /** macOS only: 20 / 24 / 28pt tall. */
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
  disabled?: boolean;
  /** id, name, aria-label and aria-labelledby go to the inner input (role="combobox"). */
  id?: string;
  name?: string;
  /** Extra attributes for the inner input. */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}
/** A text field with a dropdown button and a role="listbox" suggestion list; typing filters, choosing fills the field. */
export declare function ComboBox(props: ComboBoxProps): React.ReactElement;

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step' | 'type'> {
  /** Controlled value. Pair with onChange. */
  value?: number;
  /** Starting value when uncontrolled. Default: halfway between min and max. */
  defaultValue?: number;
  /** Fires continuously while dragging, with the new number. */
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Lowest value. Default 0. */
  min?: number;
  /** Highest value. Default 100. */
  max?: number;
  /** Increment. Default: continuous, or one stop per tick mark when `ticks` is set. */
  step?: number | 'any';
  /** Number of evenly spaced tick marks (2 or more) drawn under the track; the knob snaps to them unless `step` says otherwise. */
  ticks?: number;
  /** Glyph at the leading end that stands for the minimum (e.g. a small speaker). Inline SVG or a single character. */
  minimumIcon?: React.ReactNode;
  /** Glyph at the trailing end that stands for the maximum (e.g. a loud speaker). */
  maximumIcon?: React.ReactNode;
  /** Applied to the wrapper. All other props (aria-label, name, disabled...) go to the range input. */
  className?: string;
  /** Applied to the wrapper. */
  style?: React.CSSProperties;
}
export declare function Slider(props: SliderProps): React.ReactElement;

export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Selected date and time when controlled. */
  value?: Date;
  /** Initial date and time when uncontrolled (defaults to now). */
  defaultValue?: Date;
  /** Called with a new Date whenever the day, hour, minute or AM/PM changes. */
  onChange?: (date: Date) => void;
  /** Which parts people can edit (default 'date'). */
  mode?: 'date' | 'time' | 'date-time';
  /** compact = capsule buttons that open a pop-up (default) · graphical = the month grid shown inline. */
  variant?: 'compact' | 'graphical';
  /** Earliest selectable date and time. Earlier days are dimmed and the previous-month arrow stops. */
  min?: Date;
  /** Latest selectable date and time. */
  max?: Date;
  /** BCP 47 locale for month, weekday and time formatting (default 'en-US'). */
  locale?: string;
  /** Label at the start of the time row (default "Time"). */
  label?: string;
  /** Dims the picker and blocks changes. */
  disabled?: boolean;
}
export declare function DatePicker(props: DatePickerProps): React.ReactElement;

export interface ColorWellColor {
  /** Accessible name shown as a tooltip, e.g. "Blue". */
  name: string;
  /** Hex string, e.g. "#0088FF". */
  hex: string;
}
export interface ColorWellProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue'> {
  /** Current color as a hex string when controlled. */
  value?: string;
  /** Initial color when uncontrolled (default "#0088FF"). */
  defaultValue?: string;
  /** Called with the chosen swatch's hex string. */
  onChange?: (hex: string) => void;
  /** Palette swatches, six per row (default ColorWell.colors: the 12 system colors plus six grays). */
  colors?: ColorWellColor[];
  /** macOS only: 32×16 / 40×20 / 48×24 / 56×28 / 72×36 (default regular). iOS always uses the 28pt circle. */
  size?: 'mini' | 'small' | 'regular' | 'large' | 'xl';
  /** Dims the well and blocks the palette. */
  disabled?: boolean;
  /** What the color is for, e.g. "Highlight Color" (default "Color"). */
  'aria-label'?: string;
}
export declare function ColorWell(props: ColorWellProps): React.ReactElement;
export declare namespace ColorWell {
  /** The default palette: 12 system colors (iOS light values) and six grays from white to black. */
  const colors: ColorWellColor[];
}

export interface ListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Section header text above the group. */
  header?: React.ReactNode;
  /** default = 17pt semibold secondary (Nested) · prominent = 20pt semibold · extra-prominent = 22pt bold. macOS always uses a 13pt bold label. */
  headerStyle?: 'default' | 'prominent' | 'extra-prominent';
  /** A trailing control in the header row, e.g. a borderless Button ("Edit", "See All"). */
  headerAction?: React.ReactNode;
  /** Explanatory text under the group. */
  footer?: React.ReactNode;
  /** ListRow elements. */
  children?: React.ReactNode;
}
export declare function List(props: ListProps): React.ReactElement;

export interface ListRowProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title' | 'onClick'> {
  /** Primary label. Falls back to children. */
  title?: React.ReactNode;
  /** Second line under the title; makes the row 68pt tall on iOS. */
  subtitle?: React.ReactNode;
  /** Leading symbol (inline SVG or glyph), drawn in the accent color on iOS and secondary label color on macOS. */
  icon?: React.ReactNode;
  /** Trailing value text in the secondary label color, e.g. "On", "Home Wi-Fi". */
  detail?: React.ReactNode;
  /** Show a trailing disclosure chevron (the row opens another view). */
  chevron?: boolean;
  /** Show a trailing checkmark (the selected option in a choice list). */
  checked?: boolean;
  /** Any trailing node: a Toggle, Stepper, pop-up button, badge. Don't combine with onClick/href. */
  accessory?: React.ReactNode;
  /** Props for a trailing switch. Rendered with AKG.Toggle when it is loaded, otherwise a native checkbox with role="switch". */
  toggle?: { checked?: boolean; defaultChecked?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean };
  /** Makes the whole row a button. */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Makes the whole row a link. */
  href?: string;
  /** Button row: the title is drawn in the accent color. */
  action?: boolean;
  /** Button row for a destructive action: the title is red. */
  destructive?: boolean;
  /** Dims the title and disables onClick. */
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function ListRow(props: ListRowProps): React.ReactElement;

export interface GroupBoxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Optional label above the box (iOS 17pt semibold secondary; macOS 13pt bold). Also names the group for assistive tech. */
  title?: React.ReactNode;
  /** Optional note under the box (iOS 13pt; macOS 11pt), secondary color. */
  footer?: React.ReactNode;
  /** The related controls and text grouped inside the box, stacked with 12pt (iOS) or 10pt (macOS) between them. */
  children?: React.ReactNode;
}
export declare function GroupBox(props: GroupBoxProps): React.ReactElement;

export interface DisclosureGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header text; clicking the header shows or hides the content. */
  label: React.ReactNode;
  /** Controlled expanded state. */
  open?: boolean;
  /** Initial expanded state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new expanded state when the header is clicked. */
  onToggle?: (open: boolean) => void;
  /** chevron = disclosure triangle (leading on macOS, trailing accent on iOS; default) · button = macOS round-rect disclosure button after the label. */
  variant?: 'chevron' | 'button';
  /** Dims the header and blocks toggling. */
  disabled?: boolean;
  /** The content shown when expanded. */
  children?: React.ReactNode;
}
export declare function DisclosureGroup(props: DisclosureGroupProps): React.ReactElement;

export interface DisclosureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Expanded: the chevron points up; collapsed: down. Also sets aria-expanded unless you pass it. */
  open?: boolean;
}
/** The standalone macOS disclosure button (24×24 on macOS, 28pt circle on iOS) for custom layouts. */
export declare function DisclosureButton(props: DisclosureButtonProps): React.ReactElement;

export interface ProgressIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** bar = linear track (default) · spinner = indeterminate eight-spoke activity indicator. */
  variant?: 'bar' | 'spinner';
  /** Bar progress from 0 to max. Leave undefined for an indeterminate bar. Ignored by spinner. */
  value?: number;
  /** Upper bound for value. Default 1. */
  max?: number;
  /** Spinner: iOS 14 / 20 / 35pt, macOS 16 / 32 / 32pt. Bar: macOS small is 6pt tall, otherwise 10pt (iOS bars are always 4pt). */
  size?: 'small' | 'regular' | 'large';
  /** Spinner only: text shown beside it ("Checking for Update…"). Also becomes the aria-label when it is a string. */
  label?: React.ReactNode;
}
export declare function ProgressIndicator(props: ProgressIndicatorProps): React.ReactElement;

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The symbol above the title: an inline SVG or glyph. Omit for the title-and-description-only layout. */
  symbol?: React.ReactNode;
  /** large = the bare symbol at Large Title size (default) · circle = a smaller symbol in a 50pt (macOS 40pt) tinted circle. */
  symbolStyle?: 'large' | 'circle';
  /** Any CSS color for the symbol (and a 15% wash of it behind the circle), e.g. "var(--system-yellow)". Default secondary label. */
  tint?: string;
  /** Short headline naming what's missing ("No Saved Networks"). */
  title?: React.ReactNode;
  /** One or two sentences saying why it's empty or what to do next. */
  description?: React.ReactNode;
  /** Buttons shown below the text, usually one AKG.Button. */
  actions?: React.ReactNode;
  /** Extra content between the text and the actions. */
  children?: React.ReactNode;
}
/** Fills its container and centres its content. role="status" by default. */
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

export interface NotificationAction {
  /** Button label, a short verb ("Reply", "Mark as Read"). */
  label: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Red label for actions that delete or can't be undone. */
  destructive?: boolean;
  disabled?: boolean;
}
export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** App icon: an <img> or inline SVG, drawn in a rounded square (iOS 38pt, macOS 32pt). */
  icon?: React.ReactNode;
  /** One-line bold title (iOS 15pt semibold, macOS 13pt bold). */
  title?: React.ReactNode;
  /** Message text, up to four lines (iOS 15pt, macOS 13pt). */
  body?: React.ReactNode;
  /** When it arrived, e.g. "now" or "9:41 AM". Secondary color, trailing edge. */
  timestamp?: React.ReactNode;
  /** Optional 32pt thumbnail (an <img> or SVG) under the timestamp. */
  image?: React.ReactNode;
  /** Buttons under the content: an array of actions (rendered as small bordered Buttons) or your own nodes. */
  actions?: NotificationAction[] | React.ReactNode;
  /** Shows a close button on the leading top corner (on hover or focus; always on touch screens). */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Accessible label of the close button. Default "Close". */
  closeLabel?: string;
  /** Draws a second banner peeking 8pt below, for a group of notifications from one app. */
  stacked?: boolean;
  /** Extra content under the body. */
  children?: React.ReactNode;
}
export declare function Notification(props: NotificationProps): React.ReactElement;

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The short text to show. Empty or null shows nothing. */
  content?: React.ReactNode;
  /** Where the tooltip sits relative to the child. Default bottom (below the pointer, as on macOS). */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Hover delay in milliseconds before showing. Default 600. Keyboard focus shows it right away. */
  delay?: number;
  /** Forces the tooltip shown or hidden (controlled). */
  open?: boolean;
  /** Initial visibility when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the tooltip shows or hides. */
  onOpenChange?: (open: boolean) => void;
  /** Turns the tooltip off without removing it. */
  disabled?: boolean;
  /** One element (a button, icon, field). It gets aria-describedby pointing at the tooltip. */
  children?: React.ReactNode;
}
/** Shows a role="tooltip" label on hover or keyboard focus of its child. */
export declare function Tooltip(props: TooltipProps): React.ReactElement;

export interface TabBarItem {
  /** Unique key reported to onChange. */
  value: string;
  /** Short tab name, one word if possible. On macOS it becomes the segment's tooltip and accessible name. */
  label: string;
  /** A symbol: an inline SVG element (SF Symbols are not bundled). Without one the tab shows its label only. */
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface TabBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** 2–5 tabs (iOS). Not counting the search tab. */
  items: TabBarItem[];
  /** Selected tab value (controlled). */
  value?: string;
  /** Initially selected tab value (uncontrolled). Defaults to the first item. */
  defaultValue?: string;
  /** Called with the new value when a tab is chosen. */
  onChange?: (value: string) => void;
  /** Show the separate search tab at the trailing end. */
  search?: boolean;
  /** Accessible name of the search tab. Default "Search". */
  searchLabel?: string;
  /** Show the search tab as the active one (tinted). */
  searchSelected?: boolean;
  /** Called when the search tab is pressed. */
  onSearch?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare function TabBar(props: TabBarProps): React.ReactElement;

export interface ToolbarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  /** Screen or window title. iOS: 17pt semibold, centered. macOS: 13pt bold, leading-aligned after the window controls. */
  title?: React.ReactNode;
  /** Second line under the title (iOS 12pt, or 15pt under a large title; macOS 11pt). */
  subtitle?: React.ReactNode;
  /** iOS: show the title as a 34pt bold large title below the bar. Ignored on macOS. */
  largeTitle?: boolean;
  /** Controls at the leading edge, usually a back ToolbarButton. */
  leading?: React.ReactNode;
  /** Controls at the trailing edge: ToolbarButtons or a ToolbarGroup. */
  trailing?: React.ReactNode;
  /** macOS: draw the close / minimize / zoom window controls. Default true. Never shown on iOS. */
  windowControls?: boolean;
  /** Extra content under the bar (for example a search field or segmented control). */
  children?: React.ReactNode;
}
export declare function Toolbar(props: ToolbarProps): React.ReactElement;

export interface ToolbarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ToolbarButtons that share one glass capsule (iOS 44pt with 36pt buttons; macOS 36pt with 28pt buttons). */
  children?: React.ReactNode;
}
export declare function ToolbarGroup(props: ToolbarGroupProps): React.ReactElement;

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** A symbol: an inline SVG element (SF Symbols are not bundled). Icon-only buttons need an aria-label. */
  icon?: React.ReactNode;
  /** Accent-filled button for the screen's main action (Done, Add). One per bar. */
  prominent?: boolean;
  /** Text label, e.g. "Edit" or the back title. */
  children?: React.ReactNode;
}
export declare function ToolbarButton(props: ToolbarButtonProps): React.ReactElement;

export interface SidebarProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** Value of the selected SidebarItem (controlled). */
  value?: string;
  /** Initially selected item value (uncontrolled). */
  defaultValue?: string;
  /** Called with an item's value when it is chosen. */
  onChange?: (value: string) => void;
  /** SidebarSection elements (or SidebarItems directly inside a SidebarSection without a title). */
  children?: React.ReactNode;
}
export declare function Sidebar(props: SidebarProps): React.ReactElement;

export interface SidebarSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section heading. iOS: 17pt medium secondary label. macOS: 11pt bold tertiary. Omit for a section without a header. */
  title?: React.ReactNode;
  /** Short text at the trailing end of the header (a count, "Edit"). */
  detail?: React.ReactNode;
  /** Adds a disclosure chevron that shows and hides the items. */
  collapsible?: boolean;
  /** Start expanded when collapsible. Default true. */
  defaultOpen?: boolean;
  /** SidebarItem elements. */
  children?: React.ReactNode;
}
export declare function SidebarSection(props: SidebarSectionProps): React.ReactElement;

export interface SidebarItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Key reported to Sidebar's onChange and compared with its value to show selection. */
  value?: string;
  /** Leading symbol in the accent color: an inline SVG element (SF Symbols are not bundled). */
  icon?: React.ReactNode;
  /** Row title. Same as children. */
  label?: React.ReactNode;
  /** Trailing secondary text, such as a count or current setting. */
  detail?: React.ReactNode;
  /** Nesting level 0–4. Indents 20pt per level on iOS, 12pt on macOS. */
  level?: number;
  /** Force the selected state, overriding Sidebar's value. */
  selected?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function SidebarItem(props: SidebarItemProps): React.ReactElement;

export interface PageControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Number of pages. Up to 7 show every dot; 8 or more show a window that tapers to smaller dots at the ends. */
  count: number;
  /** Controlled current page, zero-based. */
  value?: number;
  /** Uncontrolled starting page. Default 0. */
  defaultValue?: number;
  /** Called with the new zero-based page when a dot is clicked or an arrow key is pressed. */
  onChange?: (index: number) => void;
  /** Puts the dots on a translucent Ultrathin capsule, for use over photos or busy content. */
  background?: boolean;
  /** Accessible name for the group. Default "Page n of N". */
  label?: string;
}
/** role="group" of buttons; the current one has aria-current="page". Left/Right arrows, Home and End move between pages. */
export declare function PageControl(props: PageControlProps): React.ReactElement;

export interface WindowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Window title. macOS: 13pt bold after the window controls (15pt bold beside a sidebar). iOS: 17pt semibold, centered. */
  title?: React.ReactNode;
  /** Second line under the title (macOS 11pt medium tertiary, e.g. "Edited"). */
  subtitle?: React.ReactNode;
  /** Items at the trailing end of the title bar: ToolbarGroup / ToolbarButton / Button / SearchField. Makes the macOS title bar a 52pt unified toolbar. Don't pass a whole Toolbar. */
  toolbar?: React.ReactNode;
  /** Content of a sidebar column on the leading side (usually a Sidebar). On macOS the window controls move into it. */
  sidebar?: React.ReactNode;
  /** Sidebar column width in px or any CSS length. Default 256 (macOS) / 320 (iOS). */
  sidebarWidth?: number | string;
  /** macOS: draws the window as inactive (gray controls, dimmed title, lighter shadow). */
  inactive?: boolean;
  /** macOS: show the close / minimize / zoom controls. Default true. Never shown on iOS. */
  windowControls?: boolean;
  /** Makes the close control a button that calls this. */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Makes the minimize control a button that calls this. */
  onMinimize?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Makes the zoom control a button that calls this. */
  onZoom?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** The window's content area, below the title bar. It scrolls when the window has a fixed height. */
  children?: React.ReactNode;
}
export declare function Window(props: WindowProps): React.ReactElement;

export interface SheetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controlled visibility. Leave undefined to let the sheet manage its own state. */
  open?: boolean;
  /** Initial visibility when uncontrolled. Defaults to true. */
  defaultOpen?: boolean;
  /** Called by the close button, the scrim, Escape, and the macOS Cancel button. */
  onClose?: () => void;
  /** Shows the iOS checkmark button and the macOS Done button; called when either is pressed. */
  onDone?: () => void;
  /** Toolbar title (iOS, centered) or heading (macOS, leading, bold). */
  title?: React.ReactNode;
  /** iOS height: medium = glass, inset 8pt, about half the screen · large = opaque, nearly full height. Ignored on macOS. */
  detent?: 'medium' | 'large';
  /** Accessible label / macOS button text for the done action. Defaults to "Done". */
  doneLabel?: string;
  /** Accessible label / macOS button text for the close action. Defaults to "Cancel". */
  cancelLabel?: string;
  /** false removes the dimming scrim behind an iOS sheet. */
  dim?: boolean;
  /** Sheet content. */
  children?: React.ReactNode;
}
/** Fills its nearest positioned ancestor; className and other props go to the panel (role="dialog"). */
export declare function Sheet(props: SheetProps): React.ReactElement | null;

export interface AlertAction {
  /** Button text: a short verb ("Delete", "Save") or "Cancel". */
  label: string;
  /** preferred = accent fill · destructive = red label · cancel / default = gray. */
  role?: 'preferred' | 'destructive' | 'cancel' | 'default';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** false hides the alert. Defaults to true. */
  open?: boolean;
  /** Short title, ideally a question or a few words. */
  title: React.ReactNode;
  /** Optional one- or two-sentence explanation. */
  message?: React.ReactNode;
  /** Buttons in display order. Defaults to a single preferred "OK". */
  actions?: AlertAction[];
  /** Text fields shown under the message; each object is spread onto an <input>. */
  fields?: Array<React.InputHTMLAttributes<HTMLInputElement>>;
  /** auto = side by side for one or two actions, stacked for three or more. */
  layout?: 'auto' | 'side-by-side' | 'stacked';
  /** macOS only: the app icon (64pt) shown above the title. Hidden on iOS. */
  icon?: React.ReactNode;
  /** Wraps the alert in a dimming layer that fills and centers within the nearest positioned ancestor. */
  overlay?: boolean;
  /** Extra content under the message. */
  children?: React.ReactNode;
}
export declare function Alert(props: AlertProps): React.ReactElement | null;

export interface ActionSheetAction {
  /** Button text: a short verb phrase ("Delete Photo", "Share"). */
  label: React.ReactNode;
  /** default = primary label · destructive = red label · cancel = always placed last (semibold on iOS, set apart by a separator on macOS). */
  role?: 'default' | 'destructive' | 'cancel';
  /** Optional leading symbol: an inline SVG or glyph. */
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Called on click; the sheet then closes (calls onClose). */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export interface ActionSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled visibility. Leave undefined to let the sheet manage itself. */
  open?: boolean;
  /** Uncontrolled starting visibility. Default true. */
  defaultOpen?: boolean;
  /** Called after an action, a scrim click or Escape. */
  onClose?: () => void;
  /** Optional short title (17pt semibold on iOS, 13pt bold on macOS). */
  title?: React.ReactNode;
  /** Optional one-sentence explanation under the title. */
  message?: React.ReactNode;
  /** The choices, top to bottom. Cancel is moved to the end. */
  actions?: ActionSheetAction[];
  /** Dims and fills the nearest positioned ancestor and anchors the sheet near its bottom (iOS) or centre (macOS). Without it you get the panel alone. */
  overlay?: boolean;
  /** iOS overlay only: horizontal anchor, matching the control that opened it. Default center. */
  align?: 'center' | 'leading' | 'trailing';
  /** Extra content between the message and the actions. */
  children?: React.ReactNode;
}
/** role="dialog"; Escape closes it. */
export declare function ActionSheet(props: ActionSheetProps): React.ReactElement | null;

export interface MenuItemProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Item text. children work too. */
  label?: React.ReactNode;
  /** Second line under the label. */
  subtitle?: React.ReactNode;
  /** Leading symbol: an inline SVG or glyph (17pt on iOS, 13pt on macOS). */
  icon?: React.ReactNode;
  /** Keyboard shortcut text shown trailing, e.g. "⌘C". Mainly for macOS. */
  shortcut?: string;
  /** Red label and symbol. */
  destructive?: boolean;
  disabled?: boolean;
  /** Makes the item a checkbox item and shows the checkmark column; true draws the checkmark. */
  checked?: boolean;
  /** Shows a trailing chevron and sets aria-haspopup. Opening the submenu is up to you. */
  submenu?: boolean;
  /** Forces the hover/selection highlight (for keyboard-driven or demo states). */
  highlighted?: boolean;
  onSelect?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}
export interface MenuEntry extends MenuItemProps {
  /** separator = hairline · section (or header) = small title using `label`. Omit for a regular item. */
  type?: 'item' | 'separator' | 'section' | 'header';
}
export interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Data form of the menu. You can pass MenuItem / MenuSeparator / MenuSection children instead, or both. */
  items?: MenuEntry[];
  /** Called with the entry and its index when an item from `items` is chosen. */
  onSelect?: (item: MenuEntry, index: number) => void;
  children?: React.ReactNode;
}
export interface MenuSectionProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
}
/** role="menu" with arrow-key, Home and End navigation. */
export declare function Menu(props: MenuProps): React.ReactElement;
export declare function MenuItem(props: MenuItemProps): React.ReactElement;
export declare function MenuSeparator(): React.ReactElement;
export declare function MenuSection(props: MenuSectionProps): React.ReactElement;

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /** false hides the popover. Defaults to true. */
  open?: boolean;
  /** Where the popover sits relative to its anchor; the arrow is on the opposite edge. bottom = arrow on top (macOS "North"), top = arrow on the bottom ("South"), left / right = side arrows, none = no arrow. */
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  /** Arrow position along its edge. */
  align?: 'start' | 'center' | 'end';
  /** Called on Escape. */
  onClose?: () => void;
  /** Popover content. The body has 16pt padding. */
  children?: React.ReactNode;
}
/** A container only: you position it next to its anchor. role="dialog". */
export declare function Popover(props: PopoverProps): React.ReactElement | null;

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** caution = orange warning, critical = red danger, info = accent note (default). Color is always paired with an icon. */
  variant?: 'info' | 'caution' | 'critical';
  /** Optional bold first line. */
  title?: React.ReactNode;
  /** Replace the default symbol (an inline SVG at 1em), or pass null for none. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export declare function Callout(props: CalloutProps): React.ReactElement;

export interface SourcePillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Short source name and year, e.g. "ACC/AHA '23". */
  label?: React.ReactNode;
  /** How many further sources support the same line; shown as "+N". */
  more?: number;
  /** Open a Sheet with the full citation(s). */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export declare function SourcePill(props: SourcePillProps): React.ReactElement;

export interface ContentSectionProps {
  /** Section heading (title case). */
  title: React.ReactNode;
  /** Anchor id, used by SectionBar to jump here. */
  id?: string;
  /** Tap the heading to show or hide the body (disclosure chevron on the trailing edge). */
  collapsible?: boolean;
  /** One line shown under the heading while collapsed. */
  summary?: React.ReactNode;
  /** Initial state when uncontrolled. Default: open unless collapsible. */
  defaultExpanded?: boolean;
  /** Open state when controlled. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Extra detail behind a disclosure button under the body. */
  more?: React.ReactNode;
  /** Descriptive label for the disclosure button. Default "Show More Detail". */
  moreLabel?: string;
  lessLabel?: string;
  /** A node at the trailing end of a non-collapsible heading (e.g. a small Button). */
  accessory?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function ContentSection(props: ContentSectionProps): React.ReactElement;

export interface SectionBarItem { id: string; label: React.ReactNode; }
export interface SectionBarProps {
  /** Sections to jump to (ids of ContentSections on the page). */
  items: Array<SectionBarItem | string>;
  /** Highlight the section currently in view. */
  value?: string;
  /** Called on tap; default scrolls the element with that id into view. */
  onSelect?: (id: string) => void;
  className?: string;
  'aria-label'?: string;
}
export declare function SectionBar(props: SectionBarProps): React.ReactElement;

export interface FlowchartAnswer {
  /** The interpretation, in bold (e.g. "Hypotonic"). */
  label: string;
  /** The criteria, in grey under it (e.g. "Serum osmolality below 275 mOsm/kg"). */
  detail?: React.ReactNode;
  /** Id of the step this answer leads to. */
  to: string;
}
export interface FlowchartStep {
  /** question (answers) · checklist (all-of items) · caution (orange, then next) · action · result (end). */
  kind: 'question' | 'checklist' | 'caution' | 'action' | 'result';
  /** Override the small kind label, e.g. "Start". */
  kindLabel?: string;
  /** One of Flowchart.stages; drives the stage bar. */
  stage?: string;
  title: string;
  detail?: React.ReactNode;
  /** Any extra node under the detail (e.g. an inserted dose). */
  content?: React.ReactNode;
  answers?: FlowchartAnswer[];
  /** checklist: items to tick; all ticked → yes, otherwise → no. */
  items?: React.ReactNode[];
  yes?: string; no?: string; yesLabel?: string; noLabel?: string;
  /** Logic line under the checklist. Default "All must be present." */
  logic?: React.ReactNode;
  /** caution / action: the step that follows; shows a Continue button. */
  next?: string; nextLabel?: string;
  /** result: bulleted list (e.g. causes). */
  list?: React.ReactNode[];
  /** A caution Callout under the step. */
  note?: React.ReactNode;
  /** Links to related content. */
  links?: React.ReactNode;
}
export interface FlowchartPathEntry { id: string; answer?: string; }
export interface FlowchartProps {
  /** Every step, by id. Paths may rejoin (two answers leading to one step). */
  steps: Record<string, FlowchartStep>;
  /** Id of the first step. For several entry points, make it a question whose answers are the entry points. */
  start: string;
  /** Ordered stage names for the stage bar. */
  stages?: string[];
  /** "steps" (default) or "map". */
  defaultView?: 'steps' | 'map';
  view?: 'steps' | 'map';
  onViewChange?: (view: 'steps' | 'map') => void;
  /** Hide the Steps/Map control. */
  showMap?: boolean;
  /** Called with the path each time an answer changes it. The component keeps nothing between mounts. */
  onPathChange?: (path: FlowchartPathEntry[]) => void;
  stepsLabel?: string; mapLabel?: string; restartLabel?: string; backLabel?: string; continueLabel?: string; summaryLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Flowchart(props: FlowchartProps): React.ReactElement;

declare global { interface Window { AKG: { Button: typeof Button; Toggle: typeof Toggle; Checkbox: typeof Checkbox; RadioGroup: typeof RadioGroup; Radio: typeof Radio; SegmentedControl: typeof SegmentedControl; PopUpButton: typeof PopUpButton; Stepper: typeof Stepper; TextField: typeof TextField; SearchField: typeof SearchField; ComboBox: typeof ComboBox; Slider: typeof Slider; DatePicker: typeof DatePicker; ColorWell: typeof ColorWell; List: typeof List; ListRow: typeof ListRow; GroupBox: typeof GroupBox; DisclosureGroup: typeof DisclosureGroup; DisclosureButton: typeof DisclosureButton; ProgressIndicator: typeof ProgressIndicator; EmptyState: typeof EmptyState; Notification: typeof Notification; Tooltip: typeof Tooltip; TabBar: typeof TabBar; Toolbar: typeof Toolbar; ToolbarGroup: typeof ToolbarGroup; ToolbarButton: typeof ToolbarButton; Sidebar: typeof Sidebar; SidebarSection: typeof SidebarSection; SidebarItem: typeof SidebarItem; PageControl: typeof PageControl; Window: typeof Window; Sheet: typeof Sheet; Alert: typeof Alert; ActionSheet: typeof ActionSheet; Menu: typeof Menu; MenuItem: typeof MenuItem; MenuSeparator: typeof MenuSeparator; MenuSection: typeof MenuSection; Popover: typeof Popover; Callout: typeof Callout; SourcePill: typeof SourcePill; ContentSection: typeof ContentSection; SectionBar: typeof SectionBar; Flowchart: typeof Flowchart; cx(...c: any[]): string; platform(el?: Element): 'ios' | 'macos' } } }