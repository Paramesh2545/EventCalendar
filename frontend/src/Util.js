import dayjs from "dayjs";

const Util = (dateIndices = null) => {
    // If no dateIndices provided, use current date
    const date = dateIndices 
        ? dayjs()
            .year(dateIndices.year)
            .month(dateIndices.month)
        : dayjs();

    const year = date.year();
    const month = date.month();

    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
    let currentMonthCount = 0 - firstDayOfTheMonth;

    const daysMatrix = new Array(5).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount));
        });
    });

    return daysMatrix;
};

export default Util;
