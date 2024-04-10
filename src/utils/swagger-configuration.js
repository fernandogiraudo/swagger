export const swaggerConfiguration = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación API de adopción',
            description: 'Es una API de adopción de mascotas'
        },
    },
    apis: ['src/docs/**/*.yaml']
}