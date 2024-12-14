#!/bin/bash

# Crear directorio para los sockets X11
mkdir -p /tmp/.X11-unix
chmod 1777 /tmp/.X11-unix

# Iniciar la aplicación Node.js
node server.js