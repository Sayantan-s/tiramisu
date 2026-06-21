// Stub for @react-native-community/datetimepicker.
//
// Storybook's on-device "controls" addon ships a Date control that imports
// react-native-modal-datetime-picker, which in turn requires the native
// @react-native-community/datetimepicker. We don't use date-type controls, so
// rather than add a native module (and a pod install) just to satisfy that
// optional path, Metro resolves the import to this no-op component.
//
// If you ever want real date controls in Storybook, install
// @react-native-community/datetimepicker and delete the resolver override in
// metro.config.js.
function DateTimePickerStub() {
  return null;
}

module.exports = DateTimePickerStub;
module.exports.default = DateTimePickerStub;
module.exports.__esModule = true;
