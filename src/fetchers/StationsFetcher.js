import faker from 'faker';
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function generateStation(){
    const kaaba_x = 924;
    const kaaba_y = 517;
    // let x = getRandomArbitrary(648,1164);
    // let y = getRandomArbitrary(310,736);
    let x = getRandomArbitrary(850,1164);
    let y = getRandomArbitrary(310,736);
    let distance = Math.hypot(x-kaaba_x,y-kaaba_y);    
    // distance = 50;   
    let circlePath = `${distance}px ${distance}px`;
    return {
        "name":`${faker.name.firstName()} ${faker.name.lastName()}` ,
        "country":faker.address.country(),
        "age": getRandomArbitrary(16,70),
        "medical_history":faker.lorem.paragraph(1),
        "mac":faker.internet.mac(),
        "x":kaaba_x - distance,
        "y":kaaba_y - distance,
        "circlePath":circlePath,
        "speed": getRandomArbitrary(60,120),
        "passportId":faker.random.alphaNumeric(),
        "entryDate":faker.date.soon(20),
        "leavingDate":faker.date.recent(20)
        // "x":1100,
        // "y":370    
    }
}
export function getAllStations(){
    return new Promise((resolve,reject)=>{
        let result = [];
        for (let i = 0; i < 1000; i++) {
            result.push(generateStation());      
        }
        resolve({
            data:result
        });
    });
}
    