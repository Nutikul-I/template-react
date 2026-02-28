#FROM nginx
#COPY /build /usr/share/nginx/html
#COPY nginx/default.conf /etc/nginx/conf.d/default.conf
#EXPOSE 8080
#CMD ["touch", "/var/log/ngingx/error.log"]
#CMD ["touch", "/var/log/ngingx/access.log"]
#CMD ["nginx", "-g", "daemon off;"]
# ใช้ nginx base image
FROM nginx:alpine

# คัดลอกไฟล์ build เข้าไปใน nginx web root
COPY build /usr/share/nginx/html

# คัดลอก config nginx เข้าตำแหน่ง default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# เปิดพอร์ต 8080
EXPOSE 8080

# สั่งรัน nginx แบบ foreground
CMD ["nginx", "-g", "daemon off;"]
