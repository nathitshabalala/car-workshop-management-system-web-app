import { Box } from "@mui/material"
import Services from "components/sections/dashboard/services/Service";
import { ReactElement } from "react"

const ServicesRequests = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Services />
            </Box>
        </>
    );
};

export default ServicesRequests;