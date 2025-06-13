export const globalSchemas = {
  ValidationError: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Validation failed'
      },
      code: {
        type: 'string',
        example: 'VALIDATION_ERROR'
      },
      status: {
        type: 'integer',
        example: 400
      },
      errors: {
        type: 'array',
        description: 'Array of validation errors. Each object describes a single validation failure.',
        items: {
          type: 'object',
          properties: {
            msg:    { type: 'string', example: 'Email is invalid' },
            param:  { type: 'string', example: 'email' },
            location: { type: 'string', example: 'body' },
            value:  { type: 'string', example: 'not-an-email', nullable: true }
          },
          required: ['msg', 'param', 'location']
        }
      }
    },
    required: ['error', 'code', 'status', 'errors']
  },
  InternalServerError: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Internal server error'
      },
      code: {
        type: 'string',
        example: 'INTERNAL_ERROR'
      },
      status: {
        type: 'integer',
        example: 500
      },
    },
    required: ['message', 'code', 'status']
  }
}
