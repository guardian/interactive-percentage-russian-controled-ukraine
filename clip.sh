

#reproject

for i in *
do
for d in $i/*
do

mapshaper $d/*.shp -proj wgs84 -o $d/reprojected.json format=geojson

done
done

for i in *
do
for d in $i/*.shp
do

mapshaper $d -proj wgs84 -o $(dirname "$d")/reprojected.json format=geojson

done
done


#clip topojson

for i in *
do
for d in $i/*
do

mapshaper ../gis/data/UKR_adm1.shp -clip  $d/reprojected.json -o $d/clipped.json

done
done

#make topojson

for i in *
do
for d in $i/*
do

mapshaper $d/*.shp -proj wgs84 -o $d/reprojected-topo.json format=topojson

done
done

for d in *
do

mapshaper /Users/pablo_gutierrez/Documents/guardian/20221123-interactive-russian-controlled-area/gis/ukraine_map/UKR_adm1.shp -clip  $d/reprojected.json -o $d/clipped.json

done

for d in *
do

done

mapshaper -i *.json snap combine-files -merge-layers name=merged-layers -simplify weighted 3% -o ukraine-claimed-topo.json format=topojson target=merged-layers bbox prettify force

ogrmerge.py -f GPKG -o merged.gpkg *.json

ogrmerge.py -single -o merged.json *.json -f GPKG germany.shp -src_layer_field_name country




for i in *
do
for d in $i/*
do

mapshaper $d/area.json -proj wgs84 -o $d/area-topo.json format=topojson

done
done

arr=()

for i in *
do
for d in $i/*
do

arr+=$d/area-topo.json

done
done

echo $arr

for i in *
do
for d in $i/*
do
mapshaper -i *.json snap combine-files -merge-layers name=merged-layers -simplify weighted 99% -o ./output-topo.json format=topojson target=merged-layers bbox prettify force

mapshaper -i *.json -o geojson/ format=geojson
