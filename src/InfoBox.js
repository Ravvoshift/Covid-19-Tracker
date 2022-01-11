import React from 'react';
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card 
            onClick={props.onClick}
             className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
            >
            <CardContent>

                {/* Title i.e,. Coronavirus cases */}
                <Typography 
                className="info__title"
                color="textSecondary">
                    {title}
                </Typography>
            

                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}color="textSecondary"> {cases}</h2>

                {/* Total cases */}
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;
