{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation rec {
  pname = "88x31";
  version = "1.0";

  src = ./.;

  buildPhase = ''
    mkdir -p $out
    cp -r ${src}/* $out/
  '';

  installPhase = ''
    echo "Files copied to $out"
  '';
}
