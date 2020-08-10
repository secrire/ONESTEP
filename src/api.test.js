import axios from "axios";

test("Test API", ()=>{
    return axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/taipei.json?access_token=pk.eyJ1IjoidXNoaTczMSIsImEiOiJja2Mwa2llMmswdnk4MnJsbWF1YW8zMzN6In0._Re0cs24SGBi93Bwl_w0Ig&limit=1")
    .then((res) =>  {
        console.log(res.request);
        expect(res.statusText).toBe("OK");
		// expect(res.features).toBeDefined();
		// expect(response.features[0].center.length).toBeGreaterThan(0);
        // expect(response.features[0]).toHaveProperty("text");
        // expect(response.features[0]).toHaveProperty("place_name");
		// expect(typeof response.features[0].center[0]).toBe("number");
    })
});