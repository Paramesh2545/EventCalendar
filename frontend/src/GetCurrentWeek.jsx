import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const GetCurrentWeek = (dateIndices = null) => {
    const date = dateIndices 
        ? dayjs()
            .year(dateIndices.year)
            .month(dateIndices.month)
            .date(dateIndices.day)
        : dayjs();
    
    const startOfWeek = date.startOf('week');
    
    const daysMatrix = new Array(7).fill(null).map((_, index) => {
        return startOfWeek.add(index, 'day');
    });

    const currentTime = {
        hour: dayjs().hour(),
        minute: dayjs().minute(),
        scrollPosition: dayjs().hour() * 80 - 200
    };

    return {
        days: daysMatrix,
        currentTime
    };
};

export default GetCurrentWeek;