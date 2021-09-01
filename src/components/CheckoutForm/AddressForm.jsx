import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { InputLabel, Select, MenuItem, Button, Grid, Typography  } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import FormInput from './customTextField';
import { commerce } from '../../lib/commerce'

const AddressForm = ({ checkoutToken, next }) => {
  const methods = useForm();

  const [shippingCountries, setShippingCountries] =useState([]);
  const [shippingCountry, setShippingCountry] =useState('');
  const [shippingSubdivisions, setShippingSubdivisions] =useState([]);
  const [shippingSubdivision, setShippingSubdivision] =useState('');
  const [shippingOptions, setShippingOptions] =useState([]);
  const [shippingOption, setShippingOption] =useState('');


  const countries = Object.entries(shippingCountries).map(([code, name])=> ({id:code, label: name}));
  const subdivisiontoiterrate = Object.entries(shippingSubdivisions).map(([code, name])=> ({id:code, label: name}));
  const optionsTO_iterrate = shippingOptions.map((shippingOp) =>({id: shippingOp.id, label: `${shippingOp.description} - (${shippingOp.price.formatted_with_symbol})`}));

  const fetchShippingCountries = async ( checkoutTokenId ) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
    
  };
  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvice=null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region:stateProvice });
    setShippingOptions(options);
    setShippingOption(options[0].id);
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)

  });

  useEffect(() => {
   if(shippingCountry){
    fetchSubdivisions(shippingCountry)
   } 

  }, [shippingCountry]);

  useEffect(() => {
    if(shippingSubdivision){
      fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    };
    
  }, [shippingSubdivision])

  return ( 
    <>
      <Typography variant ="h6" gutterBottom>
        Shipping address
      </Typography>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data)=>next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}>
          <Grid container spacing={3}>
            < FormInput name='firstname' label="First Name"/>
            < FormInput name='lastname' label="Last Name"/>
            < FormInput name='address1' label="Address"/>
            < FormInput name='email' label="Email"/>
            < FormInput name='city' label="City"/>
            < FormInput name='zipcode' label="Zip / postal code"/>

             <Grid item xs={12} sm={6}>
             <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e)=>setShippingCountry(e.target.value)}>
                { 
                  countries.map((country)=>(
                    <MenuItem key={country.id} value={country.id}>
                      {country.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>


            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping subdivision</InputLabel>
              <Select value={shippingSubdivision} fullWidth onChange={(e)=>setShippingSubdivision(e.target.value)}>
                { 
                  subdivisiontoiterrate.map((subdivision)=>(
                    <MenuItem key={subdivision.id} value={subdivision.id}>
                      {subdivision.label}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>


            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e)=>setShippingOption(e.target.value)}>
                { 
                   optionsTO_iterrate.map((option)=>(
                     <MenuItem key={option.id} value={option.id}>
                       { option.label }
                     </MenuItem>
                   ))
                }
              </Select>
            </Grid>

          </Grid>
          <br/>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Button component={Link} variant="outlined" to="/cart"> back to Cart</Button>
            <Button type="submit" variant="contained" color="primary">Next</Button>

          </div>
        </form>
      </FormProvider>
    </>
   );
}
 
export default AddressForm;
