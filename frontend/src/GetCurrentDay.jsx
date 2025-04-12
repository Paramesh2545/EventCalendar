import dayjs from "dayjs";

const GetCurrentDay = (dateIndices = null) => {
    const day = dateIndices 
        ? dayjs()
            .year(dateIndices.year)
            .month(dateIndices.month)
            .date(dateIndices.day)
        : dayjs();

    return day;
};

export default GetCurrentDay; 