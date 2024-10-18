{ pkgs ? (let
  inherit (builtins) fetchTree fromJSON readFile;
  inherit ((fromJSON (readFile ./flake.lock)).nodes) nixpkgs gomod2nix;
in import (fetchTree nixpkgs.locked) {
  overlays = [ (import "${fetchTree gomod2nix.locked}/overlay.nix") ];
}) }:

let
  LANG = "en_US.UTF-8";
  root = ./.;

  pnpm = pkgs.nodePackages.pnpm.override {
    nativeBuildInputs = [ pkgs.makeWrapper ];
    preRebuild = ''
      sed 's/"link:/"file:/g' --in-place package.json
    '';

    postInstall =
      let pnpmLibPath = pkgs.lib.makeBinPath [ nodejs.passthru.python nodejs ];
      in ''
        for prog in $out/bin/*; do
          wrapProgram "$prog" --prefix PATH : ${pnpmLibPath}
        done
      '';
  };

  postgresql = pkgs.postgresql_14;
  nodejs = pkgs.nodejs_20;

in pkgs.mkShell {
  inherit LANG;

  shellHook = ''
    if ! test -d .nix-shell; then
      mkdir .nix-shell
    fi

    export NIX_SHELL_DIR=$PWD/.nix-shell

    # Put the PostgreSQL databases in the project directory.
    export PGDATA=$NIX_SHELL_DIR/db
    export PATH=$PATH:./.node_modules/.bin/

    alias pk='pnpm'
    alias g='git'\
        ga='g add' \
        gcmsg='g commit -m' \
        gp='g push' \
        gl='g pull' \
        gst='g status'
    alias ls='exa'
  '';

  packages = with pkgs;
    [
      # Dev
      codespell
      eza

      # frontend
      nodejs_20
      nodejs_20.pkgs.pnpm
      nodePackages.uglify-js
      esbuild

      # Go
      #   goEnv
      #   pkgs.gomod2nix

      # Server
      pgcli
      postgresql
	  redis


      # system dependencies
      openssl
      pkg-config
      libiconv
      nixpkgs-fmt

      (pkgs.writeShellScriptBin "pg-stop" ''
        pg_ctl -D $PGDATA -U postgres stop
      '')

	(pkgs.writeShellScriptBin "redis" ''
	  redis-server --daemonize yes
      '')

      (pkgs.writeShellScriptBin "pg-reset" ''
        rm -rf $PGDATA
      '')

      (pkgs.writeShellScriptBin "pg-setup" ''
        if ! test -d $PGDATA; then
          pg_ctl initdb -D  $PGDATA

          # If another `nix-shell` is  running with a PostgreSQL
          # instance,  the logs  will show  complaints that  the
          # default port 5432  is already in use.
          if [[ "$PGPORT" ]]; then
            sed -i "s|^#port.*$|port = $PGPORT|" $PGDATA/postgresql.conf
          fi
          echo "listen_addresses = ${"'"}${"'"}" >> $PGDATA/postgresql.conf
          echo "unix_socket_directories = '$PGDATA'" >> $PGDATA/postgresql.conf
          echo "CREATE USER postgres WITH PASSWORD 'postgres' CREATEDB SUPERUSER;" | postgres --single -E postgres
        fi
      '')

      (pkgs.writeShellScriptBin "pg-start" ''
        ## # Postgres Fallback using docker
        ## docker run -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:14

        [ ! -d $PGDATA ] && pg-setup

        HOST_COMMON="host\s\+all\s\+all"
        sed -i "s|^$HOST_COMMON.*127.*$|host all all 0.0.0.0/0 trust|" $PGDATA/pg_hba.conf
        sed -i "s|^$HOST_COMMON.*::1.*$|host all all ::/0 trust|"      $PGDATA/pg_hba.conf

        pg_ctl                                                  \
          -D $PGDATA                                            \
          -l $PGDATA/postgres.log                               \
          -o "-c unix_socket_directories='$PGDATA'"             \
          -o "-c listen_addresses='*'"                          \
          -o "-c log_destination='stderr'"                      \
          -o "-c logging_collector=on"                          \
          -o "-c log_directory='log'"                           \
          -o "-c log_filename='postgresql-%Y-%m-%d_%H%M%S.log'" \
          -o "-c log_min_messages=info"                         \
          -o "-c log_min_error_statement=info"                  \
          -o "-c log_connections=on"                            \
          start
      '')

      (pkgs.writeShellScriptBin "pg-console" ''
        psql --host $PGDATA -U postgres
      '')

    ] ++ lib.optionals pkgs.stdenv.isDarwin (with pkgs.darwin.apple_sdk; [
      frameworks.CoreFoundation
      frameworks.Security
      frameworks.SystemConfiguration
      frameworks.CoreServices
    ]);
}
