{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell {
  buildInputs =
    [ jq ripgrep git-up gnumake gcc python3 eza nodejs-18_x nodePackages.pnpm ];
  shellHook = ''
                    export PATH="$PWD/node_modules/.bin/:$PATH"
                    alias scripts='jq ".scripts" package.json'
    				alias run='pnpm run'
                    alias g='git' \
                        ga='g add' \
                        gl='g pull' \
                        gf='g fetch' \
                        gp='g push' \
                        gst='g status' \
                        gcm='g commit -m' \
                        gcmsg='g add -A; g commit -am' \
        				gsw='g switch'
  '';
}