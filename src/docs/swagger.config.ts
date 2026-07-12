import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Graduation Project Backend API',
    version: '1.0.0',
    description: 'API documentation for the Graduation Project Backend',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:{port}',
      description: 'Development server',
      variables: {
        port: {
          default: '3000',
          description: 'Server port',
        },
      },
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
        },
      },
      Success: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'object',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
    {
      name: 'System',
      description: 'System status and configuration endpoints',
    },
    {
      name: 'Devices',
      description: 'Device management endpoints',
    },
    {
      name: 'Rules',
      description: 'Rules management endpoints',
    },
    {
      name: 'Services',
      description: 'Service management endpoints',
    },
    {
      name: 'Alerts',
      description: 'Security alert queue management endpoints',
    },
    {
      name: 'Dashboards',
      description: 'Dashboard management endpoints',
    },
    {
      name: 'LogSources',
      description: 'Log source management endpoints',
    },
  ],
};

const sourceDocsPath = path.join(process.cwd(), 'src/docs/openapi.docs.ts');
const compiledDocsPath = path.join(__dirname, './openapi.docs.js');

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    path.join(__dirname, '../app.{ts,js}'),
    fs.existsSync(sourceDocsPath) ? sourceDocsPath : compiledDocsPath,
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
