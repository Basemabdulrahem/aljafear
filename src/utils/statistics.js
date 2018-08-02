import orderBy from 'lodash/orderBy';

export function mapFrequancyToData(frequancy_array){
    let result = frequancy_array.map((e)=>{
        let key = Object.keys(e)[0];
        let value = e[key];
        return {
            x : key,
            y : value
        };
    });
    result = result.filter((v)=> v.x !== "");
    return orderBy(result,['y'],['desc']);
    
}
export function mapAggregationToData(aggregation_data){
    let result = aggregation_data.map((e) => {
        return {
            x: e['key'],
            y: e['doc_count']
        }
    });
    result = result.filter((v)=> v.x !== "");
    return orderBy(result,['y'],['desc']);
}

export function mapSubAggregationToData(aggregation_data,subaggr_name){
    let result = aggregation_data.map((e) => {
        return {
            x: e['key'],
            y: e[subaggr_name].value
        }
    });
    result = result.filter((v)=> v.x !== "");
    return orderBy(result,['y'],['desc']);
}