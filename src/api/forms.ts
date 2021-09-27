import { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import fetch from "node-fetch"


export interface Data {
  latitude: number 
  hourly: h_t
  generationtime_ms: number
  elevation:number
  utc_offset_seconds:number
  hourly_units: h_u
  longitude:number
}

interface h_t{
  temperature_2m:number[]
  time:number[]
}

interface h_u {
  temperature_2m:string
}

async function getData(data:string): Promise<Data> {

  return fetch(data)
          .then(res => res.json())
          .then(res => {
                  return res as Data
          })
}


export default function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
 
  console.log(`submitted form`, req.body)
  
getData('https://api.open-meteo.com/v1/forecast?latitude='+req.body.latitude+'&longitude='+req.body.longitude+'&hourly=temperature_2m')
  .then(weather_data => {   
    
    console.log("after API call" )
    // console.log(weather_data)
    // const arra=weather_data.hourly.temperature_2m
    // const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
    // weather_data['average']=arrAvg(arra)

    res.json(weather_data)
  })
}