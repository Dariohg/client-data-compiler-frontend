import { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    HStack,
    Text,
    Badge,
    Alert,
    AlertIcon,
    AlertDescription,
    Divider,
    useToast,
} from '@chakra-ui/react'
import { clientService } from '../services/api'
import { validators, utils, formatters } from '../utils/helpers'
import { FIELD_LABELS } from '../utils/constants'

const ClientModal = ({
                         isOpen,
                         onClose,
                         client = null,
                         onSave
                     }) => {
    const [formData, setFormData] = useState({
        clave: '',
        nombre: '',
        correo: '',
        telefono: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setSaving] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})
    const toast = useToast()

    // Cargar datos del cliente cuando se abre el modal
    useEffect(() => {
        if (client) {
            setFormData({
                clave: client.clave || '',
                nombre: client.nombre || '',
                correo: client.correo || '',
                telefono: client.telefono || ''
            })
            setValidationErrors(client.errors || {})
        } else {
            setFormData({
                clave: '',
                nombre: '',
                correo: '',
                telefono: ''
            })
            setValidationErrors({})
        }
        setErrors({})
    }, [client, isOpen])

    // Validar campo individual
    const validateField = (field, value) => {
        let validation = { isValid: true, message: '' }

        switch (field) {
            case 'clave':
                validation = validators.validateClave(value)
                break
            case 'nombre':
                validation = validators.validateNombre(value)
                break
            case 'correo':
                validation = validators.validateCorreo(value)
                break
            case 'telefono':
                validation = validators.validateTelefono(value)
                break
        }

        setErrors(prev => ({
            ...prev,
            [field]: validation.isValid ? '' : validation.message
        }))

        return validation.isValid
    }

    // Manejar cambio en campos
    const handleChange = (field, value) => {
        // Aplicar formateo según el campo
        let formattedValue = value
        switch (field) {
            case 'clave':
                formattedValue = formatters.formatClave(value)
                break
            case 'nombre':
                formattedValue = formatters.formatName(value)
                break
            case 'correo':
                formattedValue = formatters.formatEmail(value)
                break
            case 'telefono':
                // Permitir solo números y algunos caracteres especiales
                formattedValue = value.replace(/[^\d\-\s\(\)]/g, '')
                break
        }

        setFormData(prev => ({
            ...prev,
            [field]: formattedValue
        }))

        // Validar después de un pequeño delay
        setTimeout(() => {
            validateField(field, formattedValue)
        }, 300)
    }

    // Validar formulario completo
    const validateForm = () => {
        const validation = validators.validateClient(formData)
        setErrors(validation.errors)
        return validation.isValid
    }

    // Guardar cliente
    const handleSave = async () => {
        if (!validateForm()) {
            toast(utils.createToast('error', 'Error', 'Por favor corrige los errores en el formulario'))
            return
        }

        try {
            setSaving(true)

            if (client) {
                // Actualizar cliente existente
                const response = await clientService.updateClient(client.id, formData)
                toast(utils.createToast('success', 'Éxito', 'Cliente actualizado correctamente'))

                if (onSave) {
                    onSave(response.data.client)
                }
            } else {
                // Crear nuevo cliente (si se implementa en el futuro)
                toast(utils.createToast('info', 'Info', 'Funcionalidad de crear cliente no implementada'))
            }

            onClose()
        } catch (error) {
            const message = utils.handleApiError(error)
            toast(utils.createToast('error', 'Error', message))
        } finally {
            setSaving(false)
        }
    }

    // Manejar cierre del modal
    const handleClose = () => {
        setFormData({
            clave: '',
            nombre: '',
            correo: '',
            telefono: ''
        })
        setErrors({})
        setValidationErrors({})
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {client ? 'Editar Cliente' : 'Nuevo Cliente'}
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <VStack spacing={6} align="stretch">
                        {/* Mostrar errores originales si existen */}
                        {validationErrors && Object.keys(validationErrors).length > 0 && (
                            <Alert status="warning" borderRadius="md">
                                <AlertIcon />
                                <AlertDescription>
                                    <VStack align="start" spacing={1}>
                                        <Text fontWeight="600">Errores detectados en este cliente:</Text>
                                        {Object.entries(validationErrors).map(([field, error]) => (
                                            <Text key={field} fontSize="sm">
                                                • {FIELD_LABELS[field]}: {error}
                                            </Text>
                                        ))}
                                    </VStack>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Formulario */}
                        <VStack spacing={4} align="stretch">
                            {/* Clave */}
                            <FormControl isInvalid={!!errors.clave} isRequired>
                                <FormLabel>Clave del Cliente</FormLabel>
                                <Input
                                    value={formData.clave}
                                    onChange={(e) => handleChange('clave', e.target.value)}
                                    placeholder="Ej: 1001"
                                    type="text"
                                />
                                <FormErrorMessage>{errors.clave}</FormErrorMessage>
                            </FormControl>

                            {/* Nombre */}
                            <FormControl isInvalid={!!errors.nombre} isRequired>
                                <FormLabel>Nombre Completo</FormLabel>
                                <Input
                                    value={formData.nombre}
                                    onChange={(e) => handleChange('nombre', e.target.value)}
                                    placeholder="Ej: Juan Pérez García"
                                />
                                <FormErrorMessage>{errors.nombre}</FormErrorMessage>
                            </FormControl>

                            {/* Correo */}
                            <FormControl isInvalid={!!errors.correo} isRequired>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <Input
                                    value={formData.correo}
                                    onChange={(e) => handleChange('correo', e.target.value)}
                                    placeholder="Ej: juan.perez@gmail.com"
                                    type="email"
                                />
                                <FormErrorMessage>{errors.correo}</FormErrorMessage>
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Dominios permitidos: gmail.com, hotmail.com, outlook.com, yahoo.com, live.com, icloud.com, msn.com
                                </Text>
                            </FormControl>

                            {/* Teléfono */}
                            <FormControl isInvalid={!!errors.telefono} isRequired>
                                <FormLabel>Teléfono</FormLabel>
                                <Input
                                    value={formData.telefono}
                                    onChange={(e) => handleChange('telefono', e.target.value)}
                                    placeholder="Ej: 9611234567"
                                />
                                <FormErrorMessage>{errors.telefono}</FormErrorMessage>
                                <Text fontSize="xs" color="gray.500" mt={1}>
                                    Ladas válidas de Chiapas: 916, 917, 918, 919, 932, 934, 961-968, 992, 994
                                </Text>
                            </FormControl>
                        </VStack>

                        {/* Vista previa de validación */}
                        {formData.clave || formData.nombre || formData.correo || formData.telefono ? (
                            <>
                                <Divider />
                                <VStack align="stretch" spacing={2}>
                                    <Text fontWeight="600" fontSize="sm">Vista Previa:</Text>
                                    <HStack wrap="wrap" spacing={2}>
                                        <Badge
                                            colorScheme={!errors.clave && formData.clave ? "green" : "red"}
                                            variant="subtle"
                                        >
                                            Clave: {formData.clave || 'Vacío'}
                                        </Badge>
                                        <Badge
                                            colorScheme={!errors.nombre && formData.nombre ? "green" : "red"}
                                            variant="subtle"
                                        >
                                            Nombre: {formData.nombre ? 'OK' : 'Vacío'}
                                        </Badge>
                                        <Badge
                                            colorScheme={!errors.correo && formData.correo ? "green" : "red"}
                                            variant="subtle"
                                        >
                                            Correo: {formData.correo ? 'OK' : 'Vacío'}
                                        </Badge>
                                        <Badge
                                            colorScheme={!errors.telefono && formData.telefono ? "green" : "red"}
                                            variant="subtle"
                                        >
                                            Teléfono: {formData.telefono ? 'OK' : 'Vacío'}
                                        </Badge>
                                    </HStack>
                                </VStack>
                            </>
                        ) : null}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <HStack spacing={3}>
                        <Button variant="ghost" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            colorScheme="brand"
                            onClick={handleSave}
                            isLoading={loading}
                            loadingText="Guardando..."
                        >
                            {client ? 'Actualizar' : 'Crear'} Cliente
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ClientModal