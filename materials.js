window.fullofstars = window.fullofstars || {};

fullofstars.createAllMaterials = function() {

    function createParticleMaterial(texture, size, color, blending, opacity) {
    	return new THREE.PointCloudMaterial({
    		color: color,
    		opacity: opacity,
		    size: size,
		    map: texture,
		    blending: blending,
		    depthTest: false,
		    transparent: true,
		    vertexColors: THREE.VertexColors
	    });
    }

	var starLargeTexture = THREE.ImageUtils.loadTexture("textures/star_large.png");
	var starSmallTexture = THREE.ImageUtils.loadTexture("textures/star_small.png");
	var gasCloudTexture = THREE.ImageUtils.loadTexture("textures/cloud.png");

	return {
		bright: createParticleMaterial(starLargeTexture, 140, 0xffffff, THREE.AdditiveBlending, 0.0),
		brightSmall: createParticleMaterial(starSmallTexture, 80, 0xffffff, THREE.AdditiveBlending, 0.0),
		gasCloud: createParticleMaterial(gasCloudTexture, 900, 0xffffff, THREE.NormalBlending, 0.18)
	}
};
