import { Box } from "@mui/material"
import Invoices from "components/sections/dashboard/invoices/Invoices";
import { ReactElement } from "react"

const MechanicList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Invoices />
            </Box>
        </>
    );
};

export default MechanicList;