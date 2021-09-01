import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import makeStyles from './styles';

const CartItem = ({ item, handleRemoveFromCart, handleUpdateCartQty, }) => {
  const classes = makeStyles();

  return ( 
    <Card>
      < CardMedia  image={item.media.source} alt={item.name} className={classes.media}/>
      <CardContent className={classes.CardContent}>
        <Typography variant="h4">{item.name}</Typography>
        <Typography variant="h5">{item.line_total.fomartted_with_symbol}</Typography>
      </CardContent>

      <CardActions className={classes.CardActions}>

        <div className={classes.buttons}>
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}>-</Button>
          <Typography>&nbsp;{item.quantity}&nbsp;</Typography>
          <Button type="button" size="small" onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}>+</Button>
        </div>

        <Button variant="contained" type="button" color="secondary"onClick={()=>handleRemoveFromCart(item.id)}> Remove </Button>
      </CardActions>
    </Card>
   );
}
 
export default CartItem;
