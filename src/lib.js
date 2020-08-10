function countDays(day1, day2){
    if(new Date(day1) < new Date(day2)){
        let days = parseInt(Math.abs(new Date(day2) - new Date(day1)) / 1000 / 60 / 60 / 24);
        return days;
    }else{
        let days = 0;
        return days;
    }
}

export {countDays};