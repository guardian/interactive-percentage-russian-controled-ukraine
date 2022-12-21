

#reproject

for i in *
do
for d in $i/*
do

#echo $d
#echo $d/*.shp
mapshaper $d/*.shp -proj wgs84 -o $d/reprojected.json format=geojson

done
done


#clip topojson

for i in *
do
for d in $i/*
do

mapshaper /Users/pablo_gutierrez/Documents/guardian/20221123-interactive-russian-controlled-area/gis/ukraine_map/UKR_adm1.shp -clip  $d/reprojected.json -o $d/clipped.json

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

mapshaper -i *.json snap combine-files -rename-layers topo1,topo2,geo,shape -merge-layers name=merged-layers -simplify weighted 3% -o output-topo.json format=topojson target=merged-layers bbox prettify force