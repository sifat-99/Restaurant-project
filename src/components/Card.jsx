// import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types'



const CheckCard = ({ menuItem, checked, onChange }) => {

  const handleCheckboxChange = () => {
    onChange(menuItem.id);
  };


  return (
    <Card onClick={handleCheckboxChange} sx={{ cursor: 'pointer', backgroundColor: checked ? '#b71c1c' : 'white', height:'auto' }}>
      <CardContent sx={{display:'flex',flexDirection:'column', alignContent:'center', alignItems:'center',gap:'16px'}}>
        <img className='h-[140px] w-[140px] rounded-full' src={`https://restaurantapi.bssoln.com/images/table/${menuItem?.image}`} alt="Image" />
        <Typography variant="h5" component="div">
          {menuItem.tableNumber}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CheckCard;

CheckCard.propTypes = {
    menuItem: PropTypes.object,
    checked: PropTypes.bool,
    onChange: PropTypes.func
    }
//                   }}
