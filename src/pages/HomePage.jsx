import { useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Card,
    CardBody,
    Button,
    VStack,
    HStack,
    Icon,
    useColorModeValue,
    Progress,
    Badge,
    Flex,
    Spacer,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import {
    AddIcon,
    ViewIcon,
    CheckCircleIcon,
    WarningIcon,
    DownloadIcon,
    RepeatIcon
} from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'
import { statsService, exportService } from '../services/api'
import { ROUTES } from '../utils/constants'
import { utils } from '../utils/helpers'
import StatsCard from '../components/StatsCard'
import LoadingSpinner from '../components/LoadingSpinner'

const HomePage = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [exporting, setExporting] = useState(false)
    const toast = useToast()

    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    // Cargar estadísticas
    const loadStats = async () => {
        try {
            setLoading(true)
            const response = await statsService.getStats()
            setStats(response.data?.stats || null)
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        } finally {
            setLoading(false)
        }
    }

    // Exportar datos
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

    useEffect(() => {
        loadStats()
    }, [])

    if (loading) {
        return <LoadingSpinner />
    }

    const hasData = stats && stats.total > 0
    const validPercentage = hasData ? Math.round((stats.valid / stats.total) * 100) : 0
    const invalidPercentage = hasData ? Math.round((stats.invalid / stats.total) * 100) : 0

    return (
        <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="xl" mb={2}>
                    Dashboard
                </Heading>
                <Text fontSize="lg" color="gray.500">
                    Vista general del sistema de validación de clientes
                </Text>
            </Box>

            {/* Alerta cuando no hay datos */}
            {!hasData && (
                <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>¡Bienvenido!</AlertTitle>
                        <AlertDescription>
                            No hay datos cargados. Comienza subiendo un archivo Excel con datos de clientes.
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Estadísticas principales */}
            {hasData && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    <StatsCard
                        label="Total de Clientes"
                        value={stats.total}
                        icon={ViewIcon}
                        color="blue"
                    />
                    <StatsCard
                        label="Clientes Válidos"
                        value={stats.valid}
                        icon={CheckCircleIcon}
                        color="green"
                        percentage={validPercentage}
                    />
                    <StatsCard
                        label="Clientes con Errores"
                        value={stats.invalid}
                        icon={WarningIcon}
                        color="red"
                        percentage={invalidPercentage}
                    />
                    <StatsCard
                        label="Porcentaje de Validez"
                        value={`${validPercentage}%`}
                        icon={validPercentage > 80 ? CheckCircleIcon : WarningIcon}
                        color={validPercentage > 80 ? "green" : "yellow"}
                    />
                </SimpleGrid>
            )}

            {/* Progreso de validación */}
            {hasData && (
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Flex align="center">
                                <Heading size="md">Progreso de Validación</Heading>
                                <Spacer />
                                <Badge
                                    colorScheme={validPercentage > 80 ? "green" : "yellow"}
                                    variant="subtle"
                                    fontSize="sm"
                                >
                                    {validPercentage}% Completado
                                </Badge>
                            </Flex>

                            <Progress
                                value={validPercentage}
                                colorScheme={validPercentage > 80 ? "green" : "yellow"}
                                size="lg"
                                borderRadius="md"
                            />

                            <HStack justify="space-between" fontSize="sm" color="gray.500">
                                <Text>{stats.valid} válidos</Text>
                                <Text>{stats.invalid} con errores</Text>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            )}

            {/* Errores por campo */}
            {hasData && stats.errors_by_field && Object.keys(stats.errors_by_field).length > 0 && (
                <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                    <CardBody>
                        <VStack spacing={4} align="stretch">
                            <Heading size="md">Errores por Campo</Heading>

                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                {Object.entries(stats.errors_by_field).map(([field, count]) => (
                                    <Box key={field} p={4} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200">
                                        <HStack justify="space-between">
                                            <VStack align="start" spacing={1}>
                                                <Text fontWeight="600" textTransform="capitalize">
                                                    {field}
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    {count} error{count !== 1 ? 'es' : ''}
                                                </Text>
                                            </VStack>
                                            <Badge colorScheme="red" variant="solid">
                                                {Math.round((count / stats.invalid) * 100)}%
                                            </Badge>
                                        </HStack>
                                    </Box>
                                ))}
                            </SimpleGrid>
                        </VStack>
                    </CardBody>
                </Card>
            )}

            {/* Acciones rápidas */}
            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
                <CardBody>
                    <VStack spacing={6} align="stretch">
                        <Heading size="md">Acciones Rápidas</Heading>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                            {/* Subir archivo */}
                            <Button
                                as={RouterLink}
                                to={ROUTES.UPLOAD}
                                leftIcon={<AddIcon />}
                                colorScheme="brand"
                                size="lg"
                                h="auto"
                                p={6}
                                variant="outline"
                                _hover={{ transform: 'translateY(-2px)' }}
                            >
                                <VStack spacing={2}>
                                    <Text fontWeight="600">Subir Archivo</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Cargar nuevo archivo Excel
                                    </Text>
                                </VStack>
                            </Button>

                            {/* Ver clientes */}
                            <Button
                                as={RouterLink}
                                to={ROUTES.CLIENTS}
                                leftIcon={<ViewIcon />}
                                colorScheme="blue"
                                size="lg"
                                h="auto"
                                p={6}
                                variant="outline"
                                _hover={{ transform: 'translateY(-2px)' }}
                            >
                                <VStack spacing={2}>
                                    <Text fontWeight="600">Ver Clientes</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Gestionar datos cargados
                                    </Text>
                                </VStack>
                            </Button>

                            {/* Exportar */}
                            <Button
                                onClick={handleExport}
                                leftIcon={<DownloadIcon />}
                                colorScheme="green"
                                size="lg"
                                h="auto"
                                p={6}
                                variant="outline"
                                isLoading={exporting}
                                loadingText="Exportando..."
                                isDisabled={!hasData}
                                _hover={{ transform: 'translateY(-2px)' }}
                            >
                                <VStack spacing={2}>
                                    <Text fontWeight="600">Exportar Excel</Text>
                                    <Text fontSize="sm" color="gray.500">
                                        Descargar datos corregidos
                                    </Text>
                                </VStack>
                            </Button>
                        </SimpleGrid>
                    </VStack>
                </CardBody>
            </Card>

            {/* Botón de actualizar */}
            <Flex justify="center">
                <Button
                    onClick={loadStats}
                    leftIcon={<RepeatIcon />}
                    variant="ghost"
                    size="sm"
                    isLoading={loading}
                >
                    Actualizar Estadísticas
                </Button>
            </Flex>
        </VStack>
    )
}

export default HomePage