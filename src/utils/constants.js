// Configuración de la aplicación
export const APP_CONFIG = {
    name: import.meta.env.VITE_APP_TITLE || 'Cliente Data Compiler',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    filesUrl: import.meta.env.VITE_FILES_URL || 'http://localhost:8080/files',
}

// Rutas de la aplicación
export const ROUTES = {
    HOME: '/',
    UPLOAD: '/upload',
    CLIENTS: '/clients',
}

// Estados de validación
export const VALIDATION_STATUS = {
    VALID: 'valid',
    INVALID: 'invalid',
    PENDING: 'pending',
}

// Tipos de archivos permitidos
export const ALLOWED_FILE_TYPES = {
    EXCEL: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        '.xlsx',
        '.xls'
    ],
}

// Tamaños de archivo
export const FILE_SIZE = {
    MAX_SIZE: 32 * 1024 * 1024, // 32MB
    MAX_SIZE_TEXT: '32MB',
}

// Configuración de paginación
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
}

// Campos de cliente
export const CLIENT_FIELDS = {
    CLAVE: 'clave',
    NOMBRE: 'nombre',
    CORREO: 'correo',
    TELEFONO: 'telefono',
}

// Labels de campos
export const FIELD_LABELS = {
    [CLIENT_FIELDS.CLAVE]: 'Clave',
    [CLIENT_FIELDS.NOMBRE]: 'Nombre',
    [CLIENT_FIELDS.CORREO]: 'Correo Electrónico',
    [CLIENT_FIELDS.TELEFONO]: 'Teléfono',
}

// Dominios de correo permitidos
export const ALLOWED_EMAIL_DOMAINS = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com',
    'live.com',
    'icloud.com',
    'msn.com',
]

// Ladas válidas de Chiapas
export const CHIAPAS_AREA_CODES = [
    '916', '917', '918', '919',
    '932', '934',
    '961', '962', '963', '964', '965', '966', '967', '968',
    '992', '994'
]

// Mensajes de error comunes
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
    SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
    FILE_TOO_LARGE: `El archivo es demasiado grande. Máximo ${FILE_SIZE.MAX_SIZE_TEXT}.`,
    INVALID_FILE_TYPE: 'Solo se permiten archivos Excel (.xlsx)',
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Formato de correo inválido',
    INVALID_PHONE: 'Formato de teléfono inválido',
    DUPLICATE_KEY: 'Esta clave ya existe',
}

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
    FILE_UPLOADED: 'Archivo subido exitosamente',
    CLIENT_UPDATED: 'Cliente actualizado correctamente',
    CLIENT_DELETED: 'Cliente eliminado correctamente',
    DATA_EXPORTED: 'Datos exportados correctamente',
    VALIDATION_COMPLETED: 'Validación completada',
}

// Colores para el estado de validación
export const VALIDATION_COLORS = {
    VALID: 'green',
    INVALID: 'red',
    PENDING: 'yellow',
}

// Íconos para el estado de validación
export const VALIDATION_ICONS = {
    VALID: 'CheckCircleIcon',
    INVALID: 'WarningIcon',
    PENDING: 'InfoIcon',
}

// Configuración de toast notifications
export const TOAST_CONFIG = {
    duration: 4000,
    isClosable: true,
    position: 'top-right',
}

// Configuración de tabla
export const TABLE_CONFIG = {
    ITEMS_PER_PAGE: 10,
    MAX_ITEMS_PER_PAGE: 100,
}

// Tiempo de debounce para búsquedas
export const DEBOUNCE_TIME = 300

// Configuración de drag and drop
export const DRAG_DROP_CONFIG = {
    acceptedFileTypes: ALLOWED_FILE_TYPES.EXCEL,
    maxFileSize: FILE_SIZE.MAX_SIZE,
    multiple: false,
}

// Estados de carga
export const LOADING_STATES = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
}

// Configuración de animaciones
export const ANIMATION_CONFIG = {
    duration: 0.2,
    ease: 'easeInOut',
}

// Breakpoints responsivos
export const BREAKPOINTS = {
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1280px',
}

// Configuración de formularios
export const FORM_CONFIG = {
    VALIDATION_DELAY: 500,
    MAX_INPUT_LENGTH: {
        CLAVE: 20,
        NOMBRE: 100,
        CORREO: 100,
        TELEFONO: 15,
    },
}

// Patrones de validación
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\d{10,}$/,
    NUMBERS_ONLY: /^\d+$/,
    LETTERS_ONLY: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.'-]+$/,
}

// Configuración de colores del tema
export const THEME_COLORS = {
    PRIMARY: 'brand.500',
    SECONDARY: 'gray.500',
    SUCCESS: 'green.500',
    ERROR: 'red.500',
    WARNING: 'yellow.500',
    INFO: 'blue.500',
}

// Shortcuts de teclado
export const KEYBOARD_SHORTCUTS = {
    SAVE: 'Ctrl+S',
    SEARCH: 'Ctrl+F',
    NEW: 'Ctrl+N',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
}