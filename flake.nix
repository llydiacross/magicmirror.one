{

  # Copyright (C) {0x0zAgency} - All Rights Reserved
  #
  # Unauthorized copying of this file, via any medium is strictly prohibited
  # Proprietary and confidential
  # Written by Llydia Cross <llydia@0x0zAgency.me> 2021-2024

  description = "Gaia Nix Flake";

  inputs = {
    nixpkgs = { url = "github:nixos/nixpkgs/nixos-unstable"; };
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs = { nixpkgs.follows = "nixpkgs"; };
    };
    napalm = { url = "github:nix-community/napalm"; };
  };

  outputs = { self, nixpkgs, flake-utils, napalm, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        inputLock = (builtins.fromJSON (builtins.readFile ./package-lock.json));
        version = builtins.substring 0 8 self.lastModifiedDate;
        supportedSystems = [
          "x86_64-linux"
          "aarch64-linux"
          "i686-linux"
          "x86_64-darwin"
          "aarch64-darwin"
        ];

        forAllSystems = f:
          nixpkgs.lib.genAttrs supportedSystems (system: f system);

        # Nixpkgs instantiated for supported system types.
        nixpkgsFor = forAllSystems (system:
          import nixpkgs {
            inherit system;
            overlays = [ self.overlays.default napalm.overlays.default ];
          });

        
        rewriteDep = package:
          package // (if package ? resolved then {
            resolved = "file://${
                pkgs.fetchurl {
                  url = package.resolved;
                  outputHashAlgo =
                    builtins.elemAt (builtins.split "-" package.integrity) 0;
                  outputHash =
                    builtins.elemAt (builtins.split "-" package.integrity) 2;
                }
              }";
          } else
            { }) // (if package ? dependencies then {
              dependencies = rewriteDeps package.dependencies;
            } else
              { });

        rewriteDeps = dependencies:
          builtins.mapAttrs (name: rewriteDep) dependencies;

        outputLock = builtins.toJSON ({
          lockfileVersion = 2;
          dependencies = rewriteDeps inputLock.dependencies;
        });

        gaia = pkgs.stdenv.mkDerivation {
          name = "gaia";

          nativeBuildInputs = [ pkgs.nodejs-18_x ];

          src = ./.;

          passAsFile = [ "packageLock" ];

          packageLock = outputLock;

          NO_UPDATE_NOTIFIER = true;

          installPhase = ''
            cp --no-preserve=mode -r $src $out
            cd $out
            cp $packageLockPath package-lock.json
            npm ci --production
          '';
        };
      in {
        devShells.default = import ./shell.nix { inherit pkgs; };
        overlays = {
          default = final: prev: {
            gaia = final.napalm.buildPackage ./gaia-result { };
          };
        };

        packages = forAllSystems (system: {
          inherit (nixpkgsFor.${system}) gaia;

          default = self.packages.${system}.gaia;
        });
      });
}
