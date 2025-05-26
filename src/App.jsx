import { Routes, Route } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import UploadPage from './pages/UploadPage'
import ClientsPage from './pages/ClientsPage'
import { ROUTES } from './utils/constants'

function App() {
    const toast = useToast()

    return (
        <Layout>
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.UPLOAD} element={<UploadPage />} />
                <Route path={ROUTES.CLIENTS} element={<ClientsPage />} />
            </Routes>
        </Layout>
    )
}

export default App