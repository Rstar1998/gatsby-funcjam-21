import React from "react"
import { useForm } from "react-hook-form"
import { useState} from "react";
import { Chart } from "react-google-charts";
import 'bootstrap/dist/css/bootstrap.css';
import {Container , Row , Col , Form , Button , Card , Spinner} from "react-bootstrap"




export default function App() {
    const [spinner, setSpinnnerState] = React.useState(false)
    const [state, setState] = React.useState({ latitude: "", longitude: "" });
    const [isForm , setIsForm] = React.useState(true)
    const [dataBody , changeDataBody] = useState([{
      latitude : 0,
      temperature_2m : 0,
      time : 0,
      generationtime_ms : 0,
      elevation : 0,
      utc_offset_seconds : 0,
      units_temperature_2m : 0,
      longitude : 0     
    }])
    var [ChartData , changeChartData] = useState({data : 0 })

    const  handleChange = (event) => {
      const { name, value } = event.target;  

      setState(prevState => ({
        ...prevState,
        [name]: value
      }));

    }

    const handleReset = ()=> {
      setState({ latitude: "", longitude: "" });
      setIsForm(true)
      changeDataBody({
        latitude : 0,
        temperature_2m : 0,
        time : 0,
        generationtime_ms : 0,
        elevation : 0,
        utc_offset_seconds : 0,
        units_temperature_2m : 0,
        longitude : 0   
      })
      changeChartData({data : 0 })
      setSpinnnerState(false)
    }

    const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length

    async function modifyData(body){
      changeDataBody({
        latitude : body.latitude,
        temperature_2m : body.hourly.temperature_2m,
        time : body.hourly.time,
        generationtime_ms : body.generationtime_ms,
        elevation : body.elevation,
        utc_offset_seconds : body.utc_offset_seconds,
        units_temperature_2m : body.hourly_units.temperature_2m,
        longitude : body.longitude
      })
      console.log(body.hourly.time)
      console.log(body.hourly.temperature_2m)
      let arr1= body.hourly.time
      let arr2 = body.hourly.temperature_2m

      let f=[ ['time', 'temp']]		
      for (var i = 0; i < arr1.length; i++) {
        f.push([arr1[i],arr2[i]])
      }
      changeChartData({data: f})
    }

    async function handleSubmit(event) {
      event.preventDefault();
      if(state.latitude === "" || state.longitude === "" || state.longitude == null || state.latitude == null ){
        return ;
      }
      setSpinnnerState(true)
  
      const requestOptions = {
        method: `POST`,
        body: JSON.stringify(state),
        headers: {
          "content-type": `application/json`,
        },
      };
  
      const response = await fetch(`/api/forms`, requestOptions);
      const json = await response.json();
      await modifyData(json)
      setSpinnnerState(false)  
      setIsForm(false)
    }
  

  //if(isForm){
    return (
          <Container  fluid className='mt-5'>
          <Row  className="justify-content-md-center">
            <Col xs={3} className='mt-5'>
            <Card >
              <Card.Body>
                  <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control type="number" step="any"
                    placeholder="Enter Latitude" 
                    value={state.latitude}
                    name="latitude"
                    onChange={handleChange} 
                    min="-90"
                    max="90"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control type="number" step="any"
                    placeholder="Enter longitude"
                    value = {state.longitude}
                    name="longitude"
                    onChange={handleChange} 
                    min = "-180"
                    max = "80"
                    />
                  </Form.Group>
                  <Row className="justify-content-md-center">
                    <Col>
                        <Button variant="primary" type="submit" >
                        {spinner && (<Spinner animation="border" variant="light" size="sm" />) }       
                        Submit                 
                      </Button> 
                    </Col>
                    <Col>
                        <Button variant="primary"  onClick = {handleReset} >      
                        Reset                 
                      </Button> 
                    </Col>
                  </Row>
                  
                  
                      
                  </Form>            
             </Card.Body>             
            </Card>   
            </Col>
            <Col xs={9}>
            
                { isForm === false && 
                <Card >
                    <Card.Header as="h6" className = "text-center">Weather Data for location coordinates [ {dataBody.latitude} , {dataBody.longitude} ]</Card.Header>
                    <Card.Subtitle className="p-2 text-muted">Elevation : {dataBody.elevation} </Card.Subtitle>
                    <Card.Subtitle className= "p-2 text-muted">Average Temperature : {
                         arrAvg(dataBody.temperature_2m)
                        
                    } {dataBody.units_temperature_2m} </Card.Subtitle>
                    <Card.Body>
                      <Chart
                      width={'900px'}
                      height={'400px'}
                      chartType="LineChart"
                      loader={<div>Loading Chart</div>}
                      data={ChartData.data}
                      options={{
                        hAxis: {
                          title: 'Time',
                        },
                        vAxis: {
                          title: 'Temperature',
                        },
                        
                      }}
                      rootProps={{ 'data-testid': '21' }}
                      />
                      </Card.Body>             
                  </Card>
                  }
             
            </Col>
            
          </Row>
          
        </Container>
                  
      )
    
  
}
