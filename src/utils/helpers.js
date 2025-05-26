import {
    ALLOWED_EMAIL_DOMAINS,
    CHIAPAS_AREA_CODES,
    VALIDATION_PATTERNS,
    FILE_SIZE
} from './constants'

// Validaciones
export const validators = {
    // Validar clave de cliente
    validateClave: (clave) => {
        if (!clave || clave.trim() === '') {
            return { isValid: false, message: 'La clave no puede estar vacía' }
        }

        if (!VALIDATION_PATTERNS.NUMBERS_ONLY.test(clave.trim())) {
            return { isValid: false, message: 'La clave debe ser un número válido' }
        }

        return { isValid: true, message: '' }
    },

    // Validar nombre
    validateNombre: (nombre) => {
        if (!nombre || nombre.trim() === '') {
            return { isValid: false, message: 'El nombre no puede estar vacío' }
        }

        if (!VALIDATION_PATTERNS.LETTERS_ONLY.test(nombre.trim())) {
            return { isValid: false, message: 'El nombre solo puede contener letras y espacios' }
        }

        return { isValid: true, message: '' }
    },

    // Validar correo electrónico
    validateCorreo: (correo) => {
        if (!correo || correo.trim() === '') {
            return { isValid: false, message: 'El correo no puede estar vacío' }
        }

        const email = correo.trim().toLowerCase()

        if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
            return { isValid: false, message: 'El formato del correo no es válido' }
        }

        const domain = email.split('@')[1]
        if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
            return {
                isValid: false,
                message: `Dominio no permitido. Use: ${ALLOWED_EMAIL_DOMAINS.join(', ')}`
            }
        }

        return { isValid: true, message: '' }
    },

    // Validar teléfono
    validateTelefono: (telefono) => {
        if (!telefono || telefono.trim() === '') {
            return { isValid: false, message: 'El teléfono no puede estar vacío' }
        }

        const cleanPhone = telefono.replace(/\D/g, '') // Solo números

        if (cleanPhone.length < 10) {
            return { isValid: false, message: 'El teléfono debe tener al menos 10 dígitos' }
        }

        const areaCode = cleanPhone.substring(0, 3)
        if (!CHIAPAS_AREA_CODES.includes(areaCode)) {
            return {
                isValid: false,
                message: `Lada no válida para Chiapas. Use: ${CHIAPAS_AREA_CODES.join(', ')}`
            }
        }

        return { isValid: true, message: '' }
    },

    // Validar cliente completo
    validateClient: (client) => {
        const errors = {}

        const claveValidation = validators.validateClave(client.clave)
        if (!claveValidation.isValid) {
            errors.clave = claveValidation.message
        }

        const nombreValidation = validators.validateNombre(client.nombre)
        if (!nombreValidation.isValid) {
            errors.nombre = nombreValidation.message
        }

        const correoValidation = validators.validateCorreo(client.correo)
        if (!correoValidation.isValid) {
            errors.correo = correoValidation.message
        }

        const telefonoValidation = validators.validateTelefono(client.telefono)
        if (!telefonoValidation.isValid) {
            errors.telefono = telefonoValidation.message
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }
}

// Formatters
export const formatters = {
    // Formatear teléfono para mostrar
    formatPhone: (phone) => {
        if (!phone) return ''
        const cleanPhone = phone.replace(/\D/g, '')
        if (cleanPhone.length === 10) {
            return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`
        }
        return phone
    },

    // Formatear correo (lowercase)
    formatEmail: (email) => {
        return email ? email.trim().toLowerCase() : ''
    },

    // Formatear nombre (title case)
    formatName: (name) => {
        if (!name) return ''
        return name
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
    },

    // Formatear clave
    formatClave: (clave) => {
        return clave ? clave.trim() : ''
    },

    // Formatear tamaño de archivo
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // Formatear fecha
    formatDate: (date) => {
        if (!date) return ''
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    },

    // Formatear porcentaje
    formatPercentage: (value, total) => {
        if (total === 0) return '0%'
        return `${Math.round((value / total) * 100)}%`
    }
}

// Utilidades generales
export const utils = {
    // Debounce function
    debounce: (func, wait) => {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    },

    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2)
    },

    // Limpiar objeto de propiedades vacías
    cleanObject: (obj) => {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                acc[key] = value
            }
            return acc
        }, {})
    },

    // Copiar al portapapeles
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            return true
        } catch (err) {
            console.error('Error copying to clipboard:', err)
            return false
        }
    },

    // Descargar archivo
    downloadFile: (data, filename, type = 'text/plain') => {
        const blob = new Blob([data], { type })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    },

    // Validar tipo de archivo
    validateFileType: (file) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel'
        ]
        return validTypes.includes(file.type) || file.name.endsWith('.xlsx')
    },

    // Validar tamaño de archivo
    validateFileSize: (file) => {
        return file.size <= FILE_SIZE.MAX_SIZE
    },

    // Obtener estadísticas de array
    getArrayStats: (array, key) => {
        if (!array || array.length === 0) return { min: 0, max: 0, avg: 0 }

        const values = array.map(item => item[key] || 0)
        const min = Math.min(...values)
        const max = Math.max(...values)
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length

        return { min, max, avg: Math.round(avg * 100) / 100 }
    },

    // Agrupar array por clave
    groupBy: (array, key) => {
        return array.reduce((groups, item) => {
            const group = item[key] || 'sin_categoria'
            groups[group] = groups[group] || []
            groups[group].push(item)
            return groups
        }, {})
    },

    // Filtrar array por múltiples criterios
    filterArray: (array, filters) => {
        return array.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value) return true
                const itemValue = item[key]?.toString().toLowerCase() || ''
                const filterValue = value.toString().toLowerCase()
                return itemValue.includes(filterValue)
            })
        })
    },

    // Ordenar array
    sortArray: (array, key, direction = 'asc') => {
        return [...array].sort((a, b) => {
            const aVal = a[key] || ''
            const bVal = b[key] || ''

            if (direction === 'asc') {
                return aVal.toString().localeCompare(bVal.toString())
            } else {
                return bVal.toString().localeCompare(aVal.toString())
            }
        })
    },

    // Paginar array
    paginateArray: (array, page, pageSize) => {
        const startIndex = (page - 1) * pageSize
        const endIndex = startIndex + pageSize
        return {
            data: array.slice(startIndex, endIndex),
            totalPages: Math.ceil(array.length / pageSize),
            totalItems: array.length,
            currentPage: page,
            hasNextPage: endIndex < array.length,
            hasPrevPage: page > 1
        }
    },

    // Manejar errores de API
    handleApiError: (error) => {
        console.error('API Error:', error)

        if (error.response) {
            return error.response.data?.message || `Error ${error.response.status}`
        } else if (error.request) {
            return 'No se pudo conectar con el servidor'
        } else {
            return error.message || 'Error desconocido'
        }
    },

    // Crear configuración de toast
    createToast: (type, title, description) => ({
        title,
        description,
        status: type,
        duration: 4000,
        isClosable: true,
        position: 'top-right'
    })
}

// Constantes de colores para estados
export const getStatusColor = (isValid, hasErrors = false) => {
    if (isValid) return 'green'
    if (hasErrors) return 'red'
    return 'gray'
}

// Obtener icono por estado
export const getStatusIcon = (isValid, hasErrors = false) => {
    if (isValid) return 'CheckCircleIcon'
    if (hasErrors) return 'WarningIcon'
    return 'InfoIcon'
}

export default {
    validators,
    formatters,
    utils,
    getStatusColor,
    getStatusIcon
}