import dayjs from 'dayjs';

const checkEndDateFilterEligibility = (startDate: string, endDate: string) => {
  const isAllValuesValid = dayjs(startDate).isValid() && dayjs(endDate).isValid();
  if (!isAllValuesValid) return true;
  if (dayjs(endDate).isSame(dayjs(startDate))) return true;
  return dayjs(endDate).isAfter(dayjs(startDate));
};
export default checkEndDateFilterEligibility;
