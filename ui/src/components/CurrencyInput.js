import React from 'react';
import theme from '../theme/theme'
import classNames from 'classnames'
import { withStyles } from '@material-ui/styles';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = () => ({
    amountField: {
        width: '100%'
    },
    endAdornment: {
        '& p': {
            color: '#000'
        }
    }
})

class CurrencyInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: ''
        }
    }

    render() {
        const {
            classes,
            onCurrencyChange,
            onAmountChange,
            items
        } = this.props

        const {
            currency
        } = this.state

        return <TextField
            id=""
            className={classes.amountField}
            placeholder='0.00000000'
            margin="normal"
            variant="outlined"
            onChange={(event) => {
                if (onAmountChange) {
                    onAmountChange(Number(event.target.value))
                }
            }}
            InputProps={{
                endAdornment: <InputAdornment position="end">
                    {items && items.length && items.length > 1 ? <InputAdornment position="end">
                        <Select
                          value={currency || items[0]}
                          onChange={(event) => {
                              // console.log(value)
                              onCurrencyChange(event.target.value)
                              this.setState({ currency: event.target.value })
                          }}
                          inputProps={{}}
                        >
                        {items.map((i, index) => <MenuItem key={index} value={i}>{i}</MenuItem>)}
                        </Select>
                    </InputAdornment> : <InputAdornment className={classes.endAdornment} position="end">{items[0]}</InputAdornment>}
                </InputAdornment>
            }}
            inputProps={{ 'aria-label': 'bare' }}
          />
    }
}

export default withStyles(styles)(CurrencyInput);
