import {
    Box,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Icon,
    HStack,
    useColorModeValue,
} from '@chakra-ui/react'

const StatsCard = ({
                       label,
                       value,
                       icon,
                       color = 'blue',
                       percentage = null,
                       trend = null
                   }) => {
    const cardBg = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')
    const iconBg = useColorModeValue(`${color}.50`, `${color}.900`)
    const iconColor = useColorModeValue(`${color}.500`, `${color}.300`)

    return (
        <Box
            bg={cardBg}
            borderColor={borderColor}
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            shadow="sm"
            transition="all 0.2s"
            _hover={{
                shadow: 'md',
                transform: 'translateY(-2px)'
            }}
        >
            <Stat>
                <HStack justify="space-between" align="start">
                    <Box>
                        <StatLabel fontSize="sm" color="gray.500">
                            {label}
                        </StatLabel>
                        <StatNumber fontSize="3xl" fontWeight="bold">
                            {value}
                        </StatNumber>
                        {percentage !== null && (
                            <StatHelpText mb={0}>
                                {percentage}% del total
                            </StatHelpText>
                        )}
                    </Box>

                    <Box
                        bg={iconBg}
                        p={3}
                        borderRadius="lg"
                    >
                        <Icon
                            as={icon}
                            boxSize={6}
                            color={iconColor}
                        />
                    </Box>
                </HStack>
            </Stat>
        </Box>
    )
}

export default StatsCard