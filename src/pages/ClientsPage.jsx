import { useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    useDisclosure,
    useToast,
    Alert,
    AlertIcon,
    AlertDescription,
    Flex,
    Spacer,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useColorModeValue,
    Divider,
} from '@chakra-ui/react'
import {
    ViewIcon,
    EditIcon,
    DeleteIcon,
    DownloadIcon,
    RepeatIcon,
    ChevronDownIcon,
    WarningIcon,
    CheckCircleIcon,
} from '@chakra-ui/icons'
import { useSearchParams } from 'react-router-dom'
import ClientTable from '../components/ClientTable'
import ClientModal from '../components/ClientModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { clientService, exportService, validationService } from '../services/api'
import { utils } from '../utils/helpers'

const ClientsPage = () => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedClients, setSelectedClients] = useState([])
    const [exporting, setExporting] = useState(false)
    const [validating, setValidating] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [searchParams] = useSearchParams()

    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    // Cargar clientes
    const loadClients = async (filters = {}) => {
        try {
            setLoading(true)

            // Aplicar filtro desde URL si existe
            const urlFilter = searchParams.get('filter')
            if (urlFilter === 'invalid') {
                filters.has_errors = true
            }

            const response = await clientService.getClients(filters)
            setClients(response.data?.clients || [])
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
            setClients([])
        } finally {
            setLoading(false)
        }
    }

    // Editar cliente
    const handleEditClient = (client) => {
        setSelectedClient(client)
        onOpen()
    }

    // Eliminar cliente
    const handleDeleteClient = async (client) => {
        if (!confirm(`¿Estás seguro de eliminar al cliente "${client.nombre}"?`)) {
            return
        }

        try {
            await clientService.deleteClient(client.id)
            toast(utils.createToast('success', 'Éxito', 'Cliente eliminado correctamente'))
            await loadClients()
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        }
    }

    // Guardar cliente editado
    const handleSaveClient = async (updatedClient) => {
        // Recargar lista después de guardar
        await loadClients()
        setSelectedClient(null)
    }

    // Exportar clientes
    const handleExport = async () => {
        try {
            setExporting(true)
            const response = await exportService.exportToExcel()

            if (response.data?.file_url) {
                exportService.downloadFile(response.data.file_path)
                toast(utils.createToast('success', 'Éxito', 'Archivo exportado correctamente'))
            }
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        } finally {
            setExporting(false)
        }
    }

    // Validar todos los clientes
    const handleValidateAll = async () => {
        try {
            setValidating(true)
            const response = await validationService.validateAll()

            if (response.data?.clients) {
                setClients(response.data.clients)
                toast(utils.createToast('success', 'Éxito', 'Validación completada'))
            }
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        } finally {
            setValidating(false)
        }
    }

    // Limpiar todos los clientes
    const handleClearAll = async () => {
        if (!confirm('¿Estás seguro de eliminar TODOS los clientes? Esta acción no se puede deshacer.')) {
            return
        }

        try {
            await clientService.clearAllClients()
            toast(utils.createToast('success', 'Éxito', 'Todos los clientes han sido eliminados'))
            setClients([])
            setSelectedClients([])
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        }
    }

    // Cerrar modal
    const handleCloseModal = () => {
        setSelectedClient(null)
        onClose()
    }

    // Estadísticas rápidas
    const stats = {
        total: clients.length,
        valid: clients.filter(c => c.is_valid).length,
        invalid: clients.filter(c => !c.is_valid).length,
    }

    const validPercentage = stats.total > 0 ? Math.round((stats.valid / stats.total) * 100) : 0

    useEffect(() => {
        loadClients()
    }, [searchParams])

    if (loading) {
        return <LoadingSpinner text="Cargando clientes..." />
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Header con estadísticas */}
            <Box>
                <Flex align="center" mb={4}>
                    <Box>
                        <Heading size="xl">
                            Gestión de Clientes
                        </Heading>
                        <Text fontSize="lg" color="gray.500">
                            {stats.total > 0
                                ? `${stats.total} clientes cargados • ${validPercentage}% válidos`
                                : 'No hay clientes cargados'
                            }
                        </Text>
                    </Box>
                    <Spacer />

                    {/* Acciones principales */}
                    <HStack spacing={3}>
                        <Button
                            leftIcon={<RepeatIcon />}
                            variant="ghost"
                            onClick={() => loadClients()}
                            isLoading={loading}
                        >
                            Actualizar
                        </Button>

                        {stats.total > 0 && (
                            <>
                                <Button
                                    leftIcon={<CheckCircleIcon />}
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={handleValidateAll}
                                    isLoading={validating}
                                    loadingText="Validando..."
                                >
                                    Re-validar Todo
                                </Button>

                                <Button
                                    leftIcon={<DownloadIcon />}
                                    colorScheme="green"
                                    onClick={handleExport}
                                    isLoading={exporting}
                                    loadingText="Exportando..."
                                >
                                    Exportar Excel
                                </Button>

                                <Menu>
                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline">
                                        Más Acciones
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem
                                            icon={<DeleteIcon />}
                                            onClick={handleClearAll}
                                            color="red.500"
                                        >
                                            Limpiar Todos los Datos
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </>
                        )}
                    </HStack>
                </Flex>

                {/* Estadísticas rápidas */}
                {stats.total > 0 && (
                    <HStack spacing={4}>
                        <Badge size="lg" colorScheme="blue" variant="subtle" px={3} py={1}>
                            Total: {stats.total}
                        </Badge>
                        <Badge size="lg" colorScheme="green" variant="subtle" px={3} py={1}>
                            Válidos: {stats.valid}
                        </Badge>
                        <Badge size="lg" colorScheme="red" variant="subtle" px={3} py={1}>
                            Errores: {stats.invalid}
                        </Badge>
                        <Badge size="lg" colorScheme="purple" variant="subtle" px={3} py={1}>
                            Validez: {validPercentage}%
                        </Badge>
                    </HStack>
                )}
            </Box>

            {/* Alerta cuando no hay datos */}
            {stats.total === 0 && (
                <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                        <VStack align="start" spacing={2}>
                            <Text fontWeight="600">No hay clientes cargados</Text>
                            <Text>
                                Para comenzar, sube un archivo Excel desde la página de "Subir Archivo".
                            </Text>
                        </VStack>
                    </AlertDescription>
                </Alert>
            )}

            {/* Alerta para clientes con errores */}
            {stats.invalid > 0 && (
                <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                        <HStack justify="space-between" w="full">
                            <VStack align="start" spacing={1}>
                                <Text fontWeight="600">
                                    Se encontraron {stats.invalid} clientes con errores
                                </Text>
                                <Text fontSize="sm">
                                    Revisa y corrige los errores para poder exportar datos válidos
                                </Text>
                            </VStack>
                            <Button
                                size="sm"
                                leftIcon={<WarningIcon />}
                                colorScheme="orange"
                                variant="outline"
                                onClick={() => loadClients({ has_errors: true })}
                            >
                                Ver Solo Errores
                            </Button>
                        </HStack>
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabla de clientes */}
            {stats.total > 0 && (
                <Box
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <ClientTable
                        clients={clients}
                        loading={loading}
                        onEdit={handleEditClient}
                        onDelete={handleDeleteClient}
                        onSelectClients={setSelectedClients}
                    />
                </Box>
            )}

            {/* Acciones para clientes seleccionados */}
            {selectedClients.length > 0 && (
                <Box
                    position="fixed"
                    bottom={6}
                    left="50%"
                    transform="translateX(-50%)"
                    bg={cardBg}
                    borderColor={borderColor}
                    borderWidth="1px"
                    borderRadius="lg"
                    shadow="xl"
                    p={4}
                    zIndex={1000}
                >
                    <HStack spacing={4}>
                        <Text fontWeight="600">
                            {selectedClients.length} cliente{selectedClients.length !== 1 ? 's' : ''} seleccionado{selectedClients.length !== 1 ? 's' : ''}
                        </Text>
                        <Divider orientation="vertical" h={6} />
                        <HStack spacing={2}>
                            <Button
                                size="sm"
                                leftIcon={<EditIcon />}
                                colorScheme="blue"
                                variant="outline"
                                isDisabled={selectedClients.length !== 1}
                                onClick={() => {
                                    const client = clients.find(c => c.id === selectedClients[0])
                                    if (client) handleEditClient(client)
                                }}
                            >
                                Editar
                            </Button>
                            <Button
                                size="sm"
                                leftIcon={<DeleteIcon />}
                                colorScheme="red"
                                variant="outline"
                                onClick={async () => {
                                    if (confirm(`¿Eliminar ${selectedClients.length} cliente${selectedClients.length !== 1 ? 's' : ''}?`)) {
                                        try {
                                            for (const clientId of selectedClients) {
                                                await clientService.deleteClient(clientId)
                                            }
                                            toast(utils.createToast('success', 'Éxito', 'Clientes eliminados correctamente'))
                                            setSelectedClients([])
                                            await loadClients()
                                        } catch (error) {
                                            const message = utils.handleApiError(error)
                                            toast(utils.createToast('error', 'Error', message))
                                        }
                                    }
                                }}
                            >
                                Eliminar
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedClients([])}
                            >
                                Cancelar
                            </Button>
                        </HStack>
                    </HStack>
                </Box>
            )}

            {/* Modal de edición */}
            <ClientModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                client={selectedClient}
                onSave={handleSaveClient}
            />
        </VStack>
    )
}

export default ClientsPage