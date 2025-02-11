import { Suspense } from 'react';

// material-ui
import { LinearProgress } from '@mui/material';

// ==============================|| LOADABLE - LAZY LOADING ||============================== //

const Loadable = (Component) => (props) =>
    (
        <Suspense fallback={<LinearProgress />}>
            <Component {...props} />
        </Suspense>
    );

export default Loadable; 