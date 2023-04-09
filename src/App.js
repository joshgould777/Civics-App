
import { Card, CardContent, Checkbox, Container, FormGroup, FormControlLabel, Grid, Input, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, Item } from 'react';
import axios from 'axios';

export default function App() {

  const [message, setMessage] = useState('2112 Salt Kettle Way, Reston VA');
  const [fedData, setFedData] = useState({fedData: []});
  const [stateData, setStateData] = useState({stateData: []});
  const [localData, setLocalData] = useState({localData: []});



  const handleClick = async () => {
    let rootURL = 'https://civicinfo.googleapis.com/civicinfo/v2/representatives';
    let address=document.getElementById("AddressInput").value;
    // collect data from all the Federal checkmarks
    const listedFederalOfficial = document.getElementsByClassName('federal') //Get every federal (country) checkbox
    let federalRoleString = "";
    let fedCounter=0;
    let stateRoleString = "";
    let stateCounter=0;
    
    for (var i = 0; i < listedFederalOfficial.length; i++) {
      if (listedFederalOfficial[i].firstChild.classList.contains("Mui-checked")) {    //Filter out unchecked boxes
        federalRoleString += "&roles=" + listedFederalOfficial[i].getAttribute("officialdata") //Add the office to the checkedOfficials
        fedCounter++;
      }
    }

    // Make the Federal ajax call for data...
    if (fedCounter> 0) {
      let queryString = rootURL+'?address='+address+'&levels=country'+federalRoleString+'&key=AIzaSyBIwi7G16qeQI0nTqIIjNK9VFSqa1hl8fY';
      axios.get(queryString).then((response) => {
        setFedData(response.data)
      }).catch((error) => {
        alert("Problem submitting address. ", error);
      });
    } else {
      setFedData([]);
    }

    // collect data from all the State checkmarks
    const listedStateOfficial = document.getElementsByClassName('state') //Get every federal (country) checkbox
    for (i = 0; i < listedStateOfficial.length; i++) {
      if (listedStateOfficial[i].firstChild.classList.contains("Mui-checked")) {    //Filter out unchecked boxes
        stateRoleString += "&roles=" + listedStateOfficial[i].getAttribute("officialdata") //Add the office to the checkedOfficials
        stateCounter++;
      }
    }

    // Make the State ajax call for data...
    if (stateCounter > 0) {
      let StateQueryString = rootURL+'?address='+address+'&levels=administrativeArea1'+stateRoleString+'&key=AIzaSyBIwi7G16qeQI0nTqIIjNK9VFSqa1hl8fY';
      axios.get(StateQueryString).then((response) => {
        setStateData(response.data);
      }).catch((error) => {
          alert("Problem submitting address. ", error);
      });
    } else {
      setStateData([]);
    }

    // Make the Local ajax call for data...
    const listedLocalOfficial = document.getElementsByClassName('local');
    if (listedLocalOfficial[0].firstChild.classList.contains("Mui-checked")) {
      let LocalQueryString = rootURL+'?address='+address+'&levels=administrativeArea2&rolls=administrativeArea2&key=AIzaSyBIwi7G16qeQI0nTqIIjNK9VFSqa1hl8fY';
      axios.get(LocalQueryString).then((response) => {
        setLocalData(response.data);
      }).catch((error) => {
          alert("Problem submitting address. ", error);
      });
    } else {
      setLocalData([]);
    }
  }; 

  const checkForErrors = (databack) => {
    console.log("databack = " + databack.error.code);
  }

  const Search = () => {
    return (
      <div className='align-right'>
        <button color="green" onClick={handleClick}>Search</button>
      </div>
    )
  }

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const Item = styled(Paper)(() => ({
    backgroundColor: 'rgba(0,0,0,.5)',
    padding: 8,
    margin: '10px',
    textAlign: 'center',
    color: '#FFF',
    minHeight: '260px'
  }));
 
  return (
    <Container maxWidth="md">
      <Paper className="Container" spacing={2}>
        <Grid className="MainGrid">
          <Grid className="TextHeader" item>Find Your Elected Officials</Grid>
          <Grid className="SubTextHeader" item>Enter your address</Grid>
          <Grid item>
            <Input 
            className="AddressInput"
            id="AddressInput"
            autoFocus
            value={message}
            icon="search"
            type="text"
            name="message"
            onChange={handleChange}
            autoFocus sx={{input: {textAlign: "center"}}} />
          </Grid>
          <Grid className="threeColumns" container>
            <Grid item xs={4}>
              Federal
              <FormGroup>
                <FormControlLabel level="country" officialdata="headOfGovernment" className="federal checkbox" control={<Checkbox />} label="President" />
                <FormControlLabel level="country" officialdata="deputyHeadOfGovernment" className="federal checkbox" control={<Checkbox />} label="Vice President" />
                <FormControlLabel level="country" officialdata="legislatorUpperBody" className="federal checkbox" control={<Checkbox />} label="Senators" />
                <FormControlLabel level="country" officialdata="legislatorLowerBody" className="federal checkbox" control={<Checkbox />} label="U.S. Representative" />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              State
              <FormGroup>
                <FormControlLabel level="administrativeArea1" officialdata="headOfGovernment" className="state checkbox" control={<Checkbox />} label="Governor" />
                <FormControlLabel level="administrativeArea1" officialdata="deputyHeadOfGovernment" className="state checkbox" control={<Checkbox />} label="Lieutenant Governor" />
                <FormControlLabel level="administrativeArea1" officialdata="legislatorUpperBody" className="state checkbox" control={<Checkbox />} label="State Senator" />
                <FormControlLabel level="administrativeArea1" officialdata="legislatorLowerBody" className="state checkbox" control={<Checkbox />} label="State Representative" />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              Local
            <FormGroup>
                <FormControlLabel level="administrativeArea2" officialdata="administrativeArea2" className="local checkbox" control={<Checkbox />} label="Local" />
              </FormGroup>
            </Grid>
          </Grid>
          <Search />

          <Grid sx={{marginTop: '0px'}} container spacing={0}>
            {fedData.offices?.map((offices, officeIndex) => {
            return (
              <Grid item sm={12} md={6} key={officeIndex}>
                <Item elevation={3}>
                  <h2>{offices.name} </h2>
                  {fedData.officials?.map((officials, index) => {
                    if(officeIndex == index) {
                      return (
                            <div key={officials.name}>
                              <div className="details">{officials.name}<br/>
                                {officials.geocodingSummaries[0].queryString}<br/>
                                {officials.party}<br/>
                                {officials.phones}<br/>
                                <a href={officials.urls[0]}>{officials.urls[0]}</a><br/>
                                <a href={officials.urls[1]}>{officials.urls[1]}</a><br/><br/>
                                </div>
                            </div>
                      );
                    }
                  })}
                  </Item>
              </Grid>
            );
          })}

          {stateData.offices?.map((offices, officeIndex) => {
            return (
              <Grid item sm={12} md={6} key={officeIndex}>
                  <Item elevation={3}>
                <h2>{offices.name} </h2>
                {stateData.officials?.map((officials, index) => {
                  if(officeIndex == index) {
                    return (
                          <div key={officials.name}>
                            <div className="details">{officials.name}<br/>
                              {officials.geocodingSummaries[0].queryString}<br/>
                              {officials.party}<br/>
                              {officials.phones}<br/>
                              {officials?.urls?
                              <><a href={officials.urls[0]}>{officials.urls[0]}</a><br/>
                              <a href={officials.urls[1]}>{officials.urls[1]}</a><br/><br/></>
                              : ''}
                              </div>
                          </div>
                    );
                  }
                  })}
                </Item>
              </Grid>
            );
          })}

          {localData.offices?.map((offices, officeIndex) => {
            return (
              <Grid item sm={12} md={6} key={officeIndex}>
                  <Item elevation={3}>
                    <h2>{offices.name} </h2>
                    {localData.officials?.map((officials, index) => {
                      if(officeIndex == index) {
                        return (
                          <div key={index}>
                            <div className="details">{officials.name}<br/>
                              {officials.geocodingSummaries[0]?.queryString}<br/>
                              {officials.party}<br/>
                              {officials.phones}<br/>
                              {officials?.urls?
                                <><a href={officials.urls[0]}>{officials.urls[0]}</a><br/>
                                <a href={officials.urls[1]}>{officials.urls[1]}</a><br/><br/></>
                               : ''}
                              </div>
                          </div>
                        );
                      }
                    })}
                </Item>
              </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
