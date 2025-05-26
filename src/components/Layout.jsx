import {
    Box,
    Flex,
    Heading,
    Spacer,
    Button,
    Icon,
    Text,
    useColorModeValue,
    Container,
    HStack,
    VStack,
    Divider,
    Badge,
    useDisclosure,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    IconButton,
} from '@chakra-ui/react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    HamburgerIcon,
    AtSignIcon,
    AddIcon,
    ViewIcon,
    MoonIcon,
    SunIcon
} from '@chakra-ui/icons'
import { useColorMode } from '@chakra-ui/react'
import { APP_CONFIG, ROUTES } from '../utils/constants'

const Layout = ({ children }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    const location = useLocation()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const bgColor = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const textColor = useColorModeValue('gray.800', 'white')
    const mutedColor = useColorModeValue('gray.600', 'gray.400')

    const navigationItems = [
        {
            label: 'Dashboard',
            path: ROUTES.HOME,
            icon: AtSignIcon,
            description: 'Vista general y estadísticas'
        },
        {
            label: 'Subir Archivo',
            path: ROUTES.UPLOAD,
            icon: AddIcon,
            description: 'Cargar archivos Excel'
        },
        {
            label: 'Clientes',
            path: ROUTES.CLIENTS,
            icon: ViewIcon,
            description: 'Ver y editar clientes'
        },
    ]

    const NavItem = ({ item, onClick = () => {} }) => {
        const isActive = location.pathname === item.path
        const activeColor = useColorModeValue('brand.500', 'brand.300')
        const hoverBg = useColorModeValue('gray.100', 'gray.700')

        return (
            <Box
                as={NavLink}
                to={item.path}
                onClick={onClick}
                p={4}
                borderRadius="lg"
                transition="all 0.2s"
                bg={isActive ? hoverBg : 'transparent'}
                color={isActive ? activeColor : textColor}
                borderLeft={isActive ? '4px solid' : '4px solid transparent'}
                borderColor={isActive ? activeColor : 'transparent'}
                _hover={{
                    bg: hoverBg,
                    color: activeColor,
                    transform: 'translateX(4px)'
                }}
                textDecoration="none"
                display="block"
            >
                <HStack spacing={3}>
                    <Icon as={item.icon} boxSize={5} />
                    <VStack align="start" spacing={0}>
                        <Text fontWeight={isActive ? "600" : "500"}>
                            {item.label}
                        </Text>
                        <Text fontSize="sm" color={mutedColor}>
                            {item.description}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
        )
    }

    const SidebarContent = ({ onClose = () => {} }) => (
        <VStack spacing={1} align="stretch">
            {navigationItems.map((item) => (
                <NavItem key={item.path} item={item} onClick={onClose} />
            ))}
        </VStack>
    )

    return (
        <Flex minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
            {/* Sidebar Desktop */}
            <Box
                w="300px"
                bg={bgColor}
                borderRight="1px"
                borderColor={borderColor}
                p={6}
                display={{ base: 'none', lg: 'block' }}
                position="fixed"
                h="100vh"
                overflowY="auto"
            >
                <VStack spacing={6} align="stretch">
                    {/* Header */}
                    <VStack spacing={2} align="start">
                        <Heading size="lg" color={textColor}>
                            {APP_CONFIG.name}
                        </Heading>
                        <Badge colorScheme="brand" variant="subtle">
                            v{APP_CONFIG.version}
                        </Badge>
                        <Text fontSize="sm" color={mutedColor}>
                            Compilador de datos de clientes
                        </Text>
                    </VStack>

                    <Divider />

                    {/* Navigation */}
                    <SidebarContent />

                    <Spacer />

                    {/* Theme Toggle */}
                    <Button
                        onClick={toggleColorMode}
                        variant="ghost"
                        leftIcon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} />}
                        justifyContent="flex-start"
                    >
                        {colorMode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                    </Button>
                </VStack>
            </Box>

            {/* Sidebar Mobile */}
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <VStack spacing={2} align="start">
                            <Heading size="md">{APP_CONFIG.name}</Heading>
                            <Badge colorScheme="brand" variant="subtle">
                                v{APP_CONFIG.version}
                            </Badge>
                        </VStack>
                    </DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <SidebarContent onClose={onClose} />

                            <Divider />

                            <Button
                                onClick={toggleColorMode}
                                variant="ghost"
                                leftIcon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} />}
                                justifyContent="flex-start"
                            >
                                {colorMode === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                            </Button>
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Main Content */}
            <Box
                flex={1}
                ml={{ base: 0, lg: '300px' }}
                transition="margin-left 0.2s"
            >
                {/* Top Bar Mobile */}
                <Flex
                    bg={bgColor}
                    borderBottom="1px"
                    borderColor={borderColor}
                    px={4}
                    py={3}
                    display={{ base: 'flex', lg: 'none' }}
                    align="center"
                    position="sticky"
                    top={0}
                    zIndex={10}
                >
                    <IconButton
                        icon={<HamburgerIcon />}
                        variant="ghost"
                        onClick={onOpen}
                        aria-label="Abrir menú"
                    />
                    <Spacer />
                    <Heading size="md" color={textColor}>
                        {APP_CONFIG.name}
                    </Heading>
                    <Spacer />
                    <IconButton
                        icon={<Icon as={colorMode === 'light' ? MoonIcon : SunIcon} />}
                        variant="ghost"
                        onClick={toggleColorMode}
                        aria-label="Cambiar tema"
                    />
                </Flex>

                {/* Page Content */}
                <Container maxW="full" p={6}>
                    <Box className="fade-in">
                        {children}
                    </Box>
                </Container>
            </Box>
        </Flex>
    )
}

export default Layout