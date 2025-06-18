import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

export const disabledFutureDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current > dayjs().endOf('day');
};

export const disabledPastDate: RangePickerProps['disabledDate'] = (current) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};
