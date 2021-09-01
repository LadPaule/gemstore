import { useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button  } from '@material-ui/core'
import makeStyles from './styles';
import AddressForm from '../AddressForm';
import PayementForm from '../PayementForm';
import { Link } from 'react-router-dom';
import { commerce } from '../../../lib/commerce';


const steps = ['Shipping address', 'Payement Details']
const Checkout = ({ cart, handleCaptureCheckout, order, error }) => {
  const classes = makeStyles();
 
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({})

  useEffect(() => {
    const generateToken = async () =>{
      try{
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' } );
        setCheckoutToken(token)

      } catch(error){


      }
    };
    generateToken();
    
  }, [cart]);

  const nextStep = () => setActiveStep((previousActiveStep)=> previousActiveStep + 1);

  const backStep =() => setActiveStep((previousActiveStep)=> previousActiveStep - 1);
  

  const next= ({ data })=>{
    setShippingData(data)
    nextStep();
  }

  const Form = () => activeStep === 0 ? 
    < AddressForm checkoutToken={checkoutToken} next={next} /> : 
    < PayementForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} 
    handleCaptureCheckout={ handleCaptureCheckout }/>;
  


  let Confirmation = () => order.customer ?  (
    <>
      <div>
        <Typography variant="h5">Thank you {order.customer.firstname}for mining with us!</Typography>
        <Divider className={classes.divider}/>
        <Typography > Order ref: {order.customer.reference} </Typography>
      </div>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
    </>
  ) : (
    <div className={ classes.spinner }>
      < CircularProgress />
    </div>
  );

  if(error){
    <>
      <Typography variant="h5"> Error: {error}</Typography>
      <br />
      <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
    </>
  }



  return ( 
    <>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center"> Checkout </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {
              steps.map((step) =>(
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))
            }
          </Stepper>
          { activeStep === steps.length ?  < Confirmation />:  checkoutToken && < Form /> }
        </Paper>


      </main>
    </>
   );
}
 
export default Checkout;
