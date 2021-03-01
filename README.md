# workuniversity-test

## Instalar dependencias
```bash
npm install
```
## Configurar base de datos
1. Cree una base de datos en blanco y una segunda base de datos en blanco para los test.
2. crear archivo .env y llenar de acuerdo a .env.template
2. correr migraciones:
```bash
npm run migrate up
```
```bash
npm run migrate-test up
```
## Correr Test
```bash
npm test
```
## Correr Servidor
```bash
npm run serve
```
