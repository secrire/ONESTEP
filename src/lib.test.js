import {countDays} from "./lib.js";
test("Test countDays Function", ()=>{
	expect(countDays('2020-08-20','2020-08-22')).toBe(2);
	expect(countDays('2020-08-22','2020-08-20')).toBe(0);
});