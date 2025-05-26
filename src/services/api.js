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
    // Obtener todos los clientes con filtros - CORREGIDO
    getClients: async (filters = null) => {
        console.log('🔍 getClients llamado con filtros:', filters)

        // Construir parámetros solo si hay filtros válidos
        const params = new URLSearchParams()

        // Solo agregar parámetros que tengan valores válidos
        if (filters && typeof filters === 'object') {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && value !== false) {
                    params.append(key, String(value))
                }
            })
        }

        const queryString = params.toString()
        const url = queryString ? `/clients?${queryString}` : '/clients'

        console.log('🚀 URL final:', `${API_BASE_URL}${url}`)

        try {
            const response = await api.get(url)
            console.log('✅ Respuesta exitosa:', response.data)
            return response.data
        } catch (error) {
            console.error('❌ Error en getClients:', error)
            // Si falla con parámetros, intentar sin parámetros como fallback
            if (queryString) {
                console.log('🔄 Reintentando sin parámetros...')
                try {
                    const fallbackResponse = await api.get('/clients')
                    console.log('✅ Fallback exitoso:', fallbackResponse.data)
                    return fallbackResponse.data
                } catch (fallbackError) {
                    console.error('❌ Fallback también falló:', fallbackError)
                    throw fallbackError
                }
            }
            throw error
        }
    },

    // Obtener cliente por ID
    getClientById: async (id) => {
        console.log('🔍 getClientById llamado con ID:', id)
        const response = await api.get(`/clients/${id}`)
        return response.data
    },

    // Actualizar cliente
    updateClient: async (id, clientData) => {
        console.log('✏️ updateClient llamado:', { id, clientData })
        const response = await api.put(`/clients/${id}`, clientData)
        return response.data
    },

    // Eliminar cliente
    deleteClient: async (id) => {
        console.log('🗑️ deleteClient llamado con ID:', id)
        const response = await api.delete(`/clients/${id}`)
        return response.data
    },

    // Buscar clientes
    searchClients: async (searchTerm) => {
        console.log('🔎 searchClients llamado con término:', searchTerm)
        const response = await api.get(`/clients/search?q=${encodeURIComponent(searchTerm)}`)
        return response.data
    },

    // Limpiar todos los clientes
    clearAllClients: async () => {
        console.log('🧹 clearAllClients llamado')
        const response = await api.delete('/clients')
        return response.data
    },
}

export const uploadService = {
    // Subir archivo Excel
    uploadFile: async (file, onProgress) => {
        console.log('📤 uploadFile llamado con archivo:', file.name)
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/upload', formData, {
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

        console.log('✅ Upload exitoso:', response.data)
        return response.data
    },

    // Descargar plantilla
    downloadTemplate: async () => {
        console.log('📥 downloadTemplate llamado')
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
        console.log('✅ Plantilla descargada')
    },

    // Obtener archivos subidos
    getUploadedFiles: async () => {
        console.log('📂 getUploadedFiles llamado')
        const response = await api.get('/upload/files')
        return response.data
    },
}

export const validationService = {
    // Validar todos los clientes
    validateAll: async () => {
        console.log('✅ validateAll llamado')
        const response = await api.get('/validate')
        return response.data
    },

    // Validar un cliente específico
    validateSingle: async (clientData) => {
        console.log('✅ validateSingle llamado con:', clientData)
        const response = await api.post('/validate/single', clientData)
        return response.data
    },
}

export const statsService = {
    // Obtener estadísticas
    getStats: async () => {
        console.log('📊 getStats llamado')
        const response = await api.get('/stats')
        return response.data
    },
}

export const exportService = {
    // Exportar clientes a Excel
    exportToExcel: async (filename = '') => {
        console.log('📤 exportToExcel llamado con filename:', filename)
        const response = await api.get(`/export?filename=${encodeURIComponent(filename)}`)
        return response.data
    },

    // Descargar archivo exportado
    downloadFile: (filePath) => {
        console.log('📥 downloadFile llamado con:', filePath)
        const url = `${FILES_BASE_URL}/${filePath.replace('uploads/', '')}`
        window.open(url, '_blank')
    },
}

// Test service para debugging
export const testService = {
    // Test de conexión básica
    testConnection: async () => {
        console.log('🧪 testConnection llamado')
        const response = await fetch('http://localhost:8080/health')
        return response.json()
    },

    // Test de API con axios
    testApiWithAxios: async () => {
        console.log('🧪 testApiWithAxios llamado')
        const response = await api.get('/clients')
        return response.data
    },

    // Test directo a la URL problemática
    testDirectClientCall: async () => {
        console.log('🧪 testDirectClientCall llamado')
        try {
            const response = await fetch('http://localhost:8080/api/clients', {
                method: 'GET',
                headers: {
                    'Origin': 'http://localhost:3000',
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            console.log('🧪 Test directo exitoso:', { status: response.status, data })
            return { status: response.status, data }
        } catch (error) {
            console.error('🧪 Test directo falló:', error)
            throw error
        }
    }
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

// Función de debug para usar en la consola del navegador
window.debugAPI = {
    testClients: () => clientService.getClients(),
    testClientsWithFilters: (filters) => clientService.getClients(filters),
    testHealth: () => testService.testConnection(),
    testDirect: () => testService.testDirectClientCall(),
    getCurrentClients: () => clientService.getClients(null)
}

console.log('🔧 API Debug disponible en window.debugAPI')

export default api