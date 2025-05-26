import { useState, useMemo } from 'react'
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    IconButton,
    HStack,
    VStack,
    Text,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Button,
    Flex,
    Spacer,
    useColorModeValue,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    Checkbox,
} from '@chakra-ui/react'
import {
    EditIcon,
    DeleteIcon,
    ChevronDownIcon,
    SearchIcon,
    CheckCircleIcon,
    WarningIcon,
    ViewIcon,
} from '@chakra-ui/icons'
import { utils, formatters } from '../utils/helpers'
import { PAGINATION, FIELD_LABELS } from '../utils/constants'

const ClientTable = ({
                         clients = [],
                         loading = false,
                         onEdit,
                         onDelete,
                         onSelectClients
                     }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [fieldFilter, setFieldFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
    const [selectedClients, setSelectedClients] = useState(new Set())
    const [sortField, setSortField] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    const tableBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const hoverBg = useColorModeValue('gray.50', 'gray.700')

    // Filtrar y ordenar clientes
    const filteredAndSortedClients = useMemo(() => {
        let filtered = [...clients]

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(client =>
                client.clave?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.correo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.telefono?.includes(searchTerm)
            )
        }

        // Filtrar por estado
        if (statusFilter === 'valid') {
            filtered = filtered.filter(client => client.is_valid)
        } else if (statusFilter === 'invalid') {
            filtered = filtered.filter(client => !client.is_valid)
        }

        // Filtrar por campo con errores
        if (fieldFilter !== 'all') {
            filtered = filtered.filter(client =>
                client.errors && client.errors[fieldFilter]
            )
        }

        // Ordenar
        filtered.sort((a, b) => {
            const aValue = a[sortField]?.toString() || ''
            const bValue = b[sortField]?.toString() || ''

            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue)
            } else {
                return bValue.localeCompare(aValue)
            }
        })

        return filtered
    }, [clients, searchTerm, statusFilter, fieldFilter, sortField, sortDirection])

    // Paginar clientes
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return filteredAndSortedClients.slice(startIndex, startIndex + pageSize)
    }, [filteredAndSortedClients, currentPage, pageSize])

    const totalPages = Math.ceil(filteredAndSortedClients.length / pageSize)

    // Manejar ordenamiento
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('asc')
        }
    }

    // Manejar selección de clientes
    const handleSelectClient = (clientId) => {
        const newSelected = new Set(selectedClients)
        if (newSelected.has(clientId)) {
            newSelected.delete(clientId)
        } else {
            newSelected.add(clientId)
        }
        setSelectedClients(newSelected)

        if (onSelectClients) {
            onSelectClients(Array.from(newSelected))
        }
    }

    // Seleccionar todos
    const handleSelectAll = () => {
        if (selectedClients.size === paginatedClients.length) {
            setSelectedClients(new Set())
            if (onSelectClients) onSelectClients([])
        } else {
            const allIds = new Set(paginatedClients.map(client => client.id))
            setSelectedClients(allIds)
            if (onSelectClients) onSelectClients(Array.from(allIds))
        }
    }

    // Componente de badge de estado
    const StatusBadge = ({ client }) => {
        if (client.is_valid) {
            return (
                <Badge colorScheme="green" variant="subtle">
                    <HStack spacing={1}>
                        <CheckCircleIcon boxSize={3} />
                        <Text>Válido</Text>
                    </HStack>
                </Badge>
            )
        } else {
            const errorCount = Object.keys(client.errors || {}).length
            return (
                <Badge colorScheme="red" variant="subtle">
                    <HStack spacing={1}>
                        <WarningIcon boxSize={3} />
                        <Text>{errorCount} error{errorCount !== 1 ? 'es' : ''}</Text>
                    </HStack>
                </Badge>
            )
        }
    }

    // Componente de cabecera ordenable
    const SortableHeader = ({ field, children }) => (
        <Th
            cursor="pointer"
            onClick={() => handleSort(field)}
            _hover={{ bg: hoverBg }}
            position="relative"
        >
            <HStack spacing={2}>
                <Text>{children}</Text>
                {sortField === field && (
                    <Text fontSize="xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                    </Text>
                )}
            </HStack>
        </Th>
    )

    return (
        <VStack spacing={4} align="stretch">
            {/* Controles de filtrado */}
            <Box
                bg={tableBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
            >
                <VStack spacing={4}>
                    {/* Primera fila de filtros */}
                    <Flex wrap="wrap" gap={4} w="full">
                        <Box flex="2" minW="200px">
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Buscar clientes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Box>

                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            minW="150px"
                        >
                            <option value="all">Todos los estados</option>
                            <option value="valid">Solo válidos</option>
                            <option value="invalid">Solo con errores</option>
                        </Select>

                        <Select
                            value={fieldFilter}
                            onChange={(e) => setFieldFilter(e.target.value)}
                            minW="150px"
                        >
                            <option value="all">Todos los campos</option>
                            <option value="clave">Errores en Clave</option>
                            <option value="nombre">Errores en Nombre</option>
                            <option value="correo">Errores en Correo</option>
                            <option value="telefono">Errores en Teléfono</option>
                        </Select>
                    </Flex>

                    {/* Segunda fila con estadísticas */}
                    <Flex w="full" justify="space-between" align="center">
                        <HStack spacing={4}>
                            <Text fontSize="sm" color="gray.500">
                                {filteredAndSortedClients.length} de {clients.length} clientes
                            </Text>
                            {selectedClients.size > 0 && (
                                <Badge colorScheme="blue">
                                    {selectedClients.size} seleccionados
                                </Badge>
                            )}
                        </HStack>

                        <HStack>
                            <Text fontSize="sm" color="gray.500">Mostrar:</Text>
                            <Select
                                size="sm"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value))
                                    setCurrentPage(1)
                                }}
                                w="auto"
                            >
                                {PAGINATION.PAGE_SIZE_OPTIONS.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </Select>
                        </HStack>
                    </Flex>
                </VStack>
            </Box>

            {/* Tabla */}
            <Box
                bg={tableBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
            >
                <Box overflowX="auto">
                    <Table variant="simple">
                        <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                            <Tr>
                                <Th w="50px">
                                    <Checkbox
                                        isChecked={selectedClients.size === paginatedClients.length && paginatedClients.length > 0}
                                        isIndeterminate={selectedClients.size > 0 && selectedClients.size < paginatedClients.length}
                                        onChange={handleSelectAll}
                                    />
                                </Th>
                                <SortableHeader field="clave">Clave</SortableHeader>
                                <SortableHeader field="nombre">Nombre</SortableHeader>
                                <SortableHeader field="correo">Correo</SortableHeader>
                                <SortableHeader field="telefono">Teléfono</SortableHeader>
                                <Th>Estado</Th>
                                <Th w="120px">Acciones</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {paginatedClients.map((client) => (
                                <Tr
                                    key={client.id}
                                    _hover={{ bg: hoverBg }}
                                    bg={selectedClients.has(client.id) ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                                >
                                    <Td>
                                        <Checkbox
                                            isChecked={selectedClients.has(client.id)}
                                            onChange={() => handleSelectClient(client.id)}
                                        />
                                    </Td>
                                    <Td fontWeight="600">{client.clave}</Td>
                                    <Td>
                                        <VStack align="start" spacing={0}>
                                            <Text>{client.nombre}</Text>
                                            {client.errors?.nombre && (
                                                <Text fontSize="xs" color="red.500">
                                                    {client.errors.nombre}
                                                </Text>
                                            )}
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <VStack align="start" spacing={0}>
                                            <Text>{client.correo}</Text>
                                            {client.errors?.correo && (
                                                <Text fontSize="xs" color="red.500">
                                                    {client.errors.correo}
                                                </Text>
                                            )}
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <VStack align="start" spacing={0}>
                                            <Text>{formatters.formatPhone(client.telefono)}</Text>
                                            {client.errors?.telefono && (
                                                <Text fontSize="xs" color="red.500">
                                                    {client.errors.telefono}
                                                </Text>
                                            )}
                                        </VStack>
                                    </Td>
                                    <Td>
                                        <StatusBadge client={client} />
                                    </Td>
                                    <Td>
                                        <HStack spacing={1}>
                                            <Tooltip label="Editar cliente">
                                                <IconButton
                                                    icon={<EditIcon />}
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="blue"
                                                    onClick={() => onEdit && onEdit(client)}
                                                />
                                            </Tooltip>
                                            <Tooltip label="Eliminar cliente">
                                                <IconButton
                                                    icon={<DeleteIcon />}
                                                    size="sm"
                                                    variant="ghost"
                                                    colorScheme="red"
                                                    onClick={() => onDelete && onDelete(client)}
                                                />
                                            </Tooltip>
                                        </HStack>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>

                {/* Mensaje cuando no hay resultados */}
                {paginatedClients.length === 0 && (
                    <Box p={8} textAlign="center">
                        <VStack spacing={2}>
                            <ViewIcon boxSize={8} color="gray.400" />
                            <Text color="gray.500">
                                {clients.length === 0
                                    ? 'No hay clientes cargados'
                                    : 'No se encontraron clientes con los filtros aplicados'
                                }
                            </Text>
                        </VStack>
                    </Box>
                )}
            </Box>

            {/* Paginación */}
            {totalPages > 1 && (
                <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500">
                        Página {currentPage} de {totalPages}
                    </Text>

                    <HStack>
                        <Button
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            isDisabled={currentPage === 1}
                        >
                            Anterior
                        </Button>

                        {/* Números de página */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            return (
                                <Button
                                    key={pageNum}
                                    size="sm"
                                    variant={currentPage === pageNum ? "solid" : "ghost"}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}

                        <Button
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            isDisabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </HStack>
                </Flex>
            )}
        </VStack>
    )
}

export default ClientTable