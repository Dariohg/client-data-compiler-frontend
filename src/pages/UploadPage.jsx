import { useState, useEffect } from 'react'
import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Button,
    Card,
    CardBody,
    SimpleGrid,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useToast,
    Divider,
    Badge,
    Progress,
    List,
    ListItem,
    ListIcon,
    Icon,
} from '@chakra-ui/react'
import {
    DownloadIcon,
    CheckCircleIcon,
    WarningIcon,
    InfoIcon,
    ViewIcon
} from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import FileUpload from '../components/FileUpload'
import StatsCard from '../components/StatsCard'
import { uploadService, statsService } from '../services/api'
import { utils } from '../utils/helpers'
import { ROUTES } from '../utils/constants'

const UploadPage = () => {
    const [uploadResult, setUploadResult] = useState(null)
    const [currentStats, setCurrentStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    // Cargar estadísticas actuales
    const loadCurrentStats = async () => {
        try {
            const response = await statsService.getStats()
            setCurrentStats(response.data?.stats)
        } catch (error) {
            // Error silencioso, no hay datos previos
            setCurrentStats(null)
        }
    }

    // Descargar plantilla
    const handleDownloadTemplate = async () => {
        try {
            await uploadService.downloadTemplate()
            toast(utils.createToast('success', 'Éxito', 'Plantilla descargada correctamente'))
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        }
    }

    // Manejar éxito de subida
    const handleUploadSuccess = async (result) => {
        setUploadResult(result)
        // Recargar estadísticas después de subir
        await loadCurrentStats()
    }

    // Manejar error de subida
    const handleUploadError = (error) => {
        setUploadResult(null)
    }

    useEffect(() => {
        loadCurrentStats()
    }, [])

    return (
        <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
                <Heading size="xl" mb={2}>
                    Subir Archivo Excel
                </Heading>
                <Text fontSize="lg" color="gray.500">
                    Carga un archivo Excel con datos de clientes para validar y procesar
                </Text>
            </Box>

            {/* Estadísticas actuales si existen */}
            {currentStats && currentStats.total > 0 && (
                <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Datos actuales en el sistema:</AlertTitle>
                        <AlertDescription>
                            <HStack spacing={4} mt={2}>
                                <Badge colorScheme="blue" variant="subtle">
                                    {currentStats.total} clientes
                                </Badge>
                                <Badge colorScheme="green" variant="subtle">
                                    {currentStats.valid} válidos
                                </Badge>
                                <Badge colorScheme="red" variant="subtle">
                                    {currentStats.invalid} con errores
                                </Badge>
                            </HStack>
                            <Text fontSize="sm" mt={2} color="gray.600">
                                Al subir un nuevo archivo, se reemplazarán los datos actuales.
                            </Text>
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Sección principal - Subida de archivo */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                {/* Panel de subida */}
                <VStack spacing={6} align="stretch">
                    <Card>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <Box>
                                    <Heading size="md" mb={2}>
                                        Cargar Archivo
                                    </Heading>
                                    <Text color="gray.500">
                                        Selecciona o arrastra tu archivo Excel
                                    </Text>
                                </Box>

                                <FileUpload
                                    onUploadSuccess={handleUploadSuccess}
                                    onUploadError={handleUploadError}
                                />
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Botón para descargar plantilla */}
                    <Card>
                        <CardBody>
                            <VStack spacing={4}>
                                <Box textAlign="center">
                                    <Heading size="sm" mb={2}>
                                        ¿No tienes un archivo?
                                    </Heading>
                                    <Text fontSize="sm" color="gray.500" mb={4}>
                                        Descarga nuestra plantilla con ejemplos
                                    </Text>
                                    <Button
                                        leftIcon={<DownloadIcon />}
                                        colorScheme="blue"
                                        variant="outline"
                                        onClick={handleDownloadTemplate}
                                    >
                                        Descargar Plantilla
                                    </Button>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>

                {/* Panel de información */}
                <VStack spacing={6} align="stretch">
                    {/* Instrucciones */}
                    <Card>
                        <CardBody>
                            <VStack spacing={4} align="stretch">
                                <Heading size="md">Formato Requerido</Heading>

                                <Text fontSize="sm" color="gray.600">
                                    Tu archivo Excel debe tener exactamente estas columnas en este orden:
                                </Text>

                                <List spacing={2}>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="green.500" />
                                        <strong>Columna A - Clave:</strong> Número único del cliente
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="green.500" />
                                        <strong>Columna B - Nombre:</strong> Nombre completo (solo letras)
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="green.500" />
                                        <strong>Columna C - Correo:</strong> Email con dominio válido
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CheckCircleIcon} color="green.500" />
                                        <strong>Columna D - Teléfono:</strong> Con lada de Chiapas
                                    </ListItem>
                                </List>

                                <Divider />

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={2}>
                                        Dominios de correo permitidos:
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        gmail.com, hotmail.com, outlook.com, yahoo.com, live.com, icloud.com, msn.com
                                    </Text>
                                </Box>

                                <Box>
                                    <Text fontSize="sm" fontWeight="600" mb={2}>
                                        Ladas válidas de Chiapas:
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        916, 917, 918, 919, 932, 934, 961, 962, 963, 964, 965, 966, 967, 968, 992, 994
                                    </Text>
                                </Box>
                            </VStack>
                        </CardBody>
                    </Card>

                    {/* Limitaciones */}
                    <Card>
                        <CardBody>
                            <VStack spacing={3} align="stretch">
                                <HStack>
                                    <InfoIcon color="blue.500" />
                                    <Heading size="sm">Limitaciones</Heading>
                                </HStack>

                                <List spacing={1} fontSize="sm">
                                    <ListItem>• Tamaño máximo: 32MB</ListItem>
                                    <ListItem>• Solo archivos .xlsx</ListItem>
                                    <ListItem>• Primera fila debe ser encabezados</ListItem>
                                    <ListItem>• Máximo recomendado: 10,000 registros</ListItem>
                                </List>
                            </VStack>
                        </CardBody>
                    </Card>
                </VStack>
            </SimpleGrid>

            {/* Resultados de la subida */}
            {uploadResult && (
                <Card>
                    <CardBody>
                        <VStack spacing={6} align="stretch">
                            <Box>
                                <Heading size="md" mb={2}>
                                    Resultado del Procesamiento
                                </Heading>
                                <Text color="gray.500">
                                    Archivo: {uploadResult.filename}
                                </Text>
                            </Box>

                            {/* Estadísticas del resultado */}
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                                <StatsCard
                                    label="Total Procesados"
                                    value={uploadResult.total_clients}
                                    icon={ViewIcon}
                                    color="blue"
                                />
                                <StatsCard
                                    label="Válidos"
                                    value={uploadResult.valid_clients}
                                    icon={CheckCircleIcon}
                                    color="green"
                                    percentage={Math.round((uploadResult.valid_clients / uploadResult.total_clients) * 100)}
                                />
                                <StatsCard
                                    label="Con Errores"
                                    value={uploadResult.invalid_clients}
                                    icon={WarningIcon}
                                    color="red"
                                    percentage={Math.round((uploadResult.invalid_clients / uploadResult.total_clients) * 100)}
                                />
                            </SimpleGrid>

                            {/* Progreso visual */}
                            <Box>
                                <HStack justify="space-between" mb={2}>
                                    <Text fontSize="sm" fontWeight="600">Progreso de Validación</Text>
                                    <Badge
                                        colorScheme={uploadResult.valid_clients > uploadResult.invalid_clients ? "green" : "yellow"}
                                        variant="subtle"
                                    >
                                        {Math.round((uploadResult.valid_clients / uploadResult.total_clients) * 100)}% Válidos
                                    </Badge>
                                </HStack>
                                <Progress
                                    value={(uploadResult.valid_clients / uploadResult.total_clients) * 100}
                                    colorScheme={uploadResult.valid_clients > uploadResult.invalid_clients ? "green" : "yellow"}
                                    size="lg"
                                    borderRadius="md"
                                />
                            </Box>

                            {/* Acciones */}
                            <HStack spacing={4} justify="center">
                                <Button
                                    as={RouterLink}
                                    to={ROUTES.CLIENTS}
                                    leftIcon={<ViewIcon />}
                                    colorScheme="brand"
                                    size="lg"
                                >
                                    Ver y Editar Clientes
                                </Button>

                                {uploadResult.invalid_clients > 0 && (
                                    <Button
                                        as={RouterLink}
                                        to={`${ROUTES.CLIENTS}?filter=invalid`}
                                        leftIcon={<WarningIcon />}
                                        colorScheme="red"
                                        variant="outline"
                                        size="lg"
                                    >
                                        Ver Solo Errores
                                    </Button>
                                )}
                            </HStack>

                            {/* Vista previa si está disponible */}
                            {uploadResult.preview && uploadResult.preview.length > 0 && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Text fontWeight="600" mb={3}>
                                            Vista Previa (primeros registros):
                                        </Text>
                                        <VStack spacing={2} align="stretch">
                                            {uploadResult.preview.slice(0, 5).map((client, index) => (
                                                <HStack
                                                    key={index}
                                                    p={3}
                                                    bg={client.is_valid ? "green.50" : "red.50"}
                                                    borderRadius="md"
                                                    borderWidth="1px"
                                                    borderColor={client.is_valid ? "green.200" : "red.200"}
                                                >
                                                    <Icon
                                                        as={client.is_valid ? CheckCircleIcon : WarningIcon}
                                                        color={client.is_valid ? "green.500" : "red.500"}
                                                    />
                                                    <VStack align="start" spacing={0} flex="1">
                                                        <Text fontSize="sm" fontWeight="600">
                                                            {client.nombre} ({client.clave})
                                                        </Text>
                                                        <Text fontSize="xs" color="gray.600">
                                                            {client.correo} • {client.telefono}
                                                        </Text>
                                                    </VStack>
                                                    <Badge
                                                        colorScheme={client.is_valid ? "green" : "red"}
                                                        variant="subtle"
                                                    >
                                                        {client.is_valid ? "Válido" : "Error"}
                                                    </Badge>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>
                                </>
                            )}
                        </VStack>
                    </CardBody>
                </Card>
            )}
        </VStack>
    )
}

export default UploadPage