import {
    Box,
    Spinner,
    Text,
    VStack,
    Center,
} from '@chakra-ui/react'

const LoadingSpinner = ({
                            size = 'xl',
                            text = 'Cargando...',
                            fullHeight = true
                        }) => {
    return (
        <Center h={fullHeight ? '50vh' : 'auto'} w="full">
            <VStack spacing={4}>
                <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="brand.500"
                    size={size}
                />
                {text && (
                    <Text color="gray.500" fontSize="lg">
                        {text}
                    </Text>
                )}
            </VStack>
        </Center>
    )
}

export default LoadingSpinner