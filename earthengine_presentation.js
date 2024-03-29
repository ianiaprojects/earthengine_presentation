
// Location for bounds, in this case my home, Sorin Titel. no. 12.
var home = ee.Geometry.Point(21.227077, 45.743385);

// Add the point to the map.
Map.addLayer(home);

// Dates of interest.
var start  = ee.Date('2016-11-28');
var finish = ee.Date('2017-01-28');

// Create image collection.
var SorinTitel = ee.ImageCollection('LANDSAT/LC8_SR')
.filterBounds(home)
.filterDate  (start, finish)
.sort        ('CLOUD_COVER', true);

// Get the number of images.
var count = SorinTitel.size();
print('Number of Landsat 8 images:', count);

// Sort by a cloud cover property, and get the cloudiest image.
var cloudiest = ee.Image(SorinTitel.sort('CLOUD COVER').first());
print('Cloudiest images is:', cloudiest);

// Print image info.
print(cloudiest.date());
print(cloudiest.id());

// Get the cloudy image.
var cloudy_scene = ee.Image(cloudiest);
Map.centerObject(cloudy_scene);

// Add true color composite to map.
Map.addLayer(cloudy_scene,{min:0,max:3000,bands:['B4','B3','B2']},'cloudy');

// DETAILS FOR cfmask.

// 0 = clear
// 1 = water
// 2 = shadow
// 3 = snow
// 4 = cloud

// Select cfmask band as mask.
var msk = cloudy_scene.select('cfmask');

// Conditions which to mask out - no shadows, no snow or clouds.
msk = msk.neq(2).neq(msk.neq(3)).and(msk.neq(4));

// Apply mask
var masked = cloudy_scene.mask(msk)

// Add masked image to Layer
Map.addLayer(masked,{min:0,max:3000,bands:['B4', 'B3', 'B2']},'masked');
//Map.addLayer(masked,{min:0,max:3000,bands:['B5']},'masked');
//Map.addLayer(masked,{min:0,max:3000,bands:['B6']},'masked');


// EXPORTING THE SELECTED LANDSAT IMAGE

// Select bands for export
//var bands = ['B2','B3','B4','B5','B9'];

// Export the image, specifying scale and region to GoogleDrive - better not -_- .
//    Export.image.toDrive({
//      image: masked.select(bnds),
//      description: 'MaskedLS5',
//      scale: 30,
//      region: geometry
//    });