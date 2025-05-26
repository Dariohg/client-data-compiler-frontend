import { useState, useCallback } from 'react'
import {
    Box,
    Text,
    VStack,
    HStack,
    Icon,
    Button,
    Progress,
    Alert,
    AlertIcon,
    AlertDescription,
    useColorModeValue,
    useToast,
    List,
    ListItem,
    ListIcon,
    Badge,
} from '@chakra-ui/react'
import {
    AddIcon,
    CheckCircleIcon,
    WarningIcon,
    DeleteIcon
} from '@chakra-ui/icons'
import { uploadService } from '../services/api'
import { formatters, utils } from '../utils/helpers'
import { FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/constants'

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadResults, setUploadResults] = useState(null)
    const toast = useToast()

    // Todos los hooks de color deben estar al inicio, no condicionalmente
    const bgColor = useColorModeValue('gray.50', 'gray.700')
    const borderColor = useColorModeValue('gray.300', 'gray.600')
    const dragActiveBg = useColorModeValue('brand.50', 'brand.900')
    const dragActiveBorder = useColorModeValue('brand.300', 'brand.500')
    const cardBg = useColorModeValue('white', 'gray.800')
    const blueBg = useColorModeValue('blue.50', 'blue.900')
    const blueBorder = useColorModeValue('blue.200', 'blue.700')

    // Validar archivo
    const validateFile = (file) => {
        const errors = []

        // Validar tipo
        if (!utils.validateFileType(file)) {
            errors.push('Solo se permiten archivos Excel (.xlsx)')
        }

        // Validar tamaño
        if (!utils.validateFileSize(file)) {
            errors.push(`El archivo es demasiado grande. Máximo ${FILE_SIZE.MAX_SIZE_TEXT}`)
        }

        return errors
    }

    // Manejar selección de archivo
    const handleFileSelect = (file) => {
        const errors = validateFile(file)

        if (errors.length > 0) {
            errors.forEach(error => {
                toast(utils.createToast('error', 'Error de archivo', error))
            })
            return
        }

        setSelectedFile(file)
        setUploadResults(null)
    }

    // Subir archivo
    const handleUpload = async () => {
        if (!selectedFile) return

        try {
            setUploading(true)
            setUploadProgress(0)

            const response = await uploadService.uploadFile(
                selectedFile,
                (progress) => setUploadProgress(progress)
            )

            setUploadResults(response.data)
            toast(utils.createToast('success', 'Éxito', 'Archivo subido correctamente'))

            if (onUploadSuccess) {
                onUploadSuccess(response.data)
            }
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))

            if (onUploadError) {
                onUploadError(error)
            }
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    // Eventos de drag and drop
    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(false)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }, [])

    // Manejar input de archivo
    const handleFileInput = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    // Limpiar archivo seleccionado
    const clearFile = () => {
        setSelectedFile(null)
        setUploadResults(null)
        setUploadProgress(0)
    }

    return (
        <VStack spacing={6} align="stretch">
            {/* Área de drag and drop */}
            <Box
                border="2px dashed"
                borderColor={isDragOver ? dragActiveBorder : borderColor}
                borderRadius="lg"
                bg={isDragOver ? dragActiveBg : bgColor}
                p={8}
                textAlign="center"
                transition="all 0.2s"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                cursor="pointer"
                _hover={{ borderColor: dragActiveBorder, bg: dragActiveBg }}
            >
                <VStack spacing={4}>
                    <Icon
                        as={AddIcon}
                        boxSize={12}
                        color={isDragOver ? 'brand.500' : 'gray.400'}
                    />

                    <VStack spacing={2}>
                        <Text fontSize="xl" fontWeight="600">
                            Arrastra tu archivo Excel aquí
                        </Text>
                        <Text color="gray.500">
                            o haz clic para seleccionar
                        </Text>
                    </VStack>

                    <Button
                        as="label"
                        htmlFor="file-upload"
                        colorScheme="brand"
                        variant="outline"
                        cursor="pointer"
                    >
                        Seleccionar Archivo
                    </Button>

                    <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        style={{ display: 'none' }}
                        onChange={handleFileInput}
                    />

                    <Text fontSize="sm" color="gray.500">
                        Formatos: .xlsx • Tamaño máximo: {FILE_SIZE.MAX_SIZE_TEXT}
                    </Text>
                </VStack>
            </Box>

            {/* Archivo seleccionado */}
            {selectedFile && (
                <Box
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    p={4}
                >
                    <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="600">{selectedFile.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                                {formatters.formatFileSize(selectedFile.size)}
                            </Text>
                        </VStack>

                        <HStack>
                            <Button
                                size="sm"
                                colorScheme="brand"
                                onClick={handleUpload}
                                isLoading={uploading}
                                loadingText="Subiendo..."
                                leftIcon={<AddIcon />}
                            >
                                Subir
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={clearFile}
                                leftIcon={<DeleteIcon />}
                            >
                                Quitar
                            </Button>
                        </HStack>
                    </HStack>

                    {/* Progreso de subida */}
                    {uploading && (
                        <Box mt={4}>
                            <Progress
                                value={uploadProgress}
                                colorScheme="brand"
                                size="sm"
                                borderRadius="md"
                            />
                            <Text fontSize="sm" color="gray.500" mt={1}>
                                {uploadProgress}% completado
                            </Text>
                        </Box>
                    )}
                </Box>
            )}

            {/* Resultados de la subida */}
            {uploadResults && (
                <Alert status="success" borderRadius="lg">
                    <AlertIcon />
                    <Box flex="1">
                        <AlertDescription>
                            <VStack align="start" spacing={2}>
                                <Text fontWeight="600">
                                    Archivo procesado exitosamente
                                </Text>

                                <HStack spacing={4} wrap="wrap">
                                    <Badge colorScheme="blue" variant="subtle">
                                        {uploadResults.total_clients} clientes
                                    </Badge>
                                    <Badge colorScheme="green" variant="subtle">
                                        {uploadResults.valid_clients} válidos
                                    </Badge>
                                    <Badge colorScheme="red" variant="subtle">
                                        {uploadResults.invalid_clients} con errores
                                    </Badge>
                                </HStack>

                                {uploadResults.preview && uploadResults.preview.length > 0 && (
                                    <Box>
                                        <Text fontSize="sm" fontWeight="600" mb={2}>
                                            Vista previa:
                                        </Text>
                                        <List spacing={1} fontSize="sm">
                                            {uploadResults.preview.slice(0, 3).map((client, index) => (
                                                <ListItem key={index}>
                                                    <ListIcon
                                                        as={client.is_valid ? CheckCircleIcon : WarningIcon}
                                                        color={client.is_valid ? 'green.500' : 'red.500'}
                                                    />
                                                    {client.nombre} - {client.correo}
                                                </ListItem>
                                            ))}
                                            {uploadResults.preview.length > 3 && (
                                                <ListItem>
                                                    <Text color="gray.500">
                                                        ... y {uploadResults.total_clients - 3} más
                                                    </Text>
                                                </ListItem>
                                            )}
                                        </List>
                                    </Box>
                                )}
                            </VStack>
                        </AlertDescription>
                    </Box>
                </Alert>
            )}

            {/* Instrucciones */}
            <Box
                bg={blueBg}
                border="1px"
                borderColor={blueBorder}
                borderRadius="lg"
                p={4}
            >
                <VStack align="start" spacing={2}>
                    <Text fontWeight="600" color="blue.600">
                        Formato requerido del archivo Excel:
                    </Text>
                    <List spacing={1} fontSize="sm">
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Columna A: Clave (número único)
                        </ListItem>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Columna B: Nombre (solo letras)
                        </ListItem>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Columna C: Correo (dominios permitidos)
                        </ListItem>
                        <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Columna D: Teléfono (ladas de Chiapas)
                        </ListItem>
                    </List>
                </VStack>
            </Box>
        </VStack>
    )
}

export default FileUpload