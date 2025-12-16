import { createBrowserRouter } from 'react-router-dom';
import Scan from './pages/Scan';
import Confirm from './pages/Confirm';
import Inventory from './pages/Inventory';
import Layout from './components/Layout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Inventory />,
            },
            {
                path: '/scan',
                element: <Scan />,
            },
            {
                path: '/confirm/:ean',
                element: <Confirm />,
            },
            {
                path: '/edit/:id',
                element: <Confirm />,
            },
        ],
    },
]);
