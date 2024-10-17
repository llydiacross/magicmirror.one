{ pkgs ? import <nixpkgs> { }
, pkgsLinux ? import <nixpkgs> { system = "x86_64-linux"; } }:

# Copyright (C) {0x0zAgency} - All Rights Reserved
#
# Unauthorized copying of this file, via any medium is strictly prohibited
# Proprietary and confidential
# Written by Llydia Cross <llydia@0x0zAgency.me> 2021-2024

let
  # For now just overwrite these before you deploy.
  project_name = "gaia.app";
  project_path_in_server = "gaia_app";
in rec {
  buildDocker = pkgs.dockerTools.buildLayeredImage {
    name = "Gaia-Beta";
    tag = "latest";
    contents = [ pkgs.gaia-docker ];
  };

  nginx = let
    nginxPort = "80";
    nginxConf = pkgs.writeText "nginx.conf" ''
      user nobody nobody;
      daemon off;
      error_log /dev/stdout info;
      pid /dev/null;
      events {}
      http {
      	access_log /dev/stdout;
      	server {
      	listen ${nginxPort};
      	index index.html;
      	location / {
      		root ${nginxWebRoot};
      	}
      	}
      }

      server {

      	root /var/www/${project_path_in_server}/html;
      	index index.html index.htm;

      	server_name ${project_name};

      	location / {
      		try_files $uri $uri/ /index.html$is_args$args;
      	}

      	listen [::]:443 ssl; # managed by Certbot
      	listen 443 ssl; # managed by Certbot
      	ssl_certificate /etc/letsencrypt/live/gaia.app-0001/fullchain.pem; # managed by Certbot
      	ssl_certificate_key /etc/letsencrypt/live/gaia.app-0001/privkey.pem; # managed by Certbot
      	include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
      	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

      	}
      	server {
      	if ($host = ${project_name}) {
      		return 301 https://$host$request_uri;
      	} # managed by Certbot


      	listen 80;
      	listen [::]:80;

      	server_name ${project_name}.gaia.app;
      	return 404; # managed by Certbot
      }
    '';
  in buildLayeredImage {
    name = "nginx-container";
    tag = "latest";
    contents = [ fakeNss pkgs.nginx ];

    extraCommands = ''
      mkdir -p tmp/nginx_client_body
      # nginx still tries to read this directory even if error_log
      # directive is specifying another file :/
      mkdir -p var/log/nginx
    '';

    config = {
      Cmd = [ "nginx" "-c" nginxConf ];
      ExposedPorts = { "${nginxPort}/tcp" = { }; };
    };
  };
}

