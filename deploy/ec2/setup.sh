#!/bin/bash
set -e
exec > >(tee /var/log/user-data.log|logger -t user-data ) 2>&1

# Update and install Docker
apt-get update -y
apt-get install -y docker.io docker-compose-plugin nginx

systemctl enable docker
systemctl start docker

systemctl enable nginx
systemctl start nginx

usermod -aG docker ubuntu
