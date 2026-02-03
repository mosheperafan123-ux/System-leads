FROM nginx:alpine

# Copiar el contenido de la carpeta del proyecto al directorio raíz de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80 (puerto predeterminado para EasyPanel/Nginx)
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
