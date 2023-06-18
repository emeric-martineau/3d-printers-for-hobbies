# 3D Printers for hobbies

This repository contains sources files to generate web site of `3D Printers for hobbies`.

This repository contains two folders:
 * `data` : contains all printers and manufacturer data
 * `3d-printer-for-hobbies-app` : contains web site static html pages and all javascript script

## Data folder

`static` folder contains static page written in markdown

`printers` contains printer data.

Exemple:
```
/data/printers/
               <manufacturer>/
                              summary-[lang].md    <- summary of manufacturer
                              xxxx.yaml            <- one printer
                              yyyy/                <- printer serie
                                  zzzz.yaml        <- one printer in serie
```
# Licences

Code are covered by Apache License 2.0

Data are covered by Creative Commones Attribution-NonCommercial-ShareAlike 4.0 International
