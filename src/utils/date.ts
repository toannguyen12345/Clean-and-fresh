import { format } from 'date-fns';

import { FORMAT_DATE } from '@/constants';

export const formatDate = (
  date: Date | string,
  formatStr: string = FORMAT_DATE.DEFAULT,
) => {
  return format(new Date(date), formatStr);
};
