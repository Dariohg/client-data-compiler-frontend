import axios from 'axios'

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const FILES_BASE_URL = import.meta.env.VITE_FILES_URL || 'http://localhost:8080/files'

// Crear instancia de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Interceptor para requests
api.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
        return config
    },
    (error) => {
        console.error('❌ Request error:', error)
        return Promise.reject(error)
    }
)

// Interceptor para responses
api.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`)
        return response
    },
    (error) => {
        console.error('❌ Response error:', error)

        // Manejo de errores de red
        if (error.code === 'ERR_NETWORK') {
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080')
        }

        // Manejo de errores comunes
        if (error.response) {
            const { status, data } = error.response

            switch (status) {
                case 400:
                    throw new Error(data?.message || 'Petición incorrecta')
                case 404:
                    throw new Error(data?.message || 'Recurso no encontrado')
                case 500:
                    throw new Error(data?.message || 'Error interno del servidor')
                default:
                    throw new Error(data?.message || `Error ${status}`)
            }
        } else if (error.request) {
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.')
        } else {
            throw new Error('Error de configuración: ' + error.message)
        }
    }
)

// Servicios de la API
export const clientService = {
    // Obtener todos los clientes con filtros
    getClients: async (filters = {}) => {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value)
            }
        })

        const response = await api.get(`/clients?${params}`)
        return response.data
    },

    // Obtener cliente por ID
    getClientById: async (id) => {
        const response = await api.get(`/clients/${id}`)
        return response.data
    },

    // Actualizar cliente
    updateClient: async (id, clientData) => {
        const response = await api.put(`/clients/${id}`, clientData)
        return response.data
    },

    // Eliminar cliente
    deleteClient: async (id) => {
        const response = await api.delete(`/clients/${id}`)
        return response.data
    },

    // Buscar clientes
    searchClients: async (searchTerm) => {
        const response = await api.get(`/clients/search?q=${encodeURIComponent(searchTerm)}`)
        return response.data
    },

    // Limpiar todos los clientes
    clearAllClients: async () => {
        const response = await api.delete('/clients')
        return response.data
    },
}

export const uploadService = {
    // Subir archivo Excel
    uploadFile: async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )
                    onProgress(percentCompleted)
                }
            },
        })

        return response.data
    },

    // Descargar plantilla
    downloadTemplate: async () => {
        const response = await api.get('/upload/template', {
            responseType: 'blob',
        })

        // Crear URL para descarga
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'plantilla_clientes.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    },

    // Obtener archivos subidos
    getUploadedFiles: async () => {
        const response = await api.get('/upload/files')
        return response.data
    },
}

export const validationService = {
    // Validar todos los clientes
    validateAll: async () => {
        const response = await api.get('/validate/')
        return response.data
    },

    // Validar un cliente específico
    validateSingle: async (clientData) => {
        const response = await api.post('/validate/single', clientData)
        return response.data
    },
}

export const statsService = {
    // Obtener estadísticas
    getStats: async () => {
        const response = await api.get('/stats')
        return response.data
    },
}

export const exportService = {
    // Exportar clientes a Excel
    exportToExcel: async (filename = '') => {
        const response = await api.get(`/export?filename=${encodeURIComponent(filename)}`)
        return response.data
    },

    // Descargar archivo exportado
    downloadFile: (filePath) => {
        const url = `${FILES_BASE_URL}/${filePath.replace('uploads/', '')}`
        window.open(url, '_blank')
    },
}

// Funciones auxiliares
export const handleApiError = (error, toast) => {
    console.error('API Error:', error)

    const message = error.message || 'Ha ocurrido un error'

    if (toast) {
        toast({
            title: 'Error',
            description: message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    return message
}

export const formatApiResponse = (response) => {
    if (response.success) {
        return {
            success: true,
            data: response.data,
            message: response.message,
        }
    } else {
        throw new Error(response.message || 'Error en la respuesta')
    }
}

export default api