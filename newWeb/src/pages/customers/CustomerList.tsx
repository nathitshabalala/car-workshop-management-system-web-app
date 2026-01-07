import { Box } from "@mui/material"
import Customers from "components/sections/dashboard/customers/Customers";
import { ReactElement } from "react"

const CustomerList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Customers />
            </Box>
        </>
    );
};

export default CustomerList;