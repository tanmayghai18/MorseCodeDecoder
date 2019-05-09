(function() {

var fullofstars = window.fullofstars = window.fullofstars || {};

fullofstars.LIGHT_YEAR = 9.4607 * Math.pow(10, 15);
fullofstars.MILKY_WAY_DIAMETER = 140 * 1000 * fullofstars.LIGHT_YEAR;
fullofstars.UNIVERSE_SCALE = 1000 / fullofstars.MILKY_WAY_DIAMETER;
fullofstars.UNIVERSE_SCALE_RECIPROCAL = 1.0 / fullofstars.UNIVERSE_SCALE;
fullofstars.LIGHT_YEAR_SCALED = fullofstars.LIGHT_YEAR * fullofstars.UNIVERSE_SCALE;
fullofstars.LIGHT_SPEED = 299792458;
fullofstars.LIGHT_SPEED_SCALED = fullofstars.LIGHT_SPEED * fullofstars.UNIVERSE_SCALE;
fullofstars.LIGHT_SPEED_SCALED_SQRD = fullofstars.LIGHT_SPEED_SCALED * fullofstars.LIGHT_SPEED_SCALED;
fullofstars.GRAVITATIONAL_CONSTANT = 0.5 * 6.673e-11;
fullofstars.G = 6.673e-11;
fullofstars.G_SCALE = 0.5;
fullofstars.GRAVITY_EPSILON = 3*Math.pow(10, 19);
fullofstars.TYPICAL_STAR_MASS = 2 * Math.pow(10, 30);
// system parameters
fullofstars.NUMBLACKHOLES = 1; // default : 1
fullofstars.BODYCOUNT = 500; // default: 500
fullofstars.BODYCOUNT_VFX = 20000; // default: 20000
fullofstars.BODYCOUNT_GAS = 450; //default: 300

fullofstars.displayGUI = function() {
    var testParameters = function() {
        this.message = 'dat.gui';
        this.speed = 0.8;
        this.displayOutline = false;
    };

    function displayGUI() {
        console.log("displaying the dat.gui GUI");
        console.log(fullofstars.NUMBLACKHOLES);
        var text = new testParameters();
        var gui = new dat.GUI();
        gui.add(text, 'message');
        gui.add(text, 'speed', -5, 5);
        gui.add(text, 'displayOutline');
    }
};

})();
