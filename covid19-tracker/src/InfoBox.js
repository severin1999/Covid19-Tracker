import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css'

const InfoBox = ({title, cases, active, isGreen, total, ...props}) => {
    let classNameBoxColor;
    if (active) classNameBoxColor = 'infoBox--selected'
    if (active && isGreen) classNameBoxColor = 'infoBox--green'
    return (
        <Card className={`infoBox ${classNameBoxColor}`} onClick={props.onClick}>
            <CardContent>
                <Typography className='infoBox__title'>
                    {title}
                </Typography>
                <h2 className={`'infoBox__cases' ${isGreen && 'infoBox__cases--green'}`}>
                    {cases}
                </h2>
                <Typography className='infoBox__total' color='textSecondary'>
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
     )
}

export default InfoBox;
 